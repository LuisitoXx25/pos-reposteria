"use client";

import { toggleActivoProducto } from "./actions";

export function ToggleActivoBoton({ id, activo, nombre }: { id: string; activo: boolean; nombre: string }) {
  const accion = activo ? "desactivar" : "activar";

  return (
    <form
      action={toggleActivoProducto}
      onSubmit={(e) => {
        if (!confirm(`¿Estás seguro de ${accion} "${nombre}"?`)) {
          e.preventDefault();
        }
      }}
      className="inline"
    >
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="activo" value={String(activo)} />
      <button
        type="submit"
        style={{
          color: activo ? "var(--dolci-alerta)" : "var(--dolci-exito)",
          fontSize: "0.8125rem",
          fontWeight: 500,
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
      >
        {activo ? "Desactivar" : "Activar"}
      </button>
    </form>
  );
}