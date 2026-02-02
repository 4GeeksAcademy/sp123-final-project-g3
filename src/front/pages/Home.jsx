import "../index.css";
import React, { useMemo, useState } from "react";
// Estos imports no los estás usando ahora mismo.
// Déjalos solo si realmente los necesitas, si no: bórralos para evitar warnings.
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

const PRIORITY_STYLES = {
  Alta: { badgeClass: "priority-badge priority-high", dotClass: "priority-dot priority-high" },
  Media: { badgeClass: "priority-badge priority-medium", dotClass: "priority-dot priority-medium" },
  Baja: { badgeClass: "priority-badge priority-low", dotClass: "priority-dot priority-low" },
};

const COLUMNS = [
  { key: "por_aplicar", title: "Por Aplicar", headerClass: "col-header col-header-gray" },
  { key: "aplicado", title: "Aplicado", headerClass: "col-header col-header-teal" },
  { key: "entrevista", title: "Entrevista", headerClass: "col-header col-header-orange" },
  { key: "oferta", title: "Oferta", headerClass: "col-header col-header-green" },
  { key: "rechazado", title: "Rechazado", headerClass: "col-header col-header-maroon" },
];

const INITIAL_CARDS = [
  { id: "c1", status: "por_aplicar", role: "React Developer", company: "Digital Agency", priority: "Media", notes: "Preparar CV enfocado a React + Vite." },
  { id: "c2", status: "por_aplicar", role: "DevOps Engineer", company: "DataFlow Inc.", priority: "Alta", notes: "Revisar requisitos: Kubernetes, CI/CD, AWS." },
  { id: "c3", status: "por_aplicar", role: "UX/UI Designer", company: "Creative Studio", priority: "Baja", notes: "Actualizar portfolio con casos de estudio." },
  { id: "c4", status: "por_aplicar", role: "Scrum Master", company: "Agile Team", priority: "Media", notes: "Certificaciones: PSM / CSM." },

  { id: "c5", status: "aplicado", role: "Desarrollador Frontend Senior", company: "TechCorp Solutions", priority: "Alta", notes: "Aplicación enviada el 20/01. Hacer follow-up si no responden." },
  { id: "c6", status: "aplicado", role: "Product Manager", company: "TechCorp Solutions", priority: "Media", notes: "Investigar producto y métricas clave." },
  { id: "c7", status: "aplicado", role: "Data Scientist", company: "AI Solutions", priority: "Alta", notes: "Repasar proyectos de NLP y métricas." },
  { id: "c8", status: "aplicado", role: "Cloud Architect", company: "CloudFirst", priority: "Alta", notes: "Preparar arquitectura de referencia y casos." },

  { id: "c9", status: "entrevista", role: "Full Stack Developer", company: "StartupXYZ", priority: "Alta", notes: "Entrevista técnica: React + Node + DB. Practicar." },
  { id: "c10", status: "entrevista", role: "Mobile Developer", company: "AppWorks", priority: "Media", notes: "Revisar RN/Flutter, patrones y testing." },
  { id: "c11", status: "entrevista", role: "Tech Lead", company: "StartupXYZ", priority: "Alta", notes: "Preparar ejemplos de liderazgo y decisiones técnicas." },

  { id: "c12", status: "oferta", role: "Software Engineer", company: "InnovateTech", priority: "Alta", notes: "Revisar rango salarial y beneficios. Negociación." },
  { id: "c13", status: "oferta", role: "Cybersecurity Analyst", company: "SecureNet", priority: "Alta", notes: "Validar rol, turnos, y certificaciones requeridas." },

  { id: "c14", status: "rechazado", role: "Backend Developer", company: "CloudSystems", priority: "Media", notes: "Pedir feedback si es posible." },
  { id: "c15", status: "rechazado", role: "QA Automation Engineer", company: "TestLab", priority: "Baja", notes: "Revisar qué faltó: Cypress/Playwright, CI." },
];

function Modal({ open, onClose, title, children }) {
  if (!open) return null;

  return (
    <div className="modal-overlay" onMouseDown={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Cerrar">
            ×
          </button>
        </div>

        <div className="modal-body">{children}</div>

        <div className="modal-footer">
          <button className="btn-primary modal-btn" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

function JobCard({ card, onClick }) {
  const styles = PRIORITY_STYLES[card.priority] ?? PRIORITY_STYLES.Media;

  return (
    <button className="job-card" onClick={() => onClick(card)} type="button">
      <div className="job-card-row">
        <h4 className="job-title">{card.role}</h4>
        <span className={styles.badgeClass}>{card.priority}</span>
      </div>

      <div className="job-meta">
        <span className="job-meta-item">
          <span className={styles.dotClass} />
          {card.company}
        </span>
      </div>
    </button>
  );
}

function Column({ title, headerClass, cards, onCardClick }) {
  return (
    <section className="kanban-column">
      <div className={headerClass}>
        <span className="col-title">{title}</span>
        <span className="col-count">{cards.length}</span>
      </div>

      <div className="col-body">
        {cards.map((c) => (
          <JobCard key={c.id} card={c} onClick={onCardClick} />
        ))}
      </div>
    </section>
  );
}

function SidePanel({ offer, onClose }) {
  if (!offer) return null;

  return (
    <aside className="side-panel">
      <div className="side-panel-header">
        <div>
          <span className="priority-tag priority-high">
            Prioridad: {offer.priority}
          </span>
        </div>

        <div className="side-panel-actions">
          <button className="icon-btn">✏️</button>
          <button className="icon-btn close" onClick={onClose}>✕</button>
        </div>
      </div>

      <h2 className="side-panel-title">{offer.role}</h2>
      <p className="side-panel-company">🏢 {offer.company}</p>

      <section className="side-section">
        <h4>📄 Descripción del Puesto</h4>
        <p>Analista de ciberseguridad para protección de infraestructuras.</p>
      </section>

      <section className="side-section">
        <h4>📋 Requisitos</h4>
        <p>Seguridad informática, Pentesting, CISSP, 3+ años</p>
      </section>

      <section className="side-section">
        <h4>📍 Detalles de la Oferta</h4>
        <p><strong>Ubicación:</strong> Bilbao (Remoto)</p>
        <p><strong>Salario:</strong> €40,000 - €50,000</p>
      </section>

      <section className="side-section">
        <h4>🗓️ Fechas importantes</h4>
        <p>Fecha de aplicación: 6 de enero de 2026</p>
      </section>

      <section className="side-section">
        <h4>📝 Notas personales</h4>
        <textarea defaultValue={offer.notes} />
      </section>
    </aside>
  );
}


export default function Home() {
  const [cards] = useState(INITIAL_CARDS);
  const [selected, setSelected] = useState(null);

  const grouped = useMemo(() => {
    const map = Object.fromEntries(COLUMNS.map((c) => [c.key, []]));
    for (const c of cards) map[c.status]?.push(c);
    return map;
  }, [cards]);

  return (
    <div className="board-page">
      <div className="kanban-board">
        {COLUMNS.map((col) => (
          <Column
            key={col.key}
            title={col.title}
            headerClass={col.headerClass}
            cards={grouped[col.key] ?? []}
            onCardClick={setSelected}
          />
        ))}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected ? selected.role : ""}>
        {selected && (
          <div className="modal-grid">
            <div className="modal-field">
              <div className="modal-label">Empresa</div>
              <div className="modal-value">{selected.company}</div>
            </div>

            <div className="modal-field">
              <div className="modal-label">Estado</div>
              <div className="modal-value">{COLUMNS.find((c) => c.key === selected.status)?.title}</div>
            </div>

            <div className="modal-field">
              <div className="modal-label">Prioridad</div>
              <div className="modal-value">{selected.priority}</div>
            </div>

            <div className="modal-field modal-field-full">
              <div className="modal-label">Notas</div>
              <div className="modal-value">{selected.notes || "—"}</div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
