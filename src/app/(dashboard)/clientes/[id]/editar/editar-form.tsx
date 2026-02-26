"use client";

import { actualizarCliente } from "../../../clientes/actions";
import { Cliente } from "@/types";

// ============================================
// Formulario de edición de cliente
// ============================================
// Recibe el cliente actual como prop para precargar los campos.
// El action usa .bind(null, cliente.id) para "inyectar" el id
// como primer argumento del Server Action. Así el form solo
// manda los datos del formulario y el id ya va incluido.

export function EditarClienteForm({ cliente }: { cliente: Cliente }) {
  // bind inyecta el id como primer parámetro del Server Action
  const actualizarConId = actualizarCliente.bind(null, cliente.id);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-2xl">
      <form action={actualizarConId} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre *
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              required
              defaultValue={cliente.nombre}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <input
              id="telefono"
              name="telefono"
              type="tel"
              defaultValue={cliente.telefono || ""}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label htmlFor="notas" className="block text-sm font-medium text-gray-700 mb-1">
            Notas
          </label>
          <textarea
            id="notas"
            name="notas"
            rows={3}
            defaultValue={cliente.notas || ""}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 transition-colors text-sm font-medium"
          >
            Guardar Cambios
          </button>
          <a
            href="/clientes"
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors text-sm inline-block"
          >
            Cancelar
          </a>
        </div>
      </form>
    </div>
  );
}