# Sistema Modular de Customização de Blocos WordPress

## Descrição

Sistema modular e extensível para adicionar customizações aos blocos nativos do WordPress Gutenberg. Permite adicionar facilmente novas propriedades e controles para diferentes tipos de blocos.

## Funcionalidades Incluídas

### ✅ Bloco de Imagem

- **Visibilidade Mobile**: Controle para ocultar imagens em dispositivos móveis

### ✅ Blocos de Texto (Paragraph, Heading, List)

- **Alinhamento Mobile**: Controle para definir alinhamento específico no mobile
  - Esquerda
  - Centro
  - Direita
  - Justificado

## Estrutura dos Arquivos

```
wp-content/plugins/block-customization-system/
├── block-customization-system.php (arquivo principal)
├── editor.js (sistema modular de extensão)
├── frontend.css (estilos modulares)
├── editor.css (indicadores visuais)
└── README.md (documentação)
```

## Instalação Rápida

1. **Criar pasta do plugin:**

   ```bash
   mkdir wp-content/plugins/block-customization-system
   ```

2. **Adicionar arquivos e ativar plugin no WordPress**

## Como Usar

### Interface no Editor

1. Selecione qualquer bloco suportado (imagem, parágrafo, título, lista)
2. No painel lateral direito, procure por **"Customizações Mobile"**
3. Configure as opções disponíveis para cada bloco

### Indicadores Visuais

- **Imagens ocultas**: Badge vermelho "📱 Oculto no Mobile" + borda tracejada
- **Textos com alinhamento**: Badges coloridos com ícones direcionais
  - 🔵 Esquerda | 🟣 Centro | 🟠 Direita | 🟢 Justificado

## Como Adicionar Novas Customizações

### Exemplo: Adicionar Espaçamento Mobile

```php
// No arquivo principal PHP, dentro de register_customizations():
$this->add_block_customization('core/paragraph', array(
    'mobileSpacing' => array(
        'type' => 'string',
        'default' => 'default',
        'control' => 'select',
        'label' => 'Espaçamento Mobile',
        'help' => 'Controla o espaçamento em dispositivos móveis',
        'options' => array(
            'default' => 'Padrão',
            'small' => 'Pequeno',
            'medium' => 'Médio',
            'large' => 'Grande',
            'none' => 'Sem espaçamento'
        ),
        'css_class_prefix' => 'mobile-spacing-'
    )
));
```

```css
/* No arquivo frontend.css */
@media (max-width: 768px) {
  .mobile-spacing-small {
    margin: 10px !important;
  }
  .mobile-spacing-medium {
    margin: 20px !important;
  }
  .mobile-spacing-large {
    margin: 30px !important;
  }
  .mobile-spacing-none {
    margin: 0 !important;
  }
}
```

### Exemplo: Adicionar Controle Toggle

```php
$this->add_block_customization('core/button', array(
    'fullWidthMobile' => array(
        'type' => 'boolean',
        'default' => false,
        'control' => 'toggle',
        'label' => 'Largura total no mobile',
        'help' => array(
            'checked' => 'Botão ocupará toda a largura no mobile',
            'unchecked' => 'Botão manterá largura padrão'
        ),
        'css_class' => 'mobile-full-width'
    )
));
```

## Tipos de Controles Disponíveis

### 1. Toggle (boolean)

```php
'control' => 'toggle',
'help' => array(
    'checked' => 'Texto quando ativado',
    'unchecked' => 'Texto quando desativado'
),
'css_class' => 'classe-css'
```

### 2. Select (dropdown)

```php
'control' => 'select',
'help' => 'Texto de ajuda',
'options' => array(
    'value1' => 'Label 1',
    'value2' => 'Label 2'
),
'css_class_prefix' => 'prefixo-'
```

## Blocos Suportados Nativamente

- **core/image** - Imagens
- **core/paragraph** - Parágrafos
- **core/heading** - Títulos
- **core/list** - Listas
- **core/button** - Botões (configurável)
- **core/group** - Grupos (configurável)
- **core/columns** - Colunas (configurável)

## API para Desenvolvedores

### Hook para Adicionar Customizações

```php
add_action('block_customization_register', function($system) {
    $system->add_block_customization('meu-bloco/customizado', array(
        'minhaPropriedade' => array(
            'type' => 'string',
            'default' => 'valor-padrao',
            'control' => 'select',
            'label' => 'Minha Label',
            'help' => 'Texto de ajuda',
            'options' => array(
                'opcao1' => 'Opção 1',
                'opcao2' => 'Opção 2'
            ),
            'css_class_prefix' => 'minha-classe-'
        )
    ));
});
```

### Acessar Sistema Global

```php
global $block_customization_system;
$customizations = $block_customization_system->get_customizations();
```

## Estrutura de Configuração

```php
array(
    'nomeAtributo' => array(
        'type' => 'boolean|string|number',           // Tipo do atributo
        'default' => 'valor_padrao',                 // Valor padrão
        'control' => 'toggle|select|text|number',    // Tipo de controle
        'label' => 'Label do Controle',              // Texto do label
        'help' => 'Texto de ajuda',                  // Ajuda (string ou array)
        'options' => array(),                        // Opções (para select)
        'css_class' => 'classe-css',                 // Classe CSS (boolean)
        'css_class_prefix' => 'prefixo-'            // Prefixo CSS (select)
    )
)
```

## Breakpoints Padrão

- **Desktop**: > 768px
- **Mobile**: ≤ 768px
- **Mobile Pequeno**: ≤ 480px

### Personalizar Breakpoints

```css
:root {
  --mobile-breakpoint: 768px;
  --mobile-small-breakpoint: 480px;
}
```

## Performance e Compatibilidade

- **WordPress**: 5.0+
- **PHP**: 7.4+
- **Gutenberg**: Nativo
- **Performance**: Otimizado, carrega apenas quando necessário
- **Compatibilidade**: Não interfere com outros plugins

## Exemplos de Uso Futuro

### 1. Sistema de Cores Mobile

```php
'mobileTextColor' => array(
    'type' => 'string',
    'control' => 'select',
    'options' => array(
        'light' => 'Texto Claro',
        'dark' => 'Texto Escuro',
        'brand' => 'Cor da Marca'
    )
)
```

### 2. Tamanhos de Fonte Mobile

```php
'mobileFontSize' => array(
    'type' => 'string',
    'control' => 'select',
    'options' => array(
        'small' => 'Pequena',
        'medium' => 'Média',
        'large' => 'Grande'
    )
)
```

### 3. Animações Mobile

```php
'mobileAnimation' => array(
    'type' => 'boolean',
    'control' => 'toggle',
    'label' => 'Ativar animações no mobile'
)
```

## Suporte e Contribuição

Este sistema foi projetado para ser facilmente extensível. Contributions são bem-vindas para adicionar novos tipos de controles, blocos suportados e funcionalidades.

### Roadmap

- [ ] Controles de cor
- [ ] Controles de número/range
- [ ] Suporte a mais blocos nativos
- [ ] Interface de configuração no admin
- [ ] Export/import de configurações
