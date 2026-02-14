# Modales

**Archivo CSS:** [`src/front/styles/components/modal.css`](../../../src/front/styles/components/modal.css)

**Componentes React:**
- [`src/front/components/Postulacion.jsx`](../../../src/front/components/Postulacion.jsx) (Modal de nueva postulación)

---

## Clases Principales

### Overlay

| Clase | Descripción |
|-------|-------------|
| `.modal-overlay` | Fondo oscuro semitransparente que cubre toda la pantalla |
| `.modal-overlay--padded` | Overlay con padding para centrado |
| `.modal-overlay--high` | Z-index elevado (1200) para modales superpuestos |

### Tarjeta del Modal

| Clase | Descripción |
|-------|-------------|
| `.modal-card` | Contenedor blanco con esquinas redondeadas |
| `.modal-card--small` | Tamaño pequeño (420px máximo) |
| `.modal-card--large` | Tamaño grande (920px máximo), con scroll |

### Cabecera

| Clase | Descripción |
|-------|-------------|
| `.modal-header` | Contenedor flex de cabecera |
| `.modal-header--bordered` | Cabecera con borde inferior y padding |
| `.modal-title` | Título del modal |
| `.modal-title--primary` | Título en negrita con color primario |
| `.modal-close` | Botón de cerrar básico |
| `.modal-close--styled` | Botón de cerrar con hover y padding |

### Cuerpo

| Clase | Descripción |
|-------|-------------|
| `.modal-body` | Cuerpo del modal con margen superior |
| `.modal-body--scrollable` | Cuerpo con scroll automático y padding |

### Grid de Formulario

| Clase | Descripción |
|-------|-------------|
| `.modal-grid` | Grid de 2 columnas para campos |
| `.modal-grid--2col` | Variante de 2 columnas explícita |
| `.modal-field-full` | Campo que ocupa las 2 columnas del grid |

### Campos del Formulario

| Clase | Descripción |
|-------|-------------|
| `.modal__form` / `.post-modal-form` | Formulario dentro del modal |
| `.modal__field` / `.post-field` | Contenedor de campo individual |
| `.modal__label` / `.post-label` | Etiqueta del campo (negrita) |
| `.post-required` | Asterisco rojo para campos obligatorios |
| `.post-span-2` | Campo que ocupa 2 columnas |
| `.modal__textarea` / `.post-textarea` | Área de texto con altura mínima |

### Pie

| Clase | Descripción |
|-------|-------------|
| `.modal-footer` | Pie con botones alineados a la derecha |
| `.modal-footer--bordered` | Pie con borde superior y padding |

### Botones

| Clase | Descripción |
|-------|-------------|
| `.modal-btn` | Botón base del modal |
| `.modal-btn--primary` | Botón primario (fondo oscuro, texto crema) |
| `.modal-btn--secondary` | Botón secundario (fondo card, borde) |
| `.post-btn` / `.post-btn-secondary` | Variantes para formulario de postulación |

---

## Modifica aquí cuando...

- Necesites cambiar el tamaño de los modales (small/large)
- Quieras modificar el layout del formulario dentro del modal
- Debas ajustar los estilos de los botones de acción
- Quieras cambiar el fondo overlay o su opacidad
- Necesites modificar el comportamiento de scroll
- Quieras ajustar el z-index de los modales

---

## Variables de Z-Index

| Variable | Valor | Uso |
|----------|-------|-----|
| `--z-modal` | 1000 | Modales estándar |
| `--z-modal-high` | 1200 | Modales que deben estar por encima |
| `--z-dropdown` | 1000 | Dropdowns dentro de modales |

---

## Tamaños de Modal

| Clase | Ancho | Uso recomendado |
|-------|-------|-----------------|
| `.modal-card--small` | 420px | Confirmaciones, alertas simples |
| `.modal-card--large` | 920px | Formularios complejos, detalles |

---

## Ejemplo de Estructura HTML Esperada

```jsx
<div className="modal-overlay modal-overlay--padded">
  <div className="modal-card modal-card--large">
    
    <div className="modal-header modal-header--bordered">
      <h2 className="modal-title modal-title--primary">Título</h2>
      <button className="modal-close modal-close--styled">×</button>
    </div>
    
    <div className="modal-body modal-body--scrollable">
      <form className="modal__form">
        <div className="modal-grid">
          <div className="modal__field">
            <label className="modal__label">Campo 1</label>
            <input className="form-control" />
          </div>
          <div className="modal__field">
            <label className="modal__label">Campo 2</label>
            <input className="form-control" />
          </div>
          <div className="modal__field modal-field-full">
            <label className="modal__label">Campo largo</label>
            <textarea className="modal__textarea" />
          </div>
        </div>
      </form>
    </div>
    
    <div className="modal-footer modal-footer--bordered">
      <button className="modal-btn modal-btn--secondary">Cancelar</button>
      <button className="modal-btn modal-btn--primary">Guardar</button>
    </div>
    
  </div>
</div>
```
