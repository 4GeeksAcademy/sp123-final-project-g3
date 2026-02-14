# Login y Registro

**Archivo CSS:** [`src/front/styles/components/login.css`](../../../src/front/styles/components/login.css)

**Páginas React:**
- [`src/front/pages/Login.jsx`](../../../src/front/pages/Login.jsx)
- [`src/front/pages/Registro.jsx`](../../../src/front/pages/Registro.jsx)
- [`src/front/pages/RecuperarContraseña.jsx`](../../../src/front/pages/RecuperarContraseña.jsx)

---

## Clases Principales

### Contenedores

| Clase | Descripción |
|-------|-------------|
| `.login-container` | Contenedor principal centrado con fondo crema |
| `.login-wrapper` | Wrapper flex que contiene imagen y formulario |
| `.login-image` | Imagen lateral (oculta en móvil, visible desktop) |
| `.login-form` | Formulario con ancho máximo de 512px |

### Formularios

| Clase | Descripción |
|-------|-------------|
| `.form-label` | Etiquetas de formulario con color secundario |
| `.form-control` | Inputs con fondo terciario y borde acento |
| `.form-control::placeholder` | Placeholder con opacidad 0.5 |
| `.form-control:focus` | Estado focus con sombra de acento |

### Botones

| Clase | Descripción |
|-------|-------------|
| `.btn-primary` | Botón primario verde con texto blanco |
| `.btn-primary:hover` | Hover con color secundario |
| `.btn-outline-primary` | Botón outline con borde acento |
| `.btn-outline-primary:hover` | Hover con fondo secundario |

### Indicadores de Paso

| Clase | Descripción |
|-------|-------------|
| `.login-indicators` | Contenedor flex de indicadores |
| `.indicator` | Indicador circular gris (inactivo) |
| `.indicator.active` | Indicador alargado con color acento (activo) |

---

## Modifica aquí cuando...

- Necesites cambiar el layout del login/registro
- Quieras modificar los estilos de los inputs (fondo, borde, focus)
- Debas ajustar los colores de los botones o sus estados hover
- Quieras modificar el diseño de los indicadores de paso
- Necesites ajustar cuándo aparece la imagen lateral (actualmente 1200px+)
- Quieras cambiar el espaciado entre elementos del formulario

---

## Breakpoints

| Breakpoint | Cambios |
|------------|---------|
| Móvil (<768px) | Formulario al 100%, sin imagen |
| Tablet (768px+) | Formulario al 90% del contenedor |
| Desktop (1200px+) | Layout horizontal con imagen visible (616px) + formulario (512px) |

---

## Variables Utilizadas

| Variable | Uso |
|----------|-----|
| `--bg-primary` | Fondo de la página |
| `--bg-tertiary` | Fondo de los inputs |
| `--text-secondary` | Color de texto y etiquetas |
| `--color-success` | Botón primario |
| `--color-secondary` | Hover de botones |
| `--color-accent` | Indicador activo |
| `--color-accent-dark` | Borde de inputs |
| `--overlay-accent-25` | Sombra focus de inputs |
