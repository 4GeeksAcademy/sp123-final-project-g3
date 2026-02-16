# Footer

**Archivo CSS:** [`src/front/styles/components/footer.css`](../../../src/front/styles/components/footer.css)

**Componente React:** [`src/front/components/Footer.jsx`](../../../src/front/components/Footer.jsx)

---

## Clases Principales

### Contenedor

| Clase | Descripción |
|-------|-------------|
| `.app-footer` | Footer principal con fondo oscuro y color crema para texto |
| `.footer-container` | Grid de columnas (1 móvil → 2 tablet → 3 desktop) |

### Columnas

| Clase | Descripción |
|-------|-------------|
| `.footer-col__title` | Título de cada columna (blanco) |
| `.footer-col__text` | Texto descriptivo con opacidad 0.85 |
| `.footer-col__list` | Lista de enlaces sin estilos |
| `.footer-col__item` | Elemento de lista con margen inferior |
| `.footer-col__link` | Enlace con color crema y hover en acento |

### Columnas (Variante)

| Clase | Descripción |
|-------|-------------|
| `.footer-col h4, .footer-col h5` | Títulos de columna alternativos |
| `.footer-col p` | Párrafos con opacidad 0.85 |
| `.footer-col ul` | Listas sin estilos |
| `.footer-col li` | Items con margen inferior |
| `.footer-col a` | Enlaces con hover en acento |

### Pie

| Clase | Descripción |
|-------|-------------|
| `.footer-bottom` | Sección inferior centrada con borde superior |

---

## Modifica aquí cuando...

- Necesites cambiar el color de fondo del footer
- Quieras ajustar el número o ancho de las columnas
- Debas modificar los estilos de los enlaces o títulos
- Quieras cambiar el espaciado interno del footer
- Necesites ajustar el borde superior del footer-bottom

---

## Breakpoints

| Breakpoint | Columnas | Alineación |
|------------|----------|------------|
| Móvil (<640px) | 1 columna | Centrado |
| Tablet (640px+) | 2 columnas | Izquierda |
| Desktop (768px+) | 3 columnas | Izquierda |

---

## Variables Utilizadas

| Variable | Uso |
|----------|-----|
| `--color-primary` | Fondo del footer |
| `--bg-primary` | Color de texto (crema) |
| `--text-white` | Títulos de columnas |
| `--color-accent` | Hover de enlaces |
| `--overlay-cream-20` | Borde superior del footer-bottom |
| `--space-2xl`, `--space-3xl`, `--space-xl` | Espaciado interno |
