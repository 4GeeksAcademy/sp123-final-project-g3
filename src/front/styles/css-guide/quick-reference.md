# Guía Rápida de Referencia

Tabla rápida para encontrar el archivo CSS que necesitas modificar.

---

## 🔍 Busca por Elemento

| Elemento/Página | Archivo CSS | Documentación |
|-----------------|-------------|---------------|
| **Colores globales** | `base/variables.css` | [Ver variables](variables.md) |
| **Fuentes** | `base/variables.css` | [Ver tipografía](variables.md#tipografía) |
| **Espaciado** | `base/variables.css` | [Ver espaciado](variables.md#espaciado) |
| **Sombras** | `base/variables.css` | [Ver sombras](variables.md#sombras) |

---

## 🔍 Busca por Componente

| Si quieres modificar... | Ve al archivo... | Documentación |
|-------------------------|------------------|---------------|
| Navbar, logo, menú de navegación | `components/navbar.css` | [navbar.md](components/navbar.md) |
| Footer, enlaces del pie | `components/footer.css` | [footer.md](components/footer.md) |
| Login, registro, recuperar contraseña | `components/login.css` | [login.md](components/login.md) |
| Tablero Kanban, columnas, tarjetas de trabajo | `components/kanban.css` | [kanban.md](components/kanban.md) |
| Modales, popups, formularios en modal | `components/modal.css` | [modal.md](components/modal.md) |
| Perfil de usuario, CV, alertas | `components/profile.css` | [profile.md](components/profile.md) |
| Dashboard, KPIs, estadísticas, gráficos | `components/dashboard.css` | [dashboard.md](components/dashboard.md) |
| Búsqueda de empleos, resultados, filtros | `components/search.css` | [search.md](components/search.md) |

---

## 🔍 Busca por Clase CSS

### Layout

| Clase | Ubicación | Archivo |
|-------|-----------|---------|
| `.dashboard-page` | Página dashboard | `dashboard.css` |
| `.board-page` | Página kanban | `kanban.css` |
| `.profile-page` | Página perfil | `profile.css` |
| `.login-container` | Login/registro | `login.css` |

### Navegación

| Clase | Ubicación | Archivo |
|-------|-----------|---------|
| `.top-navbar` | Navbar principal | `navbar.css` |
| `.navbar-menu` | Menú de navegación | `navbar.css` |
| `.nav-item` | Enlace de menú | `navbar.css` |
| `.app-footer` | Footer | `footer.css` |

### Tarjetas

| Clase | Ubicación | Archivo |
|-------|-----------|---------|
| `.kpi-card` | Dashboard KPI | `dashboard.css` |
| `.job-card` | Kanban | `kanban.css` |
| `.panel-card` | Dashboard paneles | `dashboard.css` |
| `.buscar-rowcard` | Búsqueda resultados | `search.css` |
| `.profile-card` | Perfil | `profile.css` |

### Formularios

| Clase | Ubicación | Archivo |
|-------|-----------|---------|
| `.login-form` | Login | `login.css` |
| `.form-control` | Inputs | `login.css` |
| `.modal__form` | Formularios en modal | `modal.css` |

### Botones

| Clase | Ubicación | Archivo |
|-------|-----------|---------|
| `.btn-primary` | Botón primario | `login.css` |
| `.btn-new-postulation` | Botón "+ Nueva" | `navbar.css` |
| `.modal-btn--primary` | Botón modal primario | `modal.css` |
| `.modal-btn--secondary` | Botón modal secundario | `modal.css` |

### Modales

| Clase | Ubicación | Archivo |
|-------|-----------|---------|
| `.modal-overlay` | Fondo modal | `modal.css` |
| `.modal-card` | Contenedor modal | `modal.css` |
| `.modal-header` | Cabecera modal | `modal.css` |
| `.modal-body` | Cuerpo modal | `modal.css` |
| `.modal-footer` | Pie modal | `modal.css` |

### Kanban

| Clase | Ubicación | Archivo |
|-------|-----------|---------|
| `.kanban-board` | Grid de columnas | `kanban.css` |
| `.kanban-column` | Columna individual | `kanban.css` |
| `.col-header` | Cabecera de columna | `kanban.css` |
| `.priority-badge` | Badge de prioridad | `kanban.css` |

### Búsqueda

| Clase | Ubicación | Archivo |
|-------|-----------|---------|
| `.buscar-search-input` | Campo de búsqueda | `search.css` |
| `.buscar-rowcard` | Tarjeta resultado | `search.css` |
| `.buscar-chip` | Chip de información | `search.css` |

---

## 🔍 Busca por Página React

| Página React | Componente | Archivo CSS |
|--------------|------------|-------------|
| `Estadisticas.jsx` | Dashboard | `dashboard.css` |
| `inicio.jsx` | Kanban Board | `kanban.css` |
| `Perfil.jsx` | Perfil | `profile.css` |
| `Buscar.jsx` | Búsqueda | `search.css` |
| `Login.jsx` | Login | `login.css` |
| `Registro.jsx` | Registro | `login.css` |
| `RecuperarContraseña.jsx` | Recuperar | `login.css` |
| `Navbar.jsx` | Navbar | `navbar.css` |
| `Footer.jsx` | Footer | `footer.css` |
| `Postulacion.jsx` | Modal postulación | `modal.css` |

---

## 💡 Tip

Si no encuentras la clase que buscas, usa el buscador del IDE para buscar el nombre de clase en la carpeta `src/front/styles/`.
