# Variables CSS Globales

**Archivo fuente:** [`src/front/styles/base/variables.css`](../../src/front/styles/base/variables.css)

---

## Índice de Categorías

- [Colores](#colores)
- [Fondos](#fondos)
- [Overlays](#overlays)
- [Texto](#texto)
- [Bordes](#bordes)
- [Espaciado](#espaciado)
- [Bordes Redondeados](#bordes-redondeados)
- [Sombras](#sombras)
- [Transiciones](#transiciones)
- [Tipografía](#tipografía)
- [Z-Index](#z-index)
- [Máximos de Ancho](#máximos-de-ancho)

---

## Colores

### Colores Principales

| Variable | Valor | Uso |
|----------|-------|-----|
| `--color-primary` | `#0f2c33` | Color principal oscuro |
| `--color-primary-dark` | `#12343b` | Variante más oscura |
| `--color-secondary` | `#533946` | Color secundario (marrón) |
| `--color-accent` | `#2e9ca0` | Acento teal |
| `--color-accent-dark` | `#21616a` | Acento teal oscuro |
| `--color-success` | `#1f5f66` | Verde éxito |
| `--color-success-light` | `#2f8f62` | Verde claro |
| `--color-warning` | `#f39b1e` | Naranja advertencia |
| `--color-warning-light` | `#d48a2a` | Naranja claro |
| `--color-warning-bright` | `#e1c719` | Amarillo brillante |
| `--color-error` | `#ef4444` | Rojo error |

### Escala de Grises

| Variable | Valor |
|----------|-------|
| `--color-white` | `#ffffff` |
| `--color-gray-50` | `#f5f7f8` |
| `--color-gray-100` | `#f7f9fa` |
| `--color-gray-200` | `#eef3f5` |
| `--color-gray-400` | `#7c8793` |
| `--color-gray-500` | `#6b6b6b` |
| `--color-gray-600` | `#6b7280` |

### Colores de Prioridad (Kanban)

| Variable | Valor | Uso |
|----------|-------|-----|
| `--color-priority-high-bg` | `#ffe3e3` | Fondo prioridad alta |
| `--color-priority-high-text` | `#8a1f1f` | Texto prioridad alta |
| `--color-priority-high-dot` | `#ff6b6b` | Indicador prioridad alta |
| `--color-priority-medium-bg` | `#fff0cc` | Fondo prioridad media |
| `--color-priority-medium-text` | `#7a4f00` | Texto prioridad media |
| `--color-priority-medium-dot` | `#f39b1e` | Indicador prioridad media |
| `--color-priority-low-bg` | `#dfefff` | Fondo prioridad baja |
| `--color-priority-low-text` | `#1d4e89` | Texto prioridad baja |
| `--color-priority-low-dot` | `#4d8dff` | Indicador prioridad baja |

### Colores de Columnas

| Variable | Valor |
|----------|-------|
| `--color-col-gray` | `#7c8793` |
| `--color-col-maroon` | `#6d3c4f` |

---

## Fondos

| Variable | Valor | Uso |
|----------|-------|-----|
| `--bg-primary` | `#e6d1b4` | Fondo principal (crema) |
| `--bg-secondary` | `#ead6b8` | Fondo secundario |
| `--bg-tertiary` | `#f3eadb` | Fondo terciario |
| `--bg-white` | `#ffffff` | Blanco puro |
| `--bg-transparent` | `rgba(255,255,255,0.35)` | Transparente |
| `--bg-card` | `#f3eadb` | Fondo de tarjetas |

---

## Overlays

| Variable | Valor | Uso |
|----------|-------|-----|
| `--overlay-dark` | `rgba(0,0,0,0.35)` | Overlay oscuro (modales) |
| `--overlay-light` | `rgba(255,255,255,0.25)` | Overlay claro |
| `--overlay-white-55` | `rgba(255,255,255,0.55)` | Blanco 55% |
| `--overlay-white-70` | `rgba(255,255,255,0.7)` | Blanco 70% |
| `--overlay-white-78` | `rgba(255,255,255,0.78)` | Blanco 78% |
| `--overlay-white-80` | `rgba(255,255,255,0.8)` | Blanco 80% |
| `--overlay-primary-8` | `rgba(83,57,70,0.08)` | Primario 8% |
| `--overlay-primary-15` | `rgba(15,44,51,0.15)` | Primario 15% |
| `--overlay-primary-18` | `rgba(15,44,51,0.18)` | Primario 18% |
| `--overlay-primary-25` | `rgba(255,255,255,0.25)` | Primario 25% |
| `--overlay-tertiary-35` | `rgba(243,234,219,0.35)` | Terciario 35% |
| `--overlay-accent-12` | `rgba(33,97,106,0.12)` | Acento 12% |
| `--overlay-accent-25` | `rgba(46,156,160,0.25)` | Acento 25% |
| `--overlay-accent-80` | `rgba(46,156,160,0.8)` | Acento 80% |
| `--overlay-cream-20` | `rgba(230,209,180,0.2)` | Crema 20% |

---

## Texto

| Variable | Valor | Uso |
|----------|-------|-----|
| `--text-primary` | `#0f2c33` | Texto principal (oscuro) |
| `--text-secondary` | `#533946` | Texto secundario (marrón) |
| `--text-light` | `#6b7280` | Texto claro |
| `--text-white` | `#ffffff` | Texto blanco |
| `--text-muted` | `rgba(83,57,70,0.85)` | Texto atenuado |

---

## Bordes

| Variable | Valor | Uso |
|----------|-------|-----|
| `--border-light` | `rgba(15,44,51,0.1)` | Borde sutil |
| `--border-medium` | `rgba(15,44,51,0.12)` | Borde medio |
| `--border-dark` | `rgba(15,44,51,0.15)` | Borde oscuro |
| `--border-darker` | `rgba(15,44,51,0.18)` | Borde más oscuro |
| `--border-darkest` | `rgba(15,44,51,0.25)` | Borde muy oscuro |
| `--border-accent` | `rgba(33,97,106,0.35)` | Borde de acento |
| `--border-dashed` | `rgba(15,44,51,0.45)` | Borde dashed |

---

## Espaciado

### Unidades Rem

| Variable | Valor |
|----------|-------|
| `--space-xs` | `0.25rem` |
| `--space-sm` | `0.5rem` |
| `--space-md` | `0.75rem` |
| `--space-lg` | `1rem` |
| `--space-xl` | `1.5rem` |
| `--space-2xl` | `2rem` |
| `--space-3xl` | `2.5rem` |

### Unidades Pixeles

| Variable | Valor |
|----------|-------|
| `--space-6` | `6px` |
| `--space-8` | `8px` |
| `--space-10` | `10px` |
| `--space-12` | `12px` |
| `--space-14` | `14px` |
| `--space-16` | `16px` |
| `--space-18` | `18px` |
| `--space-20` | `20px` |
| `--space-22` | `22px` |
| `--space-24` | `24px` |
| `--space-28` | `28px` |
| `--space-32` | `32px` |
| `--space-36` | `36px` |
| `--space-38` | `38px` |
| `--space-40` | `40px` |
| `--space-44` | `44px` |
| `--space-90` | `90px` |
| `--space-120` | `120px` |
| `--space-150` | `150px` |
| `--space-220` | `220px` |
| `--space-260` | `260px` |
| `--space-300` | `300px` |
| `--space-512` | `512px` |
| `--space-616` | `616px` |
| `--space-816` | `816px` |

---

## Bordes Redondeados

| Variable | Valor |
|----------|-------|
| `--radius-sm` | `0.5rem` |
| `--radius-md` | `0.6rem` |
| `--radius-lg` | `0.7rem` |
| `--radius-xl` | `0.75rem` |
| `--radius-2xl` | `10px` |
| `--radius-3xl` | `12px` |
| `--radius-4xl` | `14px` |
| `--radius-5xl` | `16px` |
| `--radius-full` | `999px` |

---

## Sombras

| Variable | Valor | Uso |
|----------|-------|-----|
| `--shadow-sm` | `0 2px 8px rgba(0,0,0,0.12)` | Sombra pequeña |
| `--shadow-md` | `0 6px 18px rgba(15,44,51,0.12)` | Sombra media |
| `--shadow-lg` | `0 8px 24px rgba(0,0,0,0.12)` | Sombra grande |
| `--shadow-xl` | `0 10px 24px rgba(0,0,0,0.12)` | Sombra extra grande |
| `--shadow-buscar` | `0 10px 22px rgba(0,0,0,0.06)` | Sombra búsqueda |

---

## Transiciones

| Variable | Valor |
|----------|-------|
| `--transition-fast` | `150ms ease` |
| `--transition-normal` | `200ms ease` |
| `--transition-slow` | `300ms ease` |

---

## Tipografía

### Familia

| Variable | Valor |
|----------|-------|
| `--font-family-base` | `"Poppins", sans-serif` |

### Tamaños

| Variable | Valor |
|----------|-------|
| `--font-size-xs` | `0.7rem` |
| `--font-size-sm` | `0.75rem` |
| `--font-size-base` | `0.85rem` |
| `--font-size-md` | `0.9rem` |
| `--font-size-lg` | `0.95rem` |
| `--font-size-xl` | `1.1rem` |
| `--font-size-2xl` | `1.25rem` |
| `--font-size-3xl` | `1.4rem` |
| `--font-size-4xl` | `1.6rem` |
| `--font-size-78` | `0.78rem` |
| `--font-size-82` | `0.82rem` |
| `--font-size-92` | `0.92rem` |
| `--font-size-105` | `1.05rem` |
| `--font-size-12` | `1.2rem` |
| `--font-size-15` | `1.5rem` |

---

## Z-Index

| Variable | Valor | Uso |
|----------|-------|-----|
| `--z-modal` | `1000` | Modales |
| `--z-modal-high` | `1200` | Modales superpuestos |
| `--z-dropdown` | `1000` | Dropdowns |

---

## Máximos de Ancho

| Variable | Valor |
|----------|-------|
| `--max-width-container` | `1400px` |
| `--max-width-content` | `1200px` |

---

## 💡 Consejo

Si necesitas cambiar un valor que se repite en múltiples componentes, modifica la variable aquí en lugar de editar cada archivo individual. Todas las variables están disponibles globalmente a través del selector `:root`.
