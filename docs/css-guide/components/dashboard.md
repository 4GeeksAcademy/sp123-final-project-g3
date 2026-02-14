# Dashboard / Estadísticas

**Archivo CSS:** [`src/front/styles/components/dashboard.css`](../../../src/front/styles/components/dashboard.css)

**Página React:** [`src/front/pages/Estadisticas.jsx`](../../../src/front/pages/Estadisticas.jsx)

---

## Clases Principales

### Contenedores

| Clase | Descripción |
|-------|-------------|
| `.dashboard-page` | Contenedor principal de la página con fondo crema y padding |
| `.dashboard-container` | Contenedor centrado con ancho máximo de 1200px |

### Grid de KPIs

| Clase | Descripción |
|-------|-------------|
| `.kpi-grid` | Grid de tarjetas KPI (1 col móvil → 2 col tablet → 4 col desktop) |
| `.kpi-card` | Tarjeta individual con borde y fondo transparente |
| `.kpi-icon` | Icono circular con fondo y borde |
| `.kpi-label` | Etiqueta descriptiva del KPI |
| `.kpi-value` | Valor numérico grande y en negrita |

### Paneles

| Clase | Descripción |
|-------|-------------|
| `.dashboard-grid-2` | Grid de 2 columnas para paneles |
| `.panel-card` | Panel con borde y esquinas redondeadas |
| `.panel-header` | Cabecera del panel con padding |
| `.panel-title` | Título del panel en negrita |
| `.panel-body` | Cuerpo del panel |
| `.panel-full` | Panel de ancho completo |

### Barras de Progreso

| Clase | Descripción |
|-------|-------------|
| `.progress-list` | Lista vertical de barras de progreso |
| `.progress-row` | Fila individual con label, barra y meta |
| `.progress-label` | Nombre del elemento |
| `.progress-meta` | Información adicional (porcentaje, etc.) |
| `.progress-track` | Contenedor de la barra (fondo gris) |
| `.progress-fill` | Barra de progreso coloreada |

#### Variantes de Color de Progreso

| Clase | Color |
|-------|-------|
| `.progress-fill.is-gray` | Gris (`--color-gray-500`) |
| `.progress-fill.is-teal` | Teal (`--color-accent-dark`) |
| `.progress-fill.is-orange` | Naranja (`--color-warning-light`) |
| `.progress-fill.is-blue` | Azul/Amarillo (`--color-warning-bright`) |
| `.progress-fill.is-purple` | Púrpura (`--color-secondary`) |

### Placeholder de Gráficos

| Clase | Descripción |
|-------|-------------|
| `.chart-placeholder` | Área dashed para gráficos futuros |

---

## Modifica aquí cuando...

- Necesites cambiar el diseño de las tarjetas KPI
- Quieras modificar las barras de progreso (colores, tamaño, forma)
- Debas ajustar la estructura de los paneles
- Quieras cambiar el espaciado entre elementos del dashboard
- Necesites modificar los breakpoints del grid

---

## Breakpoints

| Breakpoint | Grid KPI | Grid Paneles |
|------------|----------|--------------|
| Móvil (<640px) | 1 columna | 1 columna |
| Tablet (640px+) | 2 columnas | 1 columna |
| Desktop (768px+) | 2 columnas | 2 columnas |
| Desktop L (1024px+) | 4 columnas | 2 columnas |

---

## Ejemplo de Estructura HTML Esperada

```jsx
<div className="dashboard-page">
  <div className="dashboard-container">
    
    {/* Grid de KPIs */}
    <div className="kpi-grid">
      <div className="kpi-card">
        <div className="kpi-icon">📊</div>
        <div>
          <p className="kpi-label">Total</p>
          <p className="kpi-value">42</p>
        </div>
      </div>
    </div>
    
    {/* Paneles */}
    <div className="dashboard-grid-2">
      <div className="panel-card">
        <div className="panel-header">
          <h3 className="panel-title">Título</h3>
        </div>
        <div className="panel-body">
          {/* Contenido */}
        </div>
      </div>
    </div>
    
  </div>
</div>
```
