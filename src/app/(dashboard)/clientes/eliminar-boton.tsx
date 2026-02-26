"use client";

import { eliminarCliente } from "./actions";

export function EliminarClienteBoton({ id, nombre }: { id: string; nombre: string }) {
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
      <button type="submit" className="btn-danger">Eliminar</button>
    </form>
  );
}