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
require_once __DIR__ . '/includes/class-cpt-faq.php';
require_once __DIR__ . '/includes/class-cpt-features.php';
require_once __DIR__ . '/includes/class-metabox.php';
require_once __DIR__ . '/includes/class-metabox-save.php';
require_once __DIR__ . '/includes/class-enqueue.php';
require_once __DIR__ . '/includes/class-lote-info.php';
require_once __DIR__ . '/includes/class-settings-page.php';
require_once __DIR__ . '/includes/class-facebook-pixel.php';
require_once __DIR__ . '/includes/class-svg-importer.php';
require_once __DIR__ . '/includes/class-ajax-handlers.php';
require_once __DIR__ . '/includes/class-cvcrm-api.php';
require_once __DIR__ . '/includes/class-template-loader.php';
require_once __DIR__ . '/includes/class-template-functions.php';

new TerrenosLotes_CPT();
new TerrenosLotes_CPT_FAQ();
new TerrenosLotes_CPT_Features();
new TerrenosLotes_MetaBox();
new TerrenosLotes_MetaBoxSave();
new TerrenosLotes_Enqueue();
new TerrenosLotes_LoteInfo();
new TerrenosLotes_SettingsPage();
new TerrenosLotes_FacebookPixel();
new TerrenosLotes_AjaxHandlers();
new TerrenosLotes_TemplateLoader();
new TerrenosLotes_TemplateFunctions();

add_filter('rest_authentication_errors', function($result) {
    // Se já houver um erro, mas for o nosso namespace, liberamos
    if (true === is_wp_error($result)) {
        if (strpos($_SERVER['REQUEST_URI'], '/wp-json/cvcrm/v1') !== false) {
            return null; // 'null' indica ao WP para continuar o processamento
        }
    }
    return $result;
}, 999); // Prioridade alta para rodar depois de plugins de segurança

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
    $tabela_preco_id = get_post_meta($post_id, '_tabela_preco_id', true);
    $api_key = get_option('terreno_google_maps_api_key', '');

    // Dados do SVG Overlay
    $svg_content = get_post_meta($post_id, '_terreno_svg_content', true);
    $svg_bounds = get_post_meta($post_id, '_terreno_svg_bounds', true);
    $svg_rotation = get_post_meta($post_id, '_terreno_svg_rotation', true) ?: '0';
    $shape_mapping = get_post_meta($post_id, '_terreno_shape_mapping', true);

    // Verifica se deve usar SVG overlay ou polígonos tradicionais
    $use_svg_overlay = !empty($svg_content) && !empty($svg_bounds) && !empty($shape_mapping);

    // Dados da Planta Humanizada (Image Overlay)
    $image_url = get_post_meta($post_id, '_terreno_image_url', true);
    $image_bounds = get_post_meta($post_id, '_terreno_image_bounds', true);
    $image_rotation = get_post_meta($post_id, '_terreno_image_rotation', true) ?: '0';
    $image_opacity = get_post_meta($post_id, '_terreno_image_opacity', true) ?: '0.7';

    // Verifica se deve usar Image Overlay (planta humanizada)
    $use_image_overlay = !empty($image_url) && !empty($image_bounds);
    
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

    // Configuração da Tabela de Preços
    const tabelaPrecoConfig = {
        idEmpreendimento: <?php echo $empreendimento_id ? intval($empreendimento_id) : 'null'; ?>,
        idTabela: <?php echo $tabela_preco_id ? intval($tabela_preco_id) : 'null'; ?>
    };

    // Cache dos dados da tabela de preços
    let tabelaPrecoCache = null;

    // Configuração do SVG Overlay
    const svgOverlayConfig = {
        enabled: <?php echo $use_svg_overlay ? 'true' : 'false'; ?>,
        content: <?php echo $use_svg_overlay ? json_encode($svg_content) : 'null'; ?>,
        bounds: <?php echo $use_svg_overlay && $svg_bounds ? $svg_bounds : 'null'; ?>,
        rotation: <?php echo floatval($svg_rotation); ?>,
        mapping: <?php echo $use_svg_overlay && $shape_mapping ? $shape_mapping : '{}'; ?>
    };

    // Configuração da Planta Humanizada (Image Overlay)
    const imageOverlayConfig = {
        enabled: <?php echo $use_image_overlay ? 'true' : 'false'; ?>,
        url: <?php echo $use_image_overlay ? json_encode($image_url) : 'null'; ?>,
        bounds: <?php echo $use_image_overlay && $image_bounds ? $image_bounds : 'null'; ?>,
        rotation: <?php echo floatval($image_rotation); ?>,
        opacity: <?php echo floatval($image_opacity); ?>
    };

    async function loadEmpreendimentos(id) {
        try {
            console.log('[CVCRM] Carregando empreendimento ID:', id);
            const res = await fetch(`/wp-json/cvcrm/v1/empreendimentos/${id}?limite_dados_unidade=60`);

            console.log('[CVCRM] Status da resposta:', res.status, res.statusText);

            if (!res.ok) {
                const errorBody = await res.text();
                console.error('[CVCRM] Erro na resposta:', errorBody);

                let errorMsg = `Erro ao carregar dados do empreendimento (HTTP ${res.status})`;
                if (res.status === 401) {
                    errorMsg = 'Erro de autenticação na API. Verifique as credenciais em Terrenos > Configurações.';
                } else if (res.status === 500) {
                    errorMsg = 'Erro no servidor. Verifique as credenciais da API CV CRM.';
                }

                throw new Error(errorMsg);
            }

            const data = await res.json();
            console.log('[CVCRM] Dados carregados com sucesso');
            return data;
        } catch (err) {
            console.error('[CVCRM] Erro ao carregar empreendimento:', err);
            const mapDiv = document.getElementById('<?php echo $map_id; ?>');
            if (mapDiv) {
                mapDiv.innerHTML = `
                    <div style="display:flex; align-items:center; justify-content:center; height:100%; padding:40px; text-align:center;">
                        <div>
                            <h3 style="color:#d32f2f; margin-bottom:10px;">Erro ao carregar mapa</h3>
                            <p style="color:#666;">${err.message}</p>
                            <p style="color:#999; font-size:12px; margin-top:20px;">
                                Entre em contato com o administrador do site.
                            </p>
                        </div>
                    </div>
                `;
            }
            throw err;
        }
    }

    /**
     * Carrega os dados da tabela de preços (com cache)
     * Endpoint: /wp-json/cvcrm/v1/tabelas/{idEmpreendimento}/{idTabela}
     */
    async function loadTabelaPreco() {
        // Retorna cache se já carregou
        if (tabelaPrecoCache !== null) {
            return tabelaPrecoCache;
        }

        // Verifica se tem configuração de tabela
        if (!tabelaPrecoConfig.idEmpreendimento || !tabelaPrecoConfig.idTabela) {
            return null;
        }

        try {
            const res = await fetch(`/wp-json/cvcrm/v1/tabelas/${tabelaPrecoConfig.idEmpreendimento}/${tabelaPrecoConfig.idTabela}`);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();

            // Armazena no cache
            tabelaPrecoCache = data;
            return data;
        } catch (err) {
            console.error('Erro ao carregar tabela de preços:', err);
            return null;
        }
    }

    /**
     * Busca dados de uma unidade na tabela de preços (usa cache)
     * Retorna: { bloco, unidade, area_privativa, valor_total }
     */
    async function getUnidadeFromTabela(bloco, unidade) {
        const tabela = await loadTabelaPreco();
        if (!tabela || !tabela.unidades) {
            return null;
        }

        // Busca a unidade pelo bloco e número da unidade
        const unidadeData = tabela.unidades.find(u =>
            String(u.bloco) === String(bloco) &&
            (String(u.unidade) === String(unidade) || String(u.idunidade) === String(unidade))
        );

        return unidadeData || null;
    }

    /**
     * Carrega valor da unidade - agora usa tabela de preços com cache
     */
    async function loadUnidadeValor(empreendimentoId, idunidade, bloco = null) {
        // Primeiro tenta buscar na tabela de preços (com cache)
        if (tabelaPrecoConfig.idTabela && bloco) {
            const unidadeTabela = await getUnidadeFromTabela(bloco, idunidade);
            if (unidadeTabela && unidadeTabela.valor_total) {
                return parseFloat(unidadeTabela.valor_total);
            }
        }

        // Fallback: busca no endpoint antigo de unidades
        try {
            const res = await fetch(`/wp-json/cvcrm/v1/unidades/${empreendimentoId}`);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();

            if (data && data.dados && Array.isArray(data.dados)) {
                const unidade = data.dados.find(u => String(u.idunidade) === String(idunidade) || String(u.idunidade_int) === String(idunidade));
                if (unidade && unidade.valor) {
                    return parseFloat(unidade.valor);
                }
            }
            return null;
        } catch (err) {
            console.error('Erro ao carregar valor da unidade:', err);
            return null;
        }
    }

    /**
     * Busca dados completos da unidade na tabela de preços
     * Retorna: { bloco, unidade, area_privativa, valor_total }
     */
    async function getUnidadeDadosCompletos(bloco, idunidade) {
        const unidadeTabela = await getUnidadeFromTabela(bloco, idunidade);
        if (unidadeTabela) {
            return {
                bloco: unidadeTabela.bloco,
                unidade: unidadeTabela.unidade,
                area_privativa: unidadeTabela.area_privativa,
                valor_total: unidadeTabela.valor_total,
                situacao: unidadeTabela.situacao
            };
        }
        return null;
    }

    function calcularPorcentagemVendida(data) {
        if (!data || !data.etapas) return;

        let total = 0;
        let vendidos = 0;

        data.etapas.forEach(etapa => {
            if (etapa.blocos) {
                etapa.blocos.forEach(bloco => {
                    if (bloco.unidades) {
                        bloco.unidades.forEach(unidade => {
                            total++;
                            if (unidade.situacao && unidade.situacao.situacao_mapa_disponibilidade !== 1) {
                                vendidos++;
                            }
                        });
                    }
                });
            }
        });

        const porcentagem = total > 0 ? Math.round((vendidos / total) * 100) : 0;

        const el = document.querySelector('[data-js="porcentagem_vendida"]');
        if (el) {
            const strong = el.querySelector('strong');
            if (strong) {
                strong.textContent = `${porcentagem}%`;
            }
        }
    }

    function waitForGoogleMaps<?php echo $post_id; ?>() {
        if (typeof google !== 'undefined' && typeof google.maps !== 'undefined') {
            initTerrenoMap<?php echo $post_id; ?>();
        } else {
            setTimeout(waitForGoogleMaps<?php echo $post_id; ?>, 100);
        }
    }
    if (document.readyState === 'loading') {
        loadEmpreendimentos(<?php echo $empreendimento_id ?>)
        .then(data => {
            empreedimentosData = data;
            calcularPorcentagemVendida(data);
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
        // Validação defensiva
        if (!lote || !lote.situacao) {
            return '<div class="info-window-step1">Dados do lote indisponíveis</div>';
        }

        const { situacao } = lote;
        const disponivel = (situacao.situacao_mapa_disponibilidade === 1);
        const statusBadge = `
        <span class="status-badge ${disponivel ? 'status-badge--disponivel' : 'status-badge--indisponivel'}">
        ${disponivel ? 'Disponível' : 'Indisponível'}
        </span>`;

        const buttonBadge = disponivel ? `<button class="button button--primary button--normal" data-js="start">SIMULAR AGORA</button>` : '';

        return `
            <div class="info-window-step1">
                <div class="info-window-step1__header">
                    Quadra ${lote.idbloco} | Lote ${lote.nome}
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
        if (!lote) {
            return '<div class="info-window-step2">Dados do lote indisponíveis</div>';
        }

        const price = lote.valor ?? 150000;
        const entradaMin = price * 0.1;
        const entradaInicial = entradaMin; // Começa no mínimo (10%)

        const parcelasMin = 12;  // 1 ano
        const parcelasMax = 144; // 12 anos
        const parcelasInicial = 72; // 6 anos

        const financiado = price - entradaInicial;
        const qtdAnos = Math.ceil(parcelasInicial / 12);
        const totalBaloes = financiado * 0.2 * qtdAnos; // 20% por ano
        const valorBalao = financiado * 0.2;
        const restanteParaMensais = financiado - totalBaloes;
        const valorParcela = restanteParaMensais / parcelasInicial;

        const { situacao } = lote;
        const disponivel = (situacao && situacao.situacao_mapa_disponibilidade === 1);
        const statusBadge = `
        <span class="status-badge ${disponivel ? 'status-badge--disponivel' : 'status-badge--indisponivel'}">
        ${disponivel ? 'Disponível' : 'Indisponível'}
        </span>`;

        return `
            <div class="info-window-step2">
                <div class="info-window-step2__status">
                    ${statusBadge}
                </div>
                <div class="info-window-step1__header">
                    <div>Bloco ${lote.idbloco} | Lote ${lote.nome} | ${formatDecimal(lote.area_privativa)} m²</div>
                    <div>${formatCurrency(price)}</div>
                </div>

                <!-- Entrada -->
                <div class="simulador" data-js="entrada-slider">
                    <div class="label">Entrada (<span data-js="porcentagem">10%</span>)</div>
                    <div class="simulador__valor-display" data-js="valor-display">
                        ${formatCurrency(entradaInicial)}
                    </div>
                    <div class="simulador__slider-wrapper">
                        <input type="range" min="${entradaMin}" max="${price}" value="${entradaInicial}" class="simulador__slider">
                    </div>
                </div>

                <!-- Parcelas -->
                <div class="simulador" data-js="parcelas-slider">
                    <div class="label">Prazo (<span data-js="anos">${qtdAnos} anos</span>)</div>
                    <div class="simulador__valor-display" data-js="valor-display">${parcelasInicial} parcelas</div>
                    <div class="simulador__slider-wrapper">
                        <input type="range" min="${parcelasMin}" max="${parcelasMax}" step="12" value="${parcelasInicial}" class="simulador__slider">
                    </div>
                </div>

                <!-- Financiado -->
                <div class="simulador valor-financiado">
                    <div class="label">Valor financiado</div>
                    <div class="simulador__valor-display" data-js="valor-financiado">
                        ${formatCurrency(financiado)}
                    </div>
                </div>

                <!-- Balão anual -->
                <div class="simulador valor-balao">
                    <div class="label">Balão anual (20%)</div>
                    <div class="simulador__valor-display" data-js="valor-balao">
                        ${formatCurrency(valorBalao)} x ${qtdAnos}
                    </div>
                </div>

                <!-- Valor da parcela -->
                <div class="valor-parcela">
                    <div class="label">Valor da parcela mensal</div>
                    <div class="simulador__valor-display" data-js="valor-parcela">
                        ${formatCurrency(valorParcela)}
                    </div>
                </div>

                <button class="button button--secondary button--normal" data-js="send-wapp">ENVIAR POR WHATSAPP</button>
                <button class="button button--primary button--normal" data-js="send-email">ENVIAR POR EMAIL</button>
                <span class="disclaimer">Essa simulação apresenta uma estimativa de valores conforme suas seleções, não equivale à contratação de um financiamento.</span>
            </div>
        `;
    }

    function findUnidade(result, idBloco, idUnidade) {
        const bloco = result.find((b) => Number(b.idbloco) === Number(idBloco));
        if (!bloco) return null;
        const unidade = bloco.unidades.find((u) => u.idunidade === Number(idUnidade));
        const unidadeResult = {
            ...unidade,
            idbloco: idBloco
        };
        
        return unidadeResult || null;
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
            mapTypeId: google.maps.MapTypeId.SATELLITE
        };

        var map = new google.maps.Map(document.getElementById('<?php echo $map_id; ?>'), mapOptions);

        // InfoWindow compartilhada
        var infoWindow = new google.maps.InfoWindow();

        // Inicializa Image Overlay (planta humanizada) - sempre abaixo dos polígonos/SVG
        if (imageOverlayConfig.enabled && imageOverlayConfig.url && imageOverlayConfig.bounds) {
            initImageOverlay(map);
        }

        // Verifica se deve usar SVG Overlay
        if (svgOverlayConfig.enabled && svgOverlayConfig.content && svgOverlayConfig.bounds) {
            initSVGOverlay(map, blocos, infoWindow);
        } else {
            initPolygons(map, blocos, infoWindow);
        }
    }

    /**
     * Inicializa Image Overlay (planta humanizada) sobre o mapa
     */
    function initImageOverlay(map) {
        class ImageMapOverlay extends google.maps.OverlayView {
            constructor(bounds, imageUrl, rotation, opacity) {
                super();
                this.bounds = bounds;
                this.imageUrl = imageUrl;
                this.rotation = rotation;
                this.opacity = opacity;
                this.div = null;
            }

            onAdd() {
                this.div = document.createElement('div');
                this.div.style.position = 'absolute';
                this.div.style.pointerEvents = 'none';

                const img = document.createElement('img');
                img.src = this.imageUrl;
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.opacity = this.opacity;
                img.style.objectFit = 'contain';
                img.style.pointerEvents = 'none';

                this.div.appendChild(img);

                // Adiciona ao pane de overlay (abaixo do overlayMouseTarget onde ficam os polígonos)
                const panes = this.getPanes();
                panes.overlayLayer.appendChild(this.div);
            }

            draw() {
                const projection = this.getProjection();
                if (!projection || !this.div) return;

                const sw = projection.fromLatLngToDivPixel(
                    new google.maps.LatLng(this.bounds.south, this.bounds.west)
                );
                const ne = projection.fromLatLngToDivPixel(
                    new google.maps.LatLng(this.bounds.north, this.bounds.east)
                );

                if (!sw || !ne) return;

                this.div.style.left = sw.x + 'px';
                this.div.style.top = ne.y + 'px';
                this.div.style.width = (ne.x - sw.x) + 'px';
                this.div.style.height = (sw.y - ne.y) + 'px';
                this.div.style.transform = `rotate(${this.rotation}deg)`;
                this.div.style.transformOrigin = 'center center';
            }

            onRemove() {
                if (this.div) {
                    this.div.parentNode.removeChild(this.div);
                    this.div = null;
                }
            }
        }

        // Cria e adiciona o overlay da planta humanizada
        const overlay = new ImageMapOverlay(
            imageOverlayConfig.bounds,
            imageOverlayConfig.url,
            imageOverlayConfig.rotation,
            imageOverlayConfig.opacity
        );
        overlay.setMap(map);
    }

    /**
     * Inicializa SVG Overlay sobre o mapa
     */
    function initSVGOverlay(map, blocos, infoWindow) {
        // Cria Custom Overlay para o SVG
        class SVGMapOverlay extends google.maps.OverlayView {
            constructor(bounds, svgContent, rotation) {
                super();
                this.bounds = bounds;
                this.svgContent = svgContent;
                this.rotation = rotation;
                this.div = null;
            }

            onAdd() {
                this.div = document.createElement('div');
                this.div.style.position = 'absolute';
                this.div.innerHTML = this.svgContent;
                this.div.className = 'svg-map-overlay';

                const svg = this.div.querySelector('svg');
                if (svg) {
                    svg.style.width = '100%';
                    svg.style.height = '100%';
                    svg.style.pointerEvents = 'auto';
                }

                // Aplica cores baseadas no status das unidades
                this.applyShapeColors(blocos);

                // Adiciona eventos de clique nos shapes
                this.addShapeListeners(blocos, infoWindow, map);

                const panes = this.getPanes();
                panes.overlayMouseTarget.appendChild(this.div);
            }

            draw() {
                const projection = this.getProjection();
                if (!projection || !this.div) return;

                const sw = projection.fromLatLngToDivPixel(
                    new google.maps.LatLng(this.bounds.south, this.bounds.west)
                );
                const ne = projection.fromLatLngToDivPixel(
                    new google.maps.LatLng(this.bounds.north, this.bounds.east)
                );

                if (!sw || !ne) return;

                this.div.style.left = sw.x + 'px';
                this.div.style.top = ne.y + 'px';
                this.div.style.width = (ne.x - sw.x) + 'px';
                this.div.style.height = (sw.y - ne.y) + 'px';
                this.div.style.transform = `rotate(${this.rotation}deg)`;
                this.div.style.transformOrigin = 'center center';
            }

            applyShapeColors(blocos) {
                const svg = this.div.querySelector('svg');
                if (!svg) return;

                const shapes = svg.querySelectorAll('polygon, path, polyline, rect');
                shapes.forEach((shape, index) => {
                    const mappingData = svgOverlayConfig.mapping[index];
                    if (!mappingData) {
                        // Shape não mapeado - semi-transparente
                        shape.style.fill = 'rgba(200, 200, 200, 0.2)';
                        shape.style.stroke = '#999';
                        shape.style.strokeWidth = '1px';
                        return;
                    }

                    // Busca dados da unidade
                    const unidade = findUnidade(blocos, mappingData.bloco, mappingData.lote_id);
                    if (!unidade || !unidade.situacao) {
                        shape.style.fill = 'rgba(200, 200, 200, 0.3)';
                        shape.style.stroke = '#666';
                        return;
                    }

                    const disponivel = unidade.situacao.situacao_mapa_disponibilidade === 1;
                    shape.style.fill = disponivel ? 'rgba(20, 210, 121, 0.5)' : 'rgba(255, 0, 0, 0.5)';
                    shape.style.stroke = disponivel ? '#14d279' : '#FF0000';
                    shape.style.strokeWidth = '2px';
                    shape.style.cursor = 'pointer';
                    shape.dataset.shapeIndex = index;
                    shape.dataset.loteId = mappingData.lote_id;
                    shape.dataset.bloco = mappingData.bloco;
                });
            }

            addShapeListeners(blocos, infoWindow, map) {
                const svg = this.div.querySelector('svg');
                if (!svg) return;

                const shapes = svg.querySelectorAll('polygon, path, polyline, rect');
                shapes.forEach((shape, index) => {
                    const mappingData = svgOverlayConfig.mapping[index];
                    if (!mappingData) return;

                    // Hover
                    shape.addEventListener('mouseenter', () => {
                        const currentFill = shape.style.fill;
                        shape.dataset.originalFill = currentFill;
                        shape.style.fillOpacity = '0.7';
                        shape.style.strokeWidth = '3px';
                    });

                    shape.addEventListener('mouseleave', () => {
                        shape.style.fillOpacity = '0.5';
                        shape.style.strokeWidth = '2px';
                    });

                    // Click
                    shape.addEventListener('click', async (e) => {
                        e.stopPropagation();

                        const unidade = findUnidade(blocos, mappingData.bloco, mappingData.lote_id);
                        if (!unidade) {
                            return;
                        }

                        // Usa a posição do clique diretamente
                        const mapDiv = map.getDiv();
                        const mapRect = mapDiv.getBoundingClientRect();

                        // Posição do clique relativa ao container do mapa
                        const x = e.clientX - mapRect.left;
                        const y = e.clientY - mapRect.top;

                        // Converte para LatLng usando a projection do overlay
                        const projection = this.getProjection();
                        const latLng = projection.fromContainerPixelToLatLng(new google.maps.Point(x, y));

                        // Abre InfoWindow
                        handleShapeClick(unidade, mappingData, latLng, infoWindow, map);
                    });
                });
            }

            onRemove() {
                if (this.div) {
                    this.div.parentNode.removeChild(this.div);
                    this.div = null;
                }
            }
        }

        // Cria e adiciona o overlay
        const overlay = new SVGMapOverlay(
            svgOverlayConfig.bounds,
            svgOverlayConfig.content,
            svgOverlayConfig.rotation
        );
        overlay.setMap(map);

        // Centraliza o mapa nos bounds do SVG
        if (svgOverlayConfig.bounds) {
            const svgBounds = new google.maps.LatLngBounds(
                new google.maps.LatLng(svgOverlayConfig.bounds.south, svgOverlayConfig.bounds.west),
                new google.maps.LatLng(svgOverlayConfig.bounds.north, svgOverlayConfig.bounds.east)
            );
            map.fitBounds(svgBounds);

            // Ajusta zoom se necessário (fitBounds pode deixar muito afastado)
            google.maps.event.addListenerOnce(map, 'bounds_changed', function() {
                const currentZoom = map.getZoom();
                if (currentZoom > 19) {
                    map.setZoom(19);
                }
            });
        }
    }

    /**
     * Ajusta o mapa para garantir que o InfoWindow fique visível
     */
    function adjustMapForInfoWindow(map, position) {
        // Aguarda um momento para o InfoWindow renderizar
        setTimeout(() => {
            const scale = Math.pow(2, map.getZoom());
            const projection = map.getProjection();

            if (projection) {
                const worldCoordinate = projection.fromLatLngToPoint(position);
                // Move o mapa um pouco para cima (offset de 200px aproximadamente)
                const pixelOffset = 200 / scale;
                const newWorldCoordinate = new google.maps.Point(
                    worldCoordinate.x,
                    worldCoordinate.y - pixelOffset
                );
                const newPosition = projection.fromPointToLatLng(newWorldCoordinate);
                map.panTo(newPosition);
            } else {
                // Fallback: apenas centraliza na posição
                map.panTo(position);
            }
        }, 100);
    }

    /**
     * Handler para clique no shape do SVG
     */
    async function handleShapeClick(unidade, mappingData, latLng, infoWindow, map) {
        // Mostra loading
        infoWindow.setContent('<div class="info-window-step2" style="text-align:center;padding:20px;">Carregando...</div>');
        infoWindow.setPosition(latLng);
        infoWindow.open(map);

        // Ajusta o mapa para mostrar o InfoWindow
        adjustMapForInfoWindow(map, latLng);

        // Busca dados da tabela de preços (com cache)
        const dadosTabela = await getUnidadeDadosCompletos(mappingData.bloco, mappingData.lote_id);
        if (dadosTabela) {
            // Atualiza unidade com dados da tabela
            if (dadosTabela.valor_total) {
                unidade.valor = parseFloat(dadosTabela.valor_total);
            }
            if (dadosTabela.area_privativa) {
                unidade.area_privativa = dadosTabela.area_privativa;
            }
        } else {
            // Fallback: busca no endpoint antigo
            const valorApi = await loadUnidadeValor(<?php echo $empreendimento_id; ?>, unidade.idunidade, mappingData.bloco);
            if (valorApi !== null) {
                unidade.valor = valorApi;
            }
        }

        // Mostra simulador
        const values = {
            id: mappingData.lote_id,
            bloco: mappingData.bloco,
            price: unidade.valor ?? 150000
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
                        // Injeta campos hidden com os dados da simulação
                        const formatCurrency = (val) => Number(val).toLocaleString("pt-BR", {style: "currency", currency: "BRL"});

                        const hiddenFields = [
                            { name: 'empreendimento', value: empreedimentosData.nome || '' },
                            { name: 'quadra', value: unidade.idbloco || '' },
                            { name: 'lote', value: unidade.nome || '' },
                            { name: 'idunidade', value: unidade.idunidade || '' },
                            { name: 'valor-lote', value: formatCurrency(simulacao.preco) },
                            { name: 'entrada', value: formatCurrency(simulacao.entrada) },
                            { name: 'valor-financiado', value: formatCurrency(simulacao.financiado) },
                            { name: 'balao-anual', value: `${formatCurrency(simulacao.valorBalao)} x ${simulacao.qtdBaloes}` },
                            { name: 'parcelas', value: simulacao.parcelas },
                            { name: 'valor-parcela', value: formatCurrency(simulacao.valorParcela) }
                        ];

                        hiddenFields.forEach(field => {
                            let input = formEl.querySelector(`input[name="${field.name}"]`);
                            if (!input) {
                                input = document.createElement('input');
                                input.type = 'hidden';
                                input.name = field.name;
                                formEl.appendChild(input);
                            }
                            input.value = field.value;
                        });

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
                            mensagem += `Quadra: ${unidade.idbloco || ''}\n`;
                            mensagem += `Lote: ${unidade.nome}\n\n`;
                            mensagem += `--------------------------\n\n`;
                            mensagem += `Valor do Lote: ${Number(simulacao.preco).toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}\n`;
                            mensagem += `Entrada: ${simulacao.entrada.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}\n`;
                            mensagem += `Valor Financiado: ${simulacao.financiado.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}\n`;
                            mensagem += `Balão Anual (20%): ${simulacao.valorBalao.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})} x ${simulacao.qtdBaloes}\n`;
                            mensagem += `Qtd. Parcelas: ${simulacao.parcelas}\n`;
                            mensagem += `Valor da Parcela Mensal: ${simulacao.valorParcela.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}\n`;

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
    }

    /**
     * Inicializa polígonos tradicionais (modo legado)
     */
    function initPolygons(map, blocos, infoWindow) {
        <?php if ($lotes_data): ?>
        var lotes = <?php echo $lotes_data; ?>;

        lotes.forEach(function(lote, index) {
            if (lote.coordinates && lote.coordinates.length > 0 && lote.bloco) {
                var polygonCoords = lote.coordinates.map(function(coord) {
                    return { lat: coord.lat, lng: coord.lng };
                });

                const unidade = findUnidade(blocos, lote.bloco, lote.id);
                // Validação defensiva: verifica se unidade existe antes de acessar propriedades
                if (!unidade) {
                    return; // Pula este lote se unidade não foi encontrada
                }

                const { situacao } = unidade;
                const disponivel = (situacao.situacao_mapa_disponibilidade === 1);
                const color = disponivel ? '#14d279' : '#FF0000';
                
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
                    // Mostrar loading enquanto busca o valor
                    infoWindow.setContent('<div class="info-window-step2" style="text-align:center;padding:20px;">Carregando...</div>');
                    infoWindow.setPosition(event.latLng);
                    infoWindow.open(map);

                    // Ajusta o mapa para mostrar o InfoWindow
                    adjustMapForInfoWindow(map, event.latLng);

                    // Busca dados da tabela de preços (com cache)
                    const dadosTabela = await getUnidadeDadosCompletos(lote.bloco, lote.id);
                    if (dadosTabela) {
                        // Atualiza unidade com dados da tabela
                        if (dadosTabela.valor_total) {
                            unidade.valor = parseFloat(dadosTabela.valor_total);
                        }
                        if (dadosTabela.area_privativa) {
                            unidade.area_privativa = dadosTabela.area_privativa;
                        }
                    } else {
                        // Fallback: busca no endpoint antigo
                        const valorApi = await loadUnidadeValor(<?php echo $empreendimento_id; ?>, unidade.idunidade, lote.bloco);
                        if (valorApi !== null) {
                            unidade.valor = valorApi;
                        }
                    }

                    // Ir direto para o simulador (step 2)
                    const values = {
                        ...lote,
                        price: unidade.valor ?? 150000
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
                                    // Injeta campos hidden com os dados da simulação
                                    const formatCurrency = (val) => Number(val).toLocaleString("pt-BR", {style: "currency", currency: "BRL"});

                                    const hiddenFields = [
                                        { name: 'empreendimento', value: empreedimentosData.nome || '' },
                                        { name: 'quadra', value: unidade.idbloco || '' },
                                        { name: 'lote', value: unidade.nome || '' },
                                        { name: 'idunidade', value: unidade.idunidade || '' },
                                        { name: 'valor-lote', value: formatCurrency(simulacao.preco) },
                                        { name: 'entrada', value: formatCurrency(simulacao.entrada) },
                                        { name: 'valor-financiado', value: formatCurrency(simulacao.financiado) },
                                        { name: 'balao-anual', value: `${formatCurrency(simulacao.valorBalao)} x ${simulacao.qtdBaloes}` },
                                        { name: 'parcelas', value: simulacao.parcelas },
                                        { name: 'valor-parcela', value: formatCurrency(simulacao.valorParcela) }
                                    ];

                                    hiddenFields.forEach(field => {
                                        let input = formEl.querySelector(`input[name="${field.name}"]`);
                                        if (!input) {
                                            input = document.createElement('input');
                                            input.type = 'hidden';
                                            input.name = field.name;
                                            formEl.appendChild(input);
                                        }
                                        input.value = field.value;
                                    });

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
                                        mensagem += `Quadra: ${unidade.idbloco || ''}\n`;
                                        mensagem += `Lote: ${unidade.nome}\n\n`;
                                        mensagem += `--------------------------\n\n`;
                                        mensagem += `Valor do Lote: ${Number(simulacao.preco).toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}\n`;
                                        mensagem += `Entrada: ${simulacao.entrada.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}\n`;
                                        mensagem += `Valor Financiado: ${simulacao.financiado.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}\n`;
                                        mensagem += `Balão Anual (20%): ${simulacao.valorBalao.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})} x ${simulacao.qtdBaloes}\n`;
                                        mensagem += `Qtd. Parcelas: ${simulacao.parcelas}\n`;
                                        mensagem += `Valor da Parcela Mensal: ${simulacao.valorParcela.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}\n`;

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
                valorBalao: 0,
                qtdBaloes: 0,
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
            const anosDisplay = this.root.querySelector("[data-js=parcelas-slider] [data-js=anos]");

            const financiadoDisplay = this.root.querySelector("[data-js=valor-financiado]");
            const balaoDisplay = this.root.querySelector("[data-js=valor-balao]");
            const parcelaDisplay = this.root.querySelector("[data-js=valor-parcela]");

            const formatCurrency = (valor) => valor.toLocaleString("pt-BR", {style: "currency", currency: "BRL"});

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
                const qtdAnos = Math.ceil(parcelas / 12);

                // Atualiza entrada
                entradaDisplay.innerHTML = formatCurrency(entrada);
                entradaPct.innerHTML = Math.floor((entrada / this.lote.price) * 100) + "%";
                updateSliderStyle(entradaSlider);

                // Atualiza parcelas
                parcelasDisplay.innerHTML = `${parcelas} parcelas`;
                anosDisplay.innerHTML = `${qtdAnos} ano${qtdAnos > 1 ? "s" : ""}`;
                updateSliderStyle(parcelasSlider);

                // Cálculo do financiamento
                const financiado = this.lote.price - entrada;

                // 👉 20% do TOTAL financiado para balões
                const totalBaloes = financiado * 0.2;
                const valorBalao = totalBaloes / qtdAnos;

                // 👉 restante vai para parcelas mensais
                const restanteParaMensais = financiado - totalBaloes;
                const valorParcela = restanteParaMensais / parcelas;

                financiadoDisplay.innerHTML = formatCurrency(financiado);
                balaoDisplay.innerHTML = `${formatCurrency(valorBalao)} x ${qtdAnos}`;
                parcelaDisplay.innerHTML = formatCurrency(valorParcela);

                this.values = {
                    preco: this.lote.price,
                    entrada,
                    parcelas,
                    valorParcela,
                    valorBalao,
                    qtdBaloes: qtdAnos,
                    financiado
                };
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