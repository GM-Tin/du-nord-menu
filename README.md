# Menú interactivo Du Nord

Página web estática para explorar los productos del menú según presupuesto, restaurante y tipo de comida. Los precios están expresados en pesos colombianos (COP).

## Estructura

```text
.
├── index.html
├── styles.css
├── app.js
├── data/
│   ├── bocas-de-ceniza.js
│   ├── cafeterias-y-postres.js
│   ├── du-nord-h-y-gli-amici.js
│   ├── du-nord-terrasse.js
│   └── punto-creperia-y-esquina.js
└── images/team/
    ├── moises.jpg
    ├── caceres.jpg
    ├── julian.jpg
    ├── isabella.jpg
    └── geremy.jpg
```

- `index.html` contiene las pestañas **Menú interactivo** y **Lógica y equipo**.
- `styles.css` define el diseño adaptable y las tarjetas ilustradas.
- `app.js` filtra y ordena los productos, cambia de pestaña y actualiza la interpretación de resultados.
- `data/` reúne 495 productos y sus precios, tomados del archivo de menú.
- `images/team/` contiene los retratos del equipo mostrados en la segunda pestaña.

## Modelo de matemáticas discretas

Los restaurantes forman el conjunto `R` y los productos el conjunto `M`. La relación `D ⊆ R × M` vincula restaurantes con sus productos. Para un presupuesto `b`, la página construye el conjunto:

```text
A_b = { m ∈ M | precio(m) ≤ b }
```

Los filtros de restaurante y tipo de comida agregan condiciones; después, un algoritmo ordena las coincidencias por precio. La cardinalidad `|A_b|` se interpreta como la cantidad de opciones disponibles y se actualiza al cambiar los controles.

## Cómo abrirla

Abre `index.html` en un navegador. No requiere instalación ni servidor. El archivo fuente no contiene horarios de apertura o cierre; por eso la interfaz no muestra horas.
