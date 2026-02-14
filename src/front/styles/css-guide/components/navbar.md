# Navbar (Barra de Navegación)

**Archivo CSS:** [`src/front/styles/components/navbar.css`](../../../src/front/styles/components/navbar.css)

**Componente React:** [`src/front/components/Navbar.jsx`](../../../src/front/components/Navbar.jsx)

---

## Clases Principales

### Contenedor Principal

| Clase | Descripción |
|-------|-------------|
| `.top-navbar` | Navbar con fondo oscuro, padding y gap |
| `.navbar-top-row` | Fila superior con logo y navegación |

### Logo y Título

| Clase | Descripción |
|-------|-------------|
| `.navbar-left` | Contenedor flex del logo y título |
| `.navbar-logo-box` | Caja del logo blanca con esquinas redondeadas |
| `.navbar__title` | Título "PostulaApp" en blanco y negrita |
| `.navbar__subtitle` | Subtítulo descriptivo con color crema |

### Menú de Navegación

| Clase | Descripción |
|-------|-------------|
| `.navbar-menu` | Menú horizontal con scroll en móvil |
| `.nav-item` | Enlace individual con padding y bordes redondeados |
| `.nav-item:hover` | Estado hover con fondo acento oscuro |
| `.nav-item.active` | Estado activo con fondo blanco y texto oscuro |

### Acciones

| Clase | Descripción |
|-------|-------------|
| `.navbar-actions` | Contenedor de acciones (guardados, perfil) |
| `.btn-new-postulation` | Botón "+ Nueva" blanco con hover |
| `.btn-plus` | Símbolo + del botón |

### Ofertas Guardadas

| Clase | Descripción |
|-------|-------------|
| `.saved-dropdown-wrapper` | Contenedor relativo del dropdown |
| `.btn-saved` | Botón de guardados con icono y contador |
| `.saved-badge` | Contador circular con fondo acento |
| `.saved-dropdown` | Dropdown de ofertas guardadas |
| `.saved-dropdown-header` | Cabecera del dropdown |

---

## Modifica aquí cuando...

- Necesites cambiar el color o tamaño de la navbar
- Quieras modificar el logo o sus dimensiones
- Debas ajustar el menú de navegación (espaciado, scroll, hover)
- Quieras cambiar el estilo del botón "+ Nueva"
- Necesites modificar el dropdown de ofertas guardadas
- Quieras ajustar el comportamiento responsive del menú

---

## Breakpoints

| Breakpoint | Cambios |
|------------|---------|
| Móvil (<640px) | Padding reducido, menú con scroll horizontal |
| Tablet (640px+) | Padding aumentado |
| Desktop (768px+) | Menú sin scroll, wrap permitido |

---

## Variables Utilizadas

| Variable | Uso |
|----------|-----|
| `--color-primary` | Fondo de la navbar |
| `--bg-white` | Logo box, item activo |
| `--bg-primary` | Subtítulo, hover del botón + |
| `--text-white` | Título, items de menú |
| `--color-accent-dark` | Hover de items, badge |
| `--color-primary` | Texto del item activo |
| `--shadow-xl` | Sombra del dropdown |
| `--z-dropdown` | Z-index del dropdown |

---

## Scroll Horizontal en Móvil

El menú tiene scroll horizontal en móviles con las siguientes propiedades:

```css
.navbar-menu {
  flex-wrap: nowrap;
  overflow-x: auto;
  scrollbar-width: none;        /* Firefox */
  -ms-overflow-style: none;     /* IE/Edge */
}

.navbar-menu::-webkit-scrollbar {
  display: none;                /* Chrome/Safari */
}
```

En desktop (`768px+`) se desactiva el scroll y se permite el wrap.
