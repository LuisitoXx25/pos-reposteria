"use client";

import { useEffect } from "react";

// ============================================
// Modal reutilizable
// ============================================
// Se cierra con Escape, click en overlay, o botón X.
// Usa las clases de globals.css para animaciones.

interface ModalProps {
  abierto: boolean;
  onCerrar: () => void;
  titulo: string;
  children: React.ReactNode;
  grande?: boolean;
}

export function Modal({ abierto, onCerrar, titulo, children, grande }: ModalProps) {
  // Cerrar con Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onCerrar();
    }

    if (abierto) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [abierto, onCerrar]);

  if (!abierto) return null;

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div
        className={`modal-content ${grande ? "modal-content-lg" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 style={{ fontSize: "1.25rem", fontWeight: 600 }}>{titulo}</h2>
          <button
            onClick={onCerrar}
            style={{
              color: "var(--dolci-texto-muted)",
              fontSize: "1.25rem",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0.25rem",
              borderRadius: "0.25rem",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--dolci-texto)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--dolci-texto-muted)")}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        {children}
      </div>
    </div>
  );
}