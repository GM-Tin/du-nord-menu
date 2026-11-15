# Menú interactivo Du Nord

Página web estática para explorar el menú por presupuesto, restaurante y tipo de comida. Los precios están en pesos colombianos (COP).

## Estructura

```text
.
├── index.html
├── styles.css
├── app.js
└── data/
    ├── bocas-de-ceniza.js
    ├── cafeterias-y-postres.js
    ├── du-nord-h-y-gli-amici.js
    ├── du-nord-terrasse.js
    └── punto-creperia-y-esquina.js
```

- `index.html` define la página y carga los recursos.
- `styles.css` contiene los estilos y ajustes para móvil.
- `app.js` filtra las opciones y construye las tarjetas.
- `data/` contiene los productos, agrupados por restaurantes.

## Cómo abrirla

Abre `index.html` en un navegador. No requiere instalación ni servidor.

## Datos

Los 495 productos y sus precios se tomaron de `menus_du_nord.xlsx`. El archivo fuente no incluye horarios de apertura o cierre; la página los identifica como no informados.
