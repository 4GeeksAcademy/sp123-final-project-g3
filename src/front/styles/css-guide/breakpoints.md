# Breakpoints Responsive

Documentación de los breakpoints utilizados en el proyecto.

---

## Breakpoints Disponibles

| Nombre | Valor | Descripción |
|--------|-------|-------------|
| `sm` | **640px** | Móviles grandes, tablets pequeñas |
| `md` | **768px** | Tablets |
| `lg` | **1024px** | Laptops pequeñas |
| `xl` | **1200px** | Desktops |
| `2xl` | **1280px** | Desktops grandes |

---

## Uso en el Proyecto

### Patrón Mobile-First

El proyecto sigue el enfoque **mobile-first**: los estilos base se escriben para móvil, y las media queries amplían para pantallas más grandes.

```css
/* Estilos base - Móvil (sin media query) */
.kpi-grid {
  grid-template-columns: 1fr;
}

/* Tablet pequeña (640px+) */
@media (min-width: 640px) {
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Laptop (1024px+) */
@media (min-width: 1024px) {
  .kpi-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

---

## Ejemplos por Componente

### Kanban Board - Grid de Columnas

```css
/* 1 columna en móvil */
.kanban-board {
  grid-template-columns: 1fr;
}

/* 2 columnas en tablet */
@media (min-width: 640px) {
  .kanban-board {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 3 columnas en laptop */
@media (min-width: 1024px) {
  .kanban-board {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* 5 columnas en desktop grande */
@media (min-width: 1280px) {
  .kanban-board {
    grid-template-columns: repeat(5, 1fr);
  }
}
```

### Login - Layout con Imagen

```css
.login-image {
  display: none; /* Oculto en móvil */
}

@media (min-width: 1200px) {
  .login-image {
    display: block; /* Visible en desktop */
    width: 100%;
    max-width: var(--space-616);
  }
  
  .login-wrapper {
    flex-direction: row; /* Layout horizontal */
  }
}
```

### Navbar - Menú

```css
.navbar-menu {
  flex-wrap: nowrap;
  overflow-x: auto; /* Scroll horizontal en móvil */
}

@media (min-width: 768px) {
  .navbar-menu {
    flex-wrap: wrap;
    overflow-x: visible;
  }
}
```

### Dashboard - KPI Grid

```css
/* Móvil: 1 columna */
.kpi-grid {
  grid-template-columns: 1fr;
}

/* Tablet: 2 columnas */
@media (min-width: 640px) {
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop: 4 columnas */
@media (min-width: 1024px) {
  .kpi-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

### Footer - Columnas

```css
/* Móvil: 1 columna */
.footer-container {
  grid-template-columns: 1fr;
  text-align: center;
}

/* Tablet: 2 columnas */
@media (min-width: 640px) {
  .footer-container {
    grid-template-columns: repeat(2, 1fr);
    text-align: left;
  }
}

/* Desktop: 3 columnas */
@media (min-width: 768px) {
  .footer-container {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

---

## Media Queries Más Comunes

### Solo Tablet en adelante

```css
@media (min-width: 640px) {
  /* Estilos para tablet y superior */
}
```

### Solo Desktop

```css
@media (min-width: 1024px) {
  /* Estilos para laptop/desktop */
}
```

### Pantallas pequeñas (máximo)

```css
@media (max-width: 359px) {
  /* Solo móviles muy pequeños */
}
```

---

## 📱 Dispositivos de Referencia

| Dispositivo | Ancho | Breakpoint |
|-------------|-------|------------|
| iPhone SE | 375px | Móvil base |
| iPhone 12/13/14 | 390px | Móvil base |
| iPad Mini | 768px | `md` |
| iPad Air/Pro | 820-1024px | `md` - `lg` |
| Laptop pequeña | 1024-1280px | `lg` - `2xl` |
| Desktop | 1280px+ | `2xl` |

---

## 💡 Buenas Prácticas

1. **Siempre mobile-first**: Escribe primero para móvil, luego mejora para desktop
2. **Usa `min-width`**: En lugar de `max-width` para seguir el patrón mobile-first
3. **Prueba en dispositivos reales**: No solo en el inspector del navegador
4. **Considera el contenido**: A veces un breakpoint personalizado es mejor que uno estándar
