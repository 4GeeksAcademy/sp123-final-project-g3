# Perfil de Usuario

**Archivo CSS:** [`src/front/styles/components/profile.css`](../../../src/front/styles/components/profile.css)

**Página React:** [`src/front/pages/Perfil.jsx`](../../../src/front/pages/Perfil.jsx)

---

## Clases Principales

### Página

| Clase | Descripción |
|-------|-------------|
| `.profile-page` | Contenedor principal con fondo secundario y padding |

### Tarjetas

| Clase | Descripción |
|-------|-------------|
| `.profile-card` | Tarjeta con fondo, borde y esquinas redondeadas |

### CV

| Clase | Descripción |
|-------|-------------|
| `.cv-box` | Caja de carga de CV con borde dashed y fondo terciario |

### Alertas

| Clase | Descripción |
|-------|-------------|
| `.alerta-item` | Item de alerta con fondo terciario y bordes redondeados |

---

## Modifica aquí cuando...

- Necesites cambiar el fondo de la página de perfil
- Quieras modificar la apariencia de las tarjetas de información
- Debas ajustar el estilo del área de carga de CV
- Quieras cambiar el diseño de las alertas de empleo
- Necesites ajustar el espaciado o padding en diferentes breakpoints

---

## Breakpoints

| Breakpoint | Cambios |
|------------|---------|
| Móvil (<768px) | Padding pequeño en página y tarjetas |
| Tablet (768px+) | Padding aumentado en página (`--space-3xl`), tarjetas (`--space-2xl`), y CV (`--space-3xl`) |

---

## Variables Utilizadas

| Variable | Uso |
|----------|-----|
| `--bg-secondary` | Fondo de la página y tarjetas |
| `--bg-tertiary` | Fondo de CV-box y alertas |
| `--overlay-primary-15` | Borde de tarjetas |
| `--overlay-primary-25` | Borde dashed del CV |
| `--space-lg`, `--space-xl`, `--space-2xl`, `--space-3xl` | Espaciado responsivo |
| `--radius-2xl`, `--radius-3xl` | Bordes redondeados |

---

## Estructura HTML Esperada

```jsx
<div className="profile-page">
  <div className="container">
    
    {/* Tarjeta de información */}
    <div className="profile-card">
      <h2>Información Personal</h2>
      {/* Contenido */}
    </div>
    
    {/* Área de CV */}
    <div className="cv-box">
      <p>Arrastra tu CV aquí o haz clic para subir</p>
    </div>
    
    {/* Alertas */}
    <div className="alerta-item">
      <p>Alerta de empleo nueva</p>
    </div>
    
  </div>
</div>
```
