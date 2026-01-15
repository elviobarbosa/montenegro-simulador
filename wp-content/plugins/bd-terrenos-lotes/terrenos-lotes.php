<?php
/**
 * Plugin Name: Terrenos e Lotes
 * Description: Custom Post Type para gerenciamento de terrenos com lotes mapeados
 * Version: 1.0
 * Author: Elvio Barbosa
 */

if (!defined('ABSPATH')) {
    exit;
}
require_once __DIR__ . '/includes/class-cpt.php';
require_once __DIR__ . '/includes/class-metabox.php';
require_once __DIR__ . '/includes/class-metabox-save.php';
require_once __DIR__ . '/includes/class-enqueue.php';
require_once __DIR__ . '/includes/class-lote-info.php';
require_once __DIR__ . '/includes/class-settings-page.php';
require_once __DIR__ . '/includes/class-facebook-pixel.php';

new TerrenosLotes_CPT();
new TerrenosLotes_MetaBox();
new TerrenosLotes_MetaBoxSave();
new TerrenosLotes_Enqueue();
new TerrenosLotes_LoteInfo();
new TerrenosLotes_SettingsPage();
new TerrenosLotes_FacebookPixel();

function get_terreno_lotes($post_id) {
    $lotes_data = get_post_meta($post_id, '_terreno_lotes', true);
    return $lotes_data ? json_decode($lotes_data, true) : array();
}

function terreno_mapa_shortcode($atts) {
    $atts = shortcode_atts(array(
        'id' => 0,
        'height' => '90vh',
        'width' => '100%',
        'zoom' => null
    ), $atts);
    
    if (!$atts['id']) return '';
    
    $post_id = $atts['id'];
    $latitude = get_post_meta($post_id, '_terreno_latitude', true);
    $longitude = get_post_meta($post_id, '_terreno_longitude', true);
    $lotes_data = get_post_meta($post_id, '_terreno_lotes', true);
    $zoom = $atts['zoom'] ?: get_post_meta($post_id, '_terreno_zoom', true) ?: '18';
    $empreendimento_id = get_post_meta($post_id, '_empreendimento_id', true);
    $api_key = get_option('terreno_google_maps_api_key', '');
    
    if (!$latitude || !$longitude || !$api_key ) {
        return '<p>Mapa não disponível. Verifique a configuração.</p>';
    }

    if (!$empreendimento_id) {
        return '<p>Mapa não disponível. ID do Empreendimento não encontrado.</p>';
    }
    
    $map_id = 'terreno-gmap-' . $post_id;
    $form_html = do_shortcode('[contact-form-7 id="3f5a600" title="Formulário de contato"]');
    $form_html = preg_replace('/\s+/', ' ', $form_html);

    ob_start();
    ?>
    <div id="<?php echo $map_id; ?>" style="background-color: #eaeaea; height: <?php echo esc_attr($atts['height']); ?>; width: <?php echo esc_attr($atts['width']); ?>;">
        <div style="display:flex; align-items: center; justify-content: center; width: 100%; height: 100%"><img src="<?php echo plugins_url( 'images/loading.gif', __FILE__ ); ?>"></div>
    </div>
    <script>
    const terrenoForm = <?php echo json_encode($form_html); ?>;
    let empreedimentosData = [];

    async function loadEmpreendimentos(id) {
        try {
            const res = await fetch(`/wp-json/cvcrm/v1/empreendimentos/${id}?limite_dados_unidade=60`);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            
            return data;
        } catch (err) {
            console.error('Erro ao carregar empreendimento:', err);
            const container = document.getElementById('container');
            if (container) {
                container.innerHTML = "<p>Erro ao carregar empreendimento.</p>";
            }
            throw err;
        }
    }

    function waitForGoogleMaps<?php echo $post_id; ?>() {
        if (typeof google !== 'undefined' && typeof google.maps !== 'undefined') {
            console.log('Dados:', empreedimentosData);
            initTerrenoMap<?php echo $post_id; ?>();
        } else {
            setTimeout(waitForGoogleMaps<?php echo $post_id; ?>, 100);
        }
    }
    if (document.readyState === 'loading') {
        loadEmpreendimentos(<?php echo $empreendimento_id ?>)
        .then(data => {
            empreedimentosData = data;
            waitForGoogleMaps<?php echo $post_id; ?>();
        })
        .catch(err => {
            console.error(err);
        });
    } else {
       waitForGoogleMaps<?php echo $post_id; ?>();
    }

    function formatDecimal(valor) {
        if (valor === null || valor === undefined) return "0,00";

        const numero = Number(valor);
        if (isNaN(numero)) return "0,00";

        const formatado = numero.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        return formatado;
    }

    function formatCurrency(valor) {
        if (valor === null || valor === undefined) return "R$ 0,00";

        const numero = Number(valor);
        if (isNaN(numero)) return "R$ 0,00";

        const formatado = numero.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

        return formatado;
    }

    function infoWindowTemplate(lote) {
        console.log(lote)

        // Validação defensiva
        if (!lote || !lote.situacao) {
            return '<div class="info-window-step1">Dados do lote indisponíveis</div>';
        }

        const { situacao } = lote;
        const disponivel = (!situacao.bloqueada && situacao.vendida === null);
        const statusBadge = `
        <span class="status-badge ${disponivel ? 'status-badge--disponivel' : 'status-badge--indisponivel'}">
        ${disponivel ? 'Disponível' : 'Indisponível'}
        </span>`;

        const buttonBadge = disponivel ? `<button class="button button--primary button--normal" data-js="start">SIMULAR AGORA</button>` : '';

        return `
            <div class="info-window-step1">
                <div class="info-window-step1__header">
                    Bloco ${lote.idbloco} | Lote ${lote.idunidade}
                    <div class="info-window-step1__status">
                        ${statusBadge}
                    </div>
                </div>
                
                <div class="info-window-step1__features">
                    <div class="info-window-step1__feature">
                        <span class="label">Preço do lote</span>
                        <span class="value" data-js="price">${formatCurrency(lote.valor)}</span>
                    </div>

                    <div class="info-window-step1__feature">
                        <span class="label">Área do lote (m2)</span>
                        <span class="value" data-js="area">${formatDecimal(lote.area_privativa)}</span>
                    </div>
                </div>
                <p>Dimensões</p>
                <div class="info-window-step1__dimensions">
                    <div class="info-window-step1__dimension">
                        <span class="label">Frente</span>
                        <span class="value" data-js="front">8,00</span>
                    </div>

                    <div class="info-window__step1-dimension">
                        <span class="label">Fundos</span>
                        <span class="value" data-js="back">8,00</span>
                    </div>

                    <div class="info-window__step1-dimension">
                        <span class="label">Esquerda</span>
                        <span class="value" data-js="left">8,00</span>
                    </div>

                    <div class="info-window__step1-dimension">
                        <span class="label">Direita</span>
                        <span class="value" data-js="right">8,00</span>
                    </div>
                </div>

                ${buttonBadge} 
            </div>
        `;
    }

    function infoWindowTemplateStep2(lote) {
        console.log(`STEP2`, lote)

        // Validação defensiva
        if (!lote) {
            return '<div class="info-window-step2">Dados do lote indisponíveis</div>';
        }

        const price = lote.valor ?? 150000;
        const entradaMin = price * 0.1;
        const entradaMed = (price + entradaMin) / 2;

        const parcelasMin = 1;
        const parcelasMax = 132;
        const parcelasMed = Math.round((parcelasMax + parcelasMin) / 2);

        const financiado = price - entradaMed;
        const valorParcela = financiado / parcelasMed;

        return `
            <div class="info-window-step2">
                <div class="info-window-step1__header">
                    <div>Bloco ${lote.idbloco} | Lote ${lote.idunidade}</div>
                    <div>${price.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}</div>
                </div>

                <!-- Entrada -->
                <div class="simulador" data-js="entrada-slider">
                    
                    <div class="label">Entrada (<span data-js="porcentagem">50%</span>)</div>
                    <div class="simulador__valor-display" data-js="valor-display">
                        ${entradaMed.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}
                    </div>
                   
                    <div class="simulador__slider-wrapper">
                        <input type="range" min="${entradaMin}" max="${price}" value="${entradaMed}" class="simulador__slider">
                    </div>
                </div>

                <!-- Parcelas -->
                <div class="simulador" data-js="parcelas-slider">
                    
                    <div class="label">Qtd. de parcelas</div>
                    <div class="simulador__valor-display" data-js="valor-display">${parcelasMed}</div>
                   
                    <div class="simulador__slider-wrapper">
                        <input type="range" min="${parcelasMin}" max="${parcelasMax}" value="${parcelasMed}" class="simulador__slider">
                    </div>
                </div>

                <!-- Financiado -->
                <div class="simulador valor-financiado">
                    <div class="label">Valor financiado</div>
                    <div class="simulador__valor-display" data-js="valor-financiado">
                        ${financiado.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}
                    </div>
                </div>

                <!-- Valor da parcela -->
                <div class="valor-parcela">
                    <div class="label">Valor da parcela</div>
                    <div class="simulador__valor-display" data-js="valor-parcela">
                        ${valorParcela.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}
                    </div>
                </div>

                <button class="button button--secondary button--normal" data-js="send-wapp">ENVIAR POR WHATSAPP</button>
                <button class="button button--primary button--normal" data-js="send-email">ENVIAR POR EMAIL</button>
                <span class="disclaimer">Essa simulação apresenta uma estimativa de valores conforme suas seleções, não equivale à contratação de um financimanto.</span>
            </div>
        `;
    }

    // async function loadSimulacoes() {
    //     try {
    //         const res = await fetch(`/wp-json/cvcrm/v1/simulacoes`);
    //         const data = await res.json();

    //         if (!Array.isArray(data)) {
    //             console.error("<Nenhuma simulação encontrada.");
    //             return;
    //         }

    //         console.log(data)
    //     } catch (err) {
    //         console.error("Erro ao carregar simulações.");
    //     }
    // }

    // async function loadUnidade(empreendimento, id) {
    //     loading = true;
    //     try {
    //         const res = await fetch(`/wp-json/cvcrm/v1/unidade/${empreendimento}/${id}`);
    //         const data = await res.json();
    //         loading = false;
    //         console.log(data, loading)
    //     } catch (err) {
    //         loading = false;
    //         container.innerHTML = "<p>Erro ao carregar empreendimento.</p>";
    //     }
    // }

    // async function loadEmpreendimentos(id) {
    //     loading = true;
    //     try {
    //         const res = await fetch(`/wp-json/cvcrm/v1/empreendimentos/${id}`);
    //         const data = await res.json();
    //         loading = false;
    //         console.log(data, loading)
    //     } catch (err) {
    //         loading = false;
    //         container.innerHTML = "<p>Erro ao carregar empreendimento.</p>";
    //     }
    // }

    function findUnidade(result, idBloco, idUnidade) {
        const bloco = result.find((b) => b.idbloco === Number(idBloco));
        if (!bloco) return null;

        const unidade = bloco.unidades.find((u) => u.idunidade === Number(idUnidade));
        return unidade || null;
    }


    function initTerrenoMap<?php echo $post_id; ?>() {
        if (typeof google === 'undefined') {
            console.error('Google Maps não carregado');
            return;
        }

        const { etapas } = empreedimentosData;
        const { blocos } = etapas[0];
        
        var mapOptions = {
            center: { lat: <?php echo $latitude; ?>, lng: <?php echo $longitude; ?> },
            zoom: <?php echo $zoom; ?>,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        
        var map = new google.maps.Map(document.getElementById('<?php echo $map_id; ?>'), mapOptions);
        
        var marker = new google.maps.Marker({
            position: { lat: <?php echo $latitude; ?>, lng: <?php echo $longitude; ?> },
            map: map,
            title: 'Localização do Terreno'
        });
        
        <?php if ($lotes_data): ?>
        var lotes = <?php echo $lotes_data; ?>;
        console.log(lotes);
        
        lotes.forEach(function(lote, index) {
            if (lote.coordinates && lote.coordinates.length > 0 && lote.bloco) {
                var polygonCoords = lote.coordinates.map(function(coord) {
                    return { lat: coord.lat, lng: coord.lng };
                });

                const unidade = findUnidade(blocos, lote.bloco, lote.id);

                // Validação defensiva: verifica se unidade existe antes de acessar propriedades
                if (!unidade) {
                    console.warn(`Unidade não encontrada para bloco ${lote.bloco}, lote ${lote.id}`);
                    return; // Pula este lote se unidade não foi encontrada
                }

                const { situacao } = unidade;
                const disponivel = (!situacao.bloqueada && situacao.vendida === null);
                const color = disponivel ? '#5aa381' : '#FF0000';
                console.log(`BLOCOS`, empreedimentosData)
                
                var polygon = new google.maps.Polygon({
                    paths: polygonCoords,
                    strokeColor: color,
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: color,
                    fillOpacity: 0.35,
                    map: map
                });
                
                var infoWindow = new google.maps.InfoWindow({
                    content: infoWindowTemplate(unidade)
                });
                
                polygon.addListener('click', async function(event) {
                    infoWindow.setContent(infoWindowTemplate(unidade));
                    infoWindow.setPosition(event.latLng);
                    infoWindow.open(map);        

                    google.maps.event.addListenerOnce(infoWindow, "domready", function () {
                        const btnStart = document.querySelector('[data-js="start"]');
                        if (btnStart) {
                            btnStart.addEventListener("click", function() {
                                const values = {
                                    ...lote, 
                                    price:  unidade.valor ?? 150000
                                };
                                infoWindow.setContent(infoWindowTemplateStep2(unidade));

                                google.maps.event.addListenerOnce(infoWindow, "domready", function () {
                                    const btnWapp = document.querySelector('[data-js="send-wapp"]');
                                    const btnEmail = document.querySelector('[data-js="send-email"]');
                                    const slider = new NumberSlider(document.querySelector(".info-window-step2"), values);
                                    
                                    const simulacao = slider.getValues();

                                    const send = (isWapp = false) => {
                                        infoWindow.setContent(terrenoForm);

                                        google.maps.event.addListenerOnce(infoWindow, "domready", function () {
                                            const formEl = document.querySelector('.gm-style-iw .wpcf7 form'); 
                                            if (formEl && typeof wpcf7 !== "undefined") {
                                                formEl.addEventListener("keyup", (e) => {
                                                    if (e.target.matches("input[type=tel]")) {
                                                        let value = e.target.value.replace(/\D/g, "");
                                                        value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
                                                        value = value.replace(/(\d)(\d{4})$/, "$1-$2");
                                                        e.target.value = value;
                                                    }
                                                });

                                                document.addEventListener('wpcf7mailsent', function(event) {
                                                    const data = event.detail.inputs;
                                                    const phone = data.find(f => f.name === 'whatsapp')?.value;
                                                    const nome = data.find(f => f.name === 'your-name')?.value;

                                                    let mensagem = `Olá! ${nome}. Aqui estão os dados da simulação:\n\n`;
                                                    mensagem += `Empreendimento: ${empreedimentosData.nome || ''}\n`;
                                                    mensagem += `Bloco: ${unidade.idbloco || ''}\n`;
                                                    mensagem += `Lote: ${unidade.idunidade}\n\n`;
                                                    mensagem += `--------------------------\n\n`;
                                                    mensagem += `Valor do Lote: ${simulacao.preco.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}\n`;
                                                    mensagem += `Entrada: ${simulacao.entrada.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}\n`;
                                                    mensagem += `Qtd. Parcelas: ${simulacao.parcelas}\n`;
                                                    mensagem += `Valor da Parcela: ${simulacao.valorParcela.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}\n`;

                                                    const url = `https://wa.me/55${phone.replace(/\D/g, "")}?text=${encodeURIComponent(mensagem)}`;
                                                    if (isWapp) window.open(url, '_blank');
                                                }, { once: true });

                                                formEl.reset();
                                                formEl.querySelectorAll('.wpcf7-not-valid-tip').forEach(el => el.remove());
                                                formEl.querySelectorAll('.wpcf7-response-output').forEach(el => el.innerHTML = '');
                                                wpcf7.init(formEl);
                                            }
                                        });
                                    };

                                    if (btnEmail) {
                                        btnEmail.addEventListener("click", () => send(false));
                                    }

                                    if (btnWapp) {
                                        btnWapp.addEventListener("click", () => send(true));
                                    }
                                });
                            });
                        }
                    });
                        
                    if (typeof consultarLoteById === 'function') {
                        consultarLoteById(lote.id, <?php echo $post_id; ?>);
                    }
                });
                
                polygon.addListener('mouseover', function() {
                    polygon.setOptions({
                        fillOpacity: 0.6,
                        strokeWeight: 3
                    });
                });
                
                polygon.addListener('mouseout', function() {
                    polygon.setOptions({
                        fillOpacity: 0.35,
                        strokeWeight: 2
                    });
                });
            }
        });
        <?php endif; ?>
    }
    
    if (typeof google !== 'undefined') {
        initTerrenoMap<?php echo $post_id; ?>();
    } 

    class NumberSlider {
        constructor(root, lote) {
            this.root = root;
            this.lote = lote;

            this.values = {
                lote: this.lote.id,
                preco: this.lote.price,
                entrada: 0,
                parcelas: 0,
                valorParcela: 0,
                financiado: 0
            };
            
            this.init();
        }

        init() {
            const entradaSlider = this.root.querySelector("[data-js=entrada-slider] input");
            const entradaDisplay = this.root.querySelector("[data-js=entrada-slider] [data-js=valor-display]");
            const entradaPct = this.root.querySelector("[data-js=entrada-slider] [data-js=porcentagem]");

            const parcelasSlider = this.root.querySelector("[data-js=parcelas-slider] input");
            const parcelasDisplay = this.root.querySelector("[data-js=parcelas-slider] [data-js=valor-display]");

            const financiadoDisplay = this.root.querySelector("[data-js=valor-financiado]");
            const parcelaDisplay = this.root.querySelector("[data-js=valor-parcela]");

            const updateSliderStyle = (slider) => {
                const min = Number(slider.min);
                const max = Number(slider.max);
                const value = Number(slider.value);
                const percent = ((value - min) / (max - min)) * 100;
                slider.style.background = `linear-gradient(to right, #316D78 0%, #316D78 ${percent}%, #ddd ${percent}%, #ddd 100%)`;
            };

            const update = () => {
                const entrada = Number(entradaSlider.value);
                const parcelas = Number(parcelasSlider.value);

                entradaDisplay.innerHTML = entrada.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
                entradaPct.innerHTML = Math.floor((entrada / this.lote.price) * 100) + "%";
                updateSliderStyle(entradaSlider);

                parcelasDisplay.innerHTML = parcelas;
                updateSliderStyle(parcelasSlider);

                const financiado = this.lote.price - entrada;
                financiadoDisplay.innerHTML = financiado.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});

                const valorParcela = financiado / parcelas;
                parcelaDisplay.innerHTML = valorParcela.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});

                this.values = { preco: this.lote.price, entrada, parcelas, valorParcela, financiado };
            };

            update();

            entradaSlider.addEventListener("input", update);
            parcelasSlider.addEventListener("input", update);
        }

        getValues() {
            return this.values;
        }
    }


    </script>
    <?php
    return ob_get_clean();
}
add_shortcode('terreno_mapa', 'terreno_mapa_shortcode');
?>