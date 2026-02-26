"use client";

import { cambiarEstadoPedido } from "./actions";

// ============================================
// Select para cambiar estado del pedido
// ============================================
// Cada vez que se cambia el select, se envía el form
// automáticamente con el nuevo estado.

export function CambiarEstadoSelect({
  pedidoId,
  estadoActualId,
}: {
  pedidoId: string;
  estadoActualId: number;
}) {
  return (
    <form action={cambiarEstadoPedido} className="inline">
      <input type="hidden" name="pedido_id" value={pedidoId} />
      <select
        name="estado_id"
        defaultValue={estadoActualId}
        onChange={(e) => {
          // Enviar el form automáticamente al cambiar
          e.target.form?.requestSubmit();
        }}
        className="text-xs border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-pink-500"
      >
        <option value={1}>Pendiente</option>
        <option value={2}>Entregado</option>
        <option value={3}>Cancelado</option>
      </select>
    </form>
  );
}