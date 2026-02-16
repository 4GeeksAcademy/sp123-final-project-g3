# Convenciones y Buenas Prácticas

Guía de estilo para mantener consistencia en el código CSS del proyecto.

---

## Convenciones de Nombres

### Clases CSS

Utilizamos una aproximación **BEM-like** (Block Element Modifier):

```css
/* Bloque */
.kanban-column { }

/* Elemento (separado por guión) */
.col-header { }
.col-body { }

/* Modificador de estado (con is-) */
.job-card.is-dragging { }
.kanban-column.is-over { }

/* Modificador de variante (con --) */
.col-header--teal { }
.col-header--orange { }
.progress-fill.is-gray { }
```

#### Patrones de Nombre

| Patrón | Ejemplo | Uso |
|--------|---------|-----|
| `componente` | `.navbar`, `.modal` | Bloque principal |
| `componente-elemento` | `.navbar-menu`, `.modal-header` | Elemento hijo |
| `componente--variante` | `.modal--large`, `.btn--primary` | Variante de estilo |
| `componente.is-estado` | `.job-card.is-dragging` | Estado temporal |

---

## Variables CSS

### Prefijos Semánticos

| Prefijo | Uso | Ejemplo |
|---------|-----|---------|
| `--color-*` | Colores puros | `--color-primary` |
| `--bg-*` | Fondos | `--bg-primary`, `--bg-card` |
| `--text-*` | Colores de texto | `--text-primary` |
| `--border-*` | Colores de borde | `--border-light` |
| `--space-*` | Espaciado | `--space-lg`, `--space-16` |
| `--radius-*` | Bordes redondeados | `--radius-md` |
| `--shadow-*` | Sombras | `--shadow-lg` |
| `--overlay-*` | Capas transparentes | `--overlay-dark` |
| `--z-*` | Z-index | `--z-modal` |
| `--transition-*` | Transiciones | `--transition-fast` |
| `--font-*` | Tipografía | `--font-size-lg` |

### Reglas para Variables

1. **Usa variables en lugar de valores hardcodeados**:
   ```css
   /* ✅ Correcto */
   padding: var(--space-lg);
   color: var(--color-primary);
   
   /* ❌ Incorrecto */
   padding: 1rem;
   color: #0f2c33;
   ```

2. **Prefiere variables semánticas sobre literales**:
   ```css
   /* ✅ Correcto */
   background: var(--bg-card);
   
   /* ❌ Incorrecto */
   background: var(--color-gray-100);
   ```

---

## Estructura de Archivos

### Orden de Propiedades

Recomendamos el siguiente orden dentro de cada declaración:

```css
.componente {
  /* 1. Posicionamiento y layout */
  position: relative;
  display: flex;
  grid-template-columns: 1fr;
  
  /* 2. Dimensiones */
  width: 100%;
  max-width: var(--max-width-container);
  min-height: 100vh;
  
  /* 3. Espaciado */
  padding: var(--space-lg);
  margin: 0 auto;
  gap: var(--space-md);
  
  /* 4. Fondos y bordes */
  background: var(--bg-primary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  
  /* 5. Tipografía */
  font-size: var(--font-size-base);
  color: var(--text-primary);
  
  /* 6. Efectos */
  box-shadow: var(--shadow-md);
  transition: transform var(--transition-fast);
  
  /* 7. Comportamiento */
  cursor: pointer;
  overflow: hidden;
}
```

### Organización del Archivo

```css
/* ========================================
   COMPONENTE: Nombre del Componente
   Archivo: component.css
   ======================================== */

/* 1. ESTILOS BASE */
.componente { }

/* 2. ELEMENTOS */
.componente-header { }
.componente-body { }
.componente-footer { }

/* 3. MODIFICADORES DE VARIANTE */
.componente--small { }
.componente--large { }

/* 4. ESTADOS */
.componente.is-active { }
.componente.is-disabled { }

/* 5. MEDIA QUERIES */
@media (min-width: 640px) { }
@media (min-width: 768px) { }
@media (min-width: 1024px) { }
```

---

## Responsive Design

### Mobile-First

Siempre escribe primero para móvil, luego amplía:

```css
/* 1. Estilos base - Móvil */
.grid {
  grid-template-columns: 1fr;
}

/* 2. Tablet */
@media (min-width: 640px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 3. Desktop */
@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

### Unidades

| Unidad | Cuándo usar | Ejemplo |
|--------|-------------|---------|
| `rem` | Espaciado, tipografía | `padding: var(--space-lg)` |
| `px` | Bordes, sombras | `border-width: 1px` |
| `%` | Anchos relativos | `width: 100%` |
| `vh/vw` | Dimensiones viewport | `min-height: 100vh` |

---

## Buenas Prácticas

### 1. Especificidad Baja

Mantén la especificidad lo más baja posible:

```css
/* ✅ Correcto - Una clase */
.card { }

/* ⚠️ Aceptable - Dos clases */
.card-header { }

/* ❌ Evitar - Anidación innecesaria */
.card .header .title { }
```

### 2. Evita `!important`

```css
/* ❌ NUNCA */
.display: flex !important;

/* ✅ Mejor solucionar especificidad */
.componente.componente--visible {
  display: flex;
}
```

### 3. Comenta Cuando Sea Necesario

```css
/* Hack para Safari: evitar parpadeo al hacer hover */
.card {
  transform: translateZ(0);
}

/* Los valores de grid se calculan dinámicamente según el viewport */
.kanban-board {
  grid-template-columns: repeat(5, 1fr);
}
```

### 4. Consistencia con Bootstrap

El proyecto usa Bootstrap 5 como base. Evita sobrescribir clases de Bootstrap innecesariamente:

```css
/* ✅ Correcto - Añade tu propia clase */
.btn-custom {
  background: var(--color-primary);
}

/* ❌ Incorrecto - Sobrescribe Bootstrap directamente */
.btn-primary {
  background: var(--color-primary) !important;
}
```

### 5. Agrupa Media Queries

Mantén las media queries juntas al final de cada componente:

```css
.componente { }
.componente-header { }
.componente-body { }

/* Media queries al final */
@media (min-width: 640px) {
  .componente { }
  .componente-header { }
}
```

---

## Antipatrones a Evitar

| ❌ Antipatrón | ✅ Solución |
|---------------|-------------|
| IDs en CSS (`#header`) | Usa clases (`.header`) |
| `!important` | Aumenta especificidad correctamente |
| Estilos inline | Usa clases CSS |
| Magic numbers | Usa variables (`--space-16`) |
| Anidación profunda | Máximo 2-3 niveles |
| Selectores universales (`*`) | Sé específico |

---

## Checklist antes de commitear

- [ ] ¿Usé variables CSS en lugar de valores hardcodeados?
- [ ] ¿Los nombres de clases siguen las convenciones?
- [ ] ¿Están los estilos ordenados según el formato?
- [ ] ¿Las media queries están al final del archivo?
- [ ] ¿Probé en móvil, tablet y desktop?
- [ ] ¿No usé `!important`?
- [ ] ¿La especificidad es la mínima necesaria?
