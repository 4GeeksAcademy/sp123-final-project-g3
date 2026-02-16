# Búsqueda de Empleos

**Archivo CSS:** [`src/front/styles/components/search.css`](../../../src/front/styles/components/search.css)

**Página React:** [`src/front/pages/Buscar.jsx`](../../../src/front/pages/Buscar.jsx)

---

## Clases Principales

### Título de Página

| Clase | Descripción |
|-------|-------------|
| `.page-title` | Título principal en negrita con color primario oscuro |

### Grid de Resultados

| Clase | Descripción |
|-------|-------------|
| `.search-grid` | Grid de tarjetas de resultados (1 col → auto-fill) |

### Página de Búsqueda

| Clase | Descripción |
|-------|-------------|
| `.buscar-page` | Contenedor principal de ancho completo |
| `.buscar-header` | Cabecera con título y campo de búsqueda |
| `.buscar-title-wrap` | Contenedor del título y subtítulo |
| `.buscar-subtitle` | Subtítulo con opacidad 0.75 |

### Campo de Búsqueda

| Clase | Descripción |
|-------|-------------|
| `.buscar-search` | Contenedor relativo del input con ancho máximo 520px |
| `.buscar-search-icon` | Icono de lupa posicionado absolutamente |
| `.buscar-search-input` | Input con padding para icono y bordes redondeados |
| `.buscar-clear` | Botón de limpiar búsqueda |

### Barra de Resultados

| Clase | Descripción |
|-------|-------------|
| `.buscar-results-bar` | Contenedor del contador de resultados |
| `.buscar-results-label` | Badge con número de resultados |

### Lista de Resultados

| Clase | Descripción |
|-------|-------------|
| `.buscar-list` | Lista vertical de tarjetas de empleo |
| `.buscar-rowcard` | Tarjeta individual con efecto glassmorphism |
| `.buscar-rowcard-main` | Contenido principal de la tarjeta |
| `.buscar-rowcard-top` | Fila superior con título y acciones |

### Información del Empleo

| Clase | Descripción |
|-------|-------------|
| `.buscar-job-title` | Título del puesto en negrita |
| `.buscar-job-meta` | Metadatos (empresa, ubicación, fecha) |
| `.buscar-chip` | Chips de información con icono |

### Acciones de Tarjeta

| Clase | Descripción |
|-------|-------------|
| `.buscar-rowcard-actions` | Contenedor de botones de acción |
| `.buscar-rowcard-desc` | Descripción del empleo con opacidad 0.85 |

### Estado Vacío

| Clase | Descripción |
|-------|-------------|
| `.buscar-empty` | Estado cuando no hay resultados |

---

## Modifica aquí cuando...

- Necesites cambiar el diseño del campo de búsqueda
- Quieras modificar las tarjetas de resultados de empleo
- Debas ajustar el grid de resultados
- Quieras cambiar el estilo de los chips de información
- Necesites modificar el estado vacío de búsqueda
- Quieras ajustar el efecto glassmorphism de las tarjetas

---

## Breakpoints

| Breakpoint | Cambios |
|------------|---------|
| Móvil (<768px) | Cabecera vertical, acciones de tarjeta al 100% |
| Tablet (768px+) | Cabecera horizontal, acciones auto-width |

---

## Efecto Glassmorphism

Las tarjetas de búsqueda usan un efecto glassmorphism:

```css
.buscar-rowcard {
  background: var(--overlay-white-78);
  backdrop-filter: blur(6px);
  box-shadow: var(--shadow-buscar);
}
```

---

## Variables Utilizadas

| Variable | Uso |
|----------|-----|
| `--color-primary-dark` | Título de página |
| `--overlay-white-78` | Fondo de tarjetas |
| `--overlay-white-80` | Fondo de input |
| `--overlay-white-70` | Fondo de chips y resultados |
| `--overlay-white-55` | Fondo estado vacío |
| `--shadow-buscar` | Sombra de tarjetas |
| `--border-light` | Bordes de tarjetas y chips |
| `--border-accent` | Borde focus del input |
| `--overlay-accent-12` | Sombra focus del input |
