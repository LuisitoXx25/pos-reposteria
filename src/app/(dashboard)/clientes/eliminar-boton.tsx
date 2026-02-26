"use client";

import { eliminarCliente } from "./actions";

// ============================================
// Botón de eliminar con confirmación
// ============================================
// Es un componente separado porque necesita "use client"
// para el confirm() del browser, pero la página padre
// es Server Component. Así mantenemos la separación limpia.

export function EliminarClienteBoton({
  id,
  nombre,
}: {
  id: string;
  nombre: string;
}) {
  return (
    <form
      action={eliminarCliente}
      onSubmit={(e) => {
        if (!confirm(`¿Estás seguro de eliminar a "${nombre}"?`)) {
          e.preventDefault();
        }
      }}
      className="inline"
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="text-sm text-red-500 hover:text-red-700 font-medium"
      >
        Eliminar
      </button>
    </form>
  );
}