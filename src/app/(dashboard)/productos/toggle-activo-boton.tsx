"use client";

import { toggleActivoProducto } from "./actions";

// ============================================
// Botón para activar/desactivar producto
// ============================================
// En lugar de eliminar, hacemos baja lógica.
// Un producto inactivo no aparece al crear pedidos
// pero sigue visible en el historial de pedidos anteriores.

export function ToggleActivoBoton({
  id,
  activo,
  nombre,
}: {
  id: string;
  activo: boolean;
  nombre: string;
}) {
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
        className={`text-sm font-medium ${
          activo
            ? "text-yellow-600 hover:text-yellow-700"
            : "text-green-600 hover:text-green-700"
        }`}
      >
        {activo ? "Desactivar" : "Activar"}
      </button>
    </form>
  );
}