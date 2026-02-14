# Guía de Estilos CSS

Documentación completa de la arquitectura CSS del proyecto.

---

## 📁 Estructura de Documentación

```
docs/css-guide/
├── README.md                 # Esta guía - índice principal
├── variables.md              # Variables CSS globales
├── quick-reference.md        # Guía rápida de búsqueda
├── breakpoints.md            # Breakpoints responsive
├── conventions.md            # Convenciones y buenas prácticas
└── components/
    ├── dashboard.md          # Dashboard/Estadísticas
    ├── footer.md             # Footer
    ├── kanban.md             # Tablero Kanban
    ├── login.md              # Login y Registro
    ├── modal.md              # Modales
    ├── navbar.md             # Navbar
    ├── profile.md            # Perfil de usuario
    └── search.md             # Búsqueda de empleos
```

---

## 🚀 Empezar

### ¿Qué necesitas modificar?

| Si quieres cambiar... | Ve a... |
|-----------------------|---------|
| Colores, fuentes, espaciado global | [`variables.md`](variables.md) |
| Navbar, menú, logo | [`components/navbar.md`](components/navbar.md) |
| Footer, enlaces del pie | [`components/footer.md`](components/footer.md) |
| Login, registro, recuperar contraseña | [`components/login.md`](components/login.md) |
| Tablero Kanban, columnas, tarjetas | [`components/kanban.md`](components/kanban.md) |
| Modales, popups | [`components/modal.md`](components/modal.md) |
| Perfil de usuario, CV | [`components/profile.md`](components/profile.md) |
| Dashboard, estadísticas, KPIs | [`components/dashboard.md`](components/dashboard.md) |
| Búsqueda de empleos | [`components/search.md`](components/search.md) |
| Responsive design | [`breakpoints.md`](breakpoints.md) |
| Convenciones de código | [`conventions.md`](conventions.md) |

---

## 📂 Estructura de Estilos del Proyecto

```
src/front/styles/
├── base/
│   └── variables.css          # Variables CSS globales
└── components/
    ├── dashboard.css          # Estilos del Dashboard
    ├── footer.css             # Estilos del Footer
    ├── kanban.css             # Estilos del Kanban
    ├── login.css              # Estilos de Login/Registro
    ├── modal.css              # Estilos de Modales
    ├── navbar.css             # Estilos de Navbar
    ├── profile.css            # Estilos de Perfil
    └── search.css             # Estilos de Búsqueda
```

El archivo [`src/front/index.css`](../../src/front/index.css) es el punto de entrada que importa todos los módulos CSS.

---

## 📖 Documentación Detallada

### Base
- **[Variables CSS](variables.md)** - Todas las variables globales (colores, espaciado, tipografía, etc.)

### Componentes
- **[Dashboard](components/dashboard.md)** - Página de estadísticas y KPIs
- **[Footer](components/footer.md)** - Pie de página
- **[Kanban](components/kanban.md)** - Tablero de postulaciones
- **[Login](components/login.md)** - Login, registro y recuperación
- **[Modal](components/modal.md)** - Ventanas modales
- **[Navbar](components/navbar.md)** - Barra de navegación
- **[Profile](components/profile.md)** - Perfil de usuario
- **[Search](components/search.md)** - Búsqueda de empleos

### Referencia
- **[Guía Rápida](quick-reference.md)** - Tabla de búsqueda rápida
- **[Breakpoints](breakpoints.md)** - Puntos de ruptura responsive
- **[Convenciones](conventions.md)** - Buenas prácticas y convenciones
