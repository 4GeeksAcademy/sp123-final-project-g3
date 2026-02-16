import "../index.css";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

const PRIORITY_STYLES = {
  High: { badgeClass: "priority-badge priority-badge--high", dotClass: "priority-dot priority-dot--high" },
  Medium: { badgeClass: "priority-badge priority-badge--medium", dotClass: "priority-dot priority-dot--medium" },
  Low: { badgeClass: "priority-badge priority-badge--low", dotClass: "priority-dot priority-dot--low" },
};

const COLUMNS = [
  { key: "to_apply", title: "To Apply", headerClass: "col-header col-header--gray" },
  { key: "applied", title: "Applied", headerClass: "col-header col-header--teal" },
  { key: "interview", title: "Interview", headerClass: "col-header col-header--orange" },
  { key: "offer", title: "Offer", headerClass: "col-header col-header--green" },
  { key: "rejected", title: "Rejected", headerClass: "col-header col-header--maroon" },
];

const INITIAL_CARDS = [
  { id: "c1", status: "to_apply", role: "React Developer", company: "Digital Agency", priority: "Medium", notes: "Prepare CV focused on React + Vite." },
  { id: "c2", status: "to_apply", role: "DevOps Engineer", company: "DataFlow Inc.", priority: "High", notes: "Review requirements: Kubernetes, CI/CD, AWS." },
  { id: "c3", status: "to_apply", role: "UX/UI Designer", company: "Creative Studio", priority: "Low", notes: "Update portfolio with case studies." },
  { id: "c4", status: "to_apply", role: "Scrum Master", company: "Agile Team", priority: "Medium", notes: "Certifications: PSM / CSM." },

  { id: "c5", status: "applied", role: "Senior Frontend Developer", company: "TechCorp Solutions", priority: "High", notes: "Application sent on 01/20. Follow up if no response." },
  { id: "c6", status: "applied", role: "Product Manager", company: "TechCorp Solutions", priority: "Medium", notes: "Research product and key metrics." },
  { id: "c7", status: "applied", role: "Data Scientist", company: "AI Solutions", priority: "High", notes: "Review NLP projects and metrics." },
  { id: "c8", status: "applied", role: "Cloud Architect", company: "CloudFirst", priority: "High", notes: "Prepare reference architecture and cases." },

  { id: "c9", status: "interview", role: "Full Stack Developer", company: "StartupXYZ", priority: "High", notes: "Technical interview: React + Node + DB. Practice." },
  { id: "c10", status: "interview", role: "Mobile Developer", company: "AppWorks", priority: "Medium", notes: "Review RN/Flutter, patterns and testing." },
  { id: "c11", status: "interview", role: "Tech Lead", company: "StartupXYZ", priority: "High", notes: "Prepare leadership examples and technical decisions." },

  { id: "c12", status: "offer", role: "Software Engineer", company: "InnovateTech", priority: "High", notes: "Review salary range and benefits. Negotiation." },
  { id: "c13", status: "offer", role: "Cybersecurity Analyst", company: "SecureNet", priority: "High", notes: "Validate role, shifts, and required certifications." },

  { id: "c14", status: "rejected", role: "Backend Developer", company: "CloudSystems", priority: "Medium", notes: "Ask for feedback if possible." },
  { id: "c15", status: "rejected", role: "QA Automation Engineer", company: "TestLab", priority: "Low", notes: "Review what was missing: Cypress/Playwright, CI." },
];

function Modal({ open, onClose, title, children }) {
  if (!open) return null;

  return (
    <div className="modal-overlay" onMouseDown={onClose} role="dialog" aria-modal="true">
      <div className="modal-card modal-card--small" onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="modal-body">{children}</div>

        <div className="modal-footer">
          <button className="modal-btn modal-btn--primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function JobCard({ card, onClick }) {
  const styles = PRIORITY_STYLES[card.priority] ?? PRIORITY_STYLES.Medium;
  const reference = useRef(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const element = reference.current;
    if (!element) return;

    return draggable({
      element: element,
      getInitialData: () => ({ cardId: card.id }),
      onDragStart: () => setDragging(true),
      onDrop: () => setDragging(false),
    });
  }, [card.id]);

  return (
    <button
      ref={reference}
      className={`job-card ${dragging ? "is-dragging" : ""}`}
      onClick={() => onClick(card)}
      type="button"
    >
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

function Column({ columnKey, title, headerClass, cards, onCardClick }) {
  const reference = useRef(null);
  const [over, setOver] = useState(false);

  useEffect(() => {
    const element = reference.current;
    if (!element) return;

    return dropTargetForElements({
      element: element,
      getData: () => ({ columnKey }),
      onDragEnter: () => setOver(true),
      onDragLeave: () => setOver(false),
      onDrop: () => setOver(false),
    });
  }, [columnKey]);

  return (
    <section ref={reference} className={`kanban-column ${over ? "is-over" : ""}`}>
      <div className={headerClass}>
        <span className="col-title">{title}</span>
        <span className="col-count">{cards.length}</span>
      </div>

      <div className="col-body">
        {cards.map((card) => (
          <JobCard key={card.id} card={card} onClick={onCardClick} />
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const [cards, setCards] = useState(INITIAL_CARDS);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    return monitorForElements({
      onDrop({ source, location }) {
        const destination = location.current.dropTargets[0];
        if (!destination) return;

        const { cardId } = source.data || {};
        const { columnKey } = destination.data || {};

        if (!cardId || !columnKey) return;

        setCards((previous) =>
          previous.map((card) => (card.id === cardId ? { ...card, status: columnKey } : card))
        );
      },
    });
  }, []);

  const grouped = useMemo(() => {
    const map = Object.fromEntries(COLUMNS.map((column) => [column.key, []]));
    for (const card of cards) map[card.status]?.push(card);
    return map;
  }, [cards]);

  return (
    <div className="board-page">
      <div className="kanban-board">
        {COLUMNS.map((column) => (
          <Column
            key={column.key}
            columnKey={column.key}
            title={column.title}
            headerClass={column.headerClass}
            cards={grouped[column.key] ?? []}
            onCardClick={setSelected}
          />
        ))}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected ? selected.role : ""}>
        {selected && (
          <div className="modal-grid">
            <div className="modal-field">
              <div className="modal-label">Company</div>
              <div className="modal-value">{selected.company}</div>
            </div>

            <div className="modal-field">
              <div className="modal-label">Status</div>
              <div className="modal-value">{COLUMNS.find((column) => column.key === selected.status)?.title}</div>
            </div>

            <div className="modal-field">
              <div className="modal-label">Priority</div>
              <div className="modal-value">{selected.priority}</div>
            </div>

            <div className="modal-field modal-field-full">
              <div className="modal-label">Notes</div>
              <div className="modal-value">{selected.notes || "—"}</div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
