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



// ✅ Drawer lateral
function SidePanel({ open, onClose, data, statusLabel, statusKey }) {

  if (!open) return null;

  const title = data?.title ?? data?.role ?? "—";

  const formatDate = (value) => {
    if (!value) return "—";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleDateString();
  };

  const link = data?.link;

  return (
    <div
      className="sp-overlay"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <aside
        className={`sp-panel sp-panel--${statusKey || "to_apply"}`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="sp-header">
          <div className="sp-header-left">
            <div className="sp-kicker">
              <span className="sp-kicker-label">Priority:</span>{" "}
              <span className="sp-kicker-value">{data?.priority ?? "—"}</span>
            </div>

            <h3 className="sp-title">{title}</h3>

            <div className="sp-company">
              <i className="bi bi-building me-2" />
              {data?.company ?? "—"}
            </div>
          </div>

          <div className="sp-header-actions">
            <button className="sp-icon-btn" type="button" onClick={onClose} aria-label="Close">
              <i className="bi bi-x-lg" />
            </button>
          </div>
        </div>

        <div className="sp-body">
          <div className="sp-section">
            <div className="sp-section-title">
              <i className="bi bi-card-text me-2" />
              Descripción del Puesto
            </div>
            <div className="sp-box">
              {data?.description ?? "—"}
            </div>
          </div>

          <div className="sp-section">
            <div className="sp-section-title">
              <i className="bi bi-info-circle me-2" />
              Detalles de la Oferta
            </div>

            <div className="sp-details">
              <div className="sp-detail">
                <div className="sp-detail-label">
                  <i className="bi bi-geo-alt me-2" />
                  Ubicación
                </div>
                <div className="sp-detail-value">{data?.location ?? "—"}</div>
              </div>

              <div className="sp-detail">
                <div className="sp-detail-label">
                  <i className="bi bi-cash-coin me-2" />
                  Salario
                </div>
                <div className="sp-detail-value">{data?.salary ?? "—"}</div>
              </div>

              <div className="sp-detail">
                <div className="sp-detail-label">
                  <i className="bi bi-flag me-2" />
                  Status
                </div>
                <div className="sp-detail-value">{statusLabel}</div>
              </div>

              <div className="sp-detail">
                <div className="sp-detail-label">
                  <i className="bi bi-calendar-event me-2" />
                  Created
                </div>
                <div className="sp-detail-value">{formatDate(data?.created_at)}</div>
              </div>
            </div>
          </div>

          <div className="sp-section">
            <div className="sp-section-title">
              <i className="bi bi-link-45deg me-2" />
              Link
            </div>

            <div className="sp-box sp-box--link">
              {link ? (
                <a href={link} target="_blank" rel="noreferrer" className="sp-link">
                  {link}
                </a>
              ) : (
                "—"
              )}
            </div>
          </div>

          <div className="sp-section">
            <div className="sp-section-title">
              <i className="bi bi-journal-text me-2" />
              Notes
            </div>
            <div className="sp-box sp-box--notes">
              {data?.notes ?? "—"}
            </div>
          </div>
        </div>
      </aside>
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
      element,
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
      element,
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

import useGlobalReducer from "../hooks/useGlobalReducer";
export default function Home() {
  const { store, actions } = useGlobalReducer();
  // Usamos el estado local para el Drag & Drop visual inmediato, 
  // pero lo iniciamos/sincronizamos con store.myKanban
  const [cards, setCards] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    // Cargar datos al montar
    actions.getMyPostulations();
  }, []);

  useEffect(() => {
    // Sincronizar cuando el store cambia
    setCards(store.myKanban || []);
  }, [store.myKanban]);

  useEffect(() => {
    return monitorForElements({
      onDrop({ source, location }) {
        const destination = location.current.dropTargets[0];
        if (!destination) return;

        const { cardId } = source.data || {};
        const { columnKey } = destination.data || {};
        if (!cardId || !columnKey) return;

        // Actualización Optimista Local
        setCards((previous) =>
          previous.map((card) => (card.id === cardId ? { ...card, status: columnKey } : card))
        );

        // Call API to persist change
        actions.updatePostulation(cardId, columnKey);
      },
    });
  }, []);

  const grouped = useMemo(() => {
    const map = Object.fromEntries(COLUMNS.map((column) => [column.key, []]));
    for (const card of cards) map[card.status]?.push(card);
    return map;
  }, [cards]);

  const selectedStatusLabel = useMemo(() => {
    if (!selected) return "—";
    return COLUMNS.find((c) => c.key === selected.status)?.title ?? "—";
  }, [selected]);

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

      <SidePanel
        open={!!selected}
        onClose={() => setSelected(null)}
        data={selected}
        statusLabel={selectedStatusLabel}
        statusKey={selected?.status}
      />

            <div className="modal-field">
              <div className="modal-label">Priority</div>
              <div className="modal-value">{selected.priority}</div>
            </div>

            <div className="modal-field modal-field-full">
              <div className="modal-label">Notes</div>
              <div className="modal-value">{selected.notes || "—"}</div>
            </div>

            {selected.link && (
              <div className="modal-field modal-field-full mt-3">
                <a href={selected.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary d-block text-center">
                  Go to Apply
                </a>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
