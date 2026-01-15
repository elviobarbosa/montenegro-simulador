# BD Terrenos & Lotes

Plugin WordPress para gerenciamento de terrenos e lotes com integração ao Google Maps.

## Arquitetura

Este plugin foi refatorado para usar uma arquitetura modular com ES6 Classes e Webpack.

### Estrutura de Diretórios

```
/assets/js/
├── src/                    # Código fonte modular (ES6)
│   ├── core/              # Módulos centrais (StateManager, EventBus, MapManager)
│   ├── managers/          # Gerenciadores de funcionalidades
│   ├── services/          # Serviços auxiliares
│   ├── ui/                # Componentes de interface
│   ├── models/            # Modelos de dados
│   ├── utils/             # Utilitários
│   └── main.js            # Entry point
├── dist/                   # Código compilado (bundle)
└── legacy/                 # Código original (backup)
```

## Desenvolvimento

### Pré-requisitos

- Node.js >= 14
- npm ou yarn

### Instalação

```bash
npm install
```

### Comandos

```bash
# Desenvolvimento (watch mode)
npm run dev

# Build de produção
npm run build

# Lint
npm run lint
```

### Build Process

O código fonte em `/assets/js/src/` é compilado via Webpack para `/assets/js/dist/terreno-admin.bundle.js`.

- **Babel**: Transpila ES6+ para compatibilidade com browsers antigos
- **Webpack**: Bundling e otimização
- **Source Maps**: Gerados para debugging

### Adicionando Novos Módulos

1. Crie o arquivo `.js` na pasta apropriada em `src/`
2. Exporte a classe/função com `export class MinhaClasse {}`
3. Importe onde necessário com `import { MinhaClasse } from './path/to/MinhaClasse'`
4. Execute `npm run build` para recompilar

## Arquitetura dos Módulos

### Core
- **StateManager**: Gerenciamento centralizado de estado
- **EventBus**: Comunicação entre módulos via eventos
- **MapManager**: Gerenciamento da instância do Google Maps

### Managers
- **DrawingManager**: Modo de desenho de polígonos
- **PolygonManager**: CRUD de polígonos no mapa
- **GeocodeManager**: Busca de endereços e coordenadas
- **DataPersistence**: Persistência de dados no WordPress

### Services
- **GoogleMapsService**: Wrapper para Google Maps API
- **CoordinatesService**: Conversão e validação de coordenadas
- **AreaCalculator**: Cálculo de áreas

### UI
- **UIManager**: Controle geral da interface
- **LotesListRenderer**: Renderização da lista de lotes
- **InfoWindowRenderer**: Renderização de info windows

### Models
- **Lote**: Modelo de dados do lote com validação

### Utils
- **DOMHelper**: Helpers para manipulação de DOM
- **ColorGenerator**: Geração de cores para polígonos

## Integração com WordPress

O bundle compilado é enfileirado via `class-enqueue.php`:

```php
wp_enqueue_script(
    'terreno-admin-bundle',
    plugin_dir_url(__FILE__) . '../assets/js/dist/terreno-admin.bundle.js',
    array('jquery', 'google-maps-api'),
    '2.0.0',
    true
);
```

## Notas de Migração

- O código legado foi movido para `/assets/js/legacy/` como backup
- A migração foi feita de forma incremental para manter compatibilidade
- Todos os event listeners são devidamente removidos para evitar memory leaks
- jQuery é tratado como external no Webpack (não bundleado)
