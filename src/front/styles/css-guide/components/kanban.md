# Kanban Board (Tablero)

**Archivo CSS:** [`src/front/styles/components/kanban.css`](../../../src/front/styles/components/kanban.css)

**Página React:** [`src/front/pages/inicio.jsx`](../../../src/front/pages/inicio.jsx)

---

## Clases Principales

### Página

| Clase | Descripción |
|-------|-------------|
| `.board-page` | Contenedor principal con fondo crema y padding responsive |

### Grid del Tablero

| Clase | Descripción |
|-------|-------------|
| `.kanban-board` | Grid de columnas (1→2→3→5 columnas según breakpoint) |

### Columnas

| Clase | Descripción |
|-------|-------------|
| `.kanban-column` | Columna individual con fondo transparente y borde |
| `.col-header` | Cabecera de columna con color de fondo |
| `.col-title` | Título de la columna |
| `.col-count` | Contador de tarjetas en la columna (badge circular) |
| `.col-body` | Cuerpo de la columna con las tarjetas |

#### Variantes de Color de Cabecera

| Clase | Color | Uso típico |
|-------|-------|------------|
| `.col-header--gray` | `#7c8793` | Estado inicial |
| `.col-header--teal` | `#21616a` | En proceso |
| `.col-header--orange` | `#f39b1e` | Entrevista |
| `.col-header--green` | `#2f8f62` | Oferta |
| `.col-header--maroon` | `#6d3c4f` | Rechazado/Finalizado |

### Tarjetas de Trabajo

| Clase | Descripción |
|-------|-------------|
| `.job-card` | Tarjeta individual de oferta de trabajo |
| `.job-card.is-dragging` | Estado al arrastrar (opacidad reducida) |
| `.job-card:hover` | Efecto hover con elevación y sombra |
| `.job-card-row` | Fila interna flex (título + badge) |
| `.job-title` | Título del puesto en negrita |
| `.job-meta` | Metadatos (empresa, ubicación) |
| `.job-meta-item` | Elemento individual de metadata con icono |

### Prioridad

| Clase | Descripción |
|-------|-------------|
| `.priority-badge` | Badge de prioridad con borde y fondo |
| `.priority-dot` | Punto indicador de color |

#### Variantes de Prioridad

| Badge | Dot | Uso |
|-------|-----|-----|
| `.priority-badge--high` | `.priority-dot--high` | Prioridad alta (rojo) |
| `.priority-badge--medium` | `.priority-dot--medium` | Prioridad media (naranja) |
| `.priority-badge--low` | `.priority-dot--low` | Prioridad baja (azul) |

### Estados de Drag & Drop

| Clase | Descripción |
|-------|-------------|
| `.kanban-column.is-over` | Estado cuando se arrastra sobre la columna (outline dashed) |

---

## Modifica aquí cuando...

- Necesites cambiar el número de columnas en algún breakpoint
- Quieras modificar el diseño de las tarjetas de trabajo
- Debas ajustar los colores de las cabeceras de columna
- Quieras cambiar el estilo de los badges de prioridad
- Necesites modificar los efectos de drag & drop
- Quieras ajustar el espaciado entre columnas o tarjetas

---

## Breakpoints

| Breakpoint | Columnas del Tablero |
|------------|---------------------|
| Móvil (<640px) | 1 columna |
| Tablet (640px+) | 2 columnas |
| Laptop (1024px+) | 3 columnas |
| Desktop (1280px+) | 5 columnas |

---

## Variables de Prioridad

| Variable | Uso |
|----------|-----|
| `--color-priority-high-bg` | Fondo badge alta |
| `--color-priority-high-text` | Texto badge alta |
| `--color-priority-high-dot` | Dot alta |
| `--color-priority-medium-bg` | Fondo badge media |
| `--color-priority-medium-text` | Texto badge media |
| `--color-priority-medium-dot` | Dot media |
| `--color-priority-low-bg` | Fondo badge baja |
| `--color-priority-low-text` | Texto badge baja |
| `--color-priority-low-dot` | Dot baja |
