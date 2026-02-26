"use client";

import { cambiarEstadoPedido } from "./actions";

export function CambiarEstadoSelect({ pedidoId, estadoActualId }: { pedidoId: string; estadoActualId: number }) {
  return (
    <form action={cambiarEstadoPedido} className="inline">
      <input type="hidden" name="pedido_id" value={pedidoId} />
      <select
        name="estado_id"
        defaultValue={estadoActualId}
        onChange={(e) => e.target.form?.requestSubmit()}
        style={{
          fontSize: "0.75rem",
          padding: "0.25rem 0.5rem",
          borderRadius: "0.375rem",
          border: "1px solid var(--dolci-borde)",
          backgroundColor: "var(--dolci-blanco)",
          color: "var(--dolci-texto-light)",
          cursor: "pointer",
        }}
      >
        <option value={1}>Pendiente</option>
        <option value={2}>Entregado</option>
        <option value={3}>Cancelado</option>
      </select>
    </form>
  );
}