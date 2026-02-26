"use client";

import { crearCliente } from "./actions";
import { useState } from "react";

// ============================================
// Formulario para crear un cliente nuevo
// ============================================
// Es "use client" porque necesita estado local (mostrar/ocultar).
// El form action apunta directamente al Server Action crearCliente.
// Cuando se envía el formulario, Next.js ejecuta la función en el
// servidor, inserta en la BD y redirige de vuelta a /clientes.

export function CrearClienteForm() {
  const [abierto, setAbierto] = useState(false);

  return (
    <div className="mb-6">
      {!abierto ? (
        <button
          onClick={() => setAbierto(true)}
          className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 transition-colors text-sm font-medium"
        >
          + Nuevo Cliente
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Nuevo Cliente</h2>

          <form action={crearCliente} className="space-y-4">
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
                  placeholder="Nombre del cliente"
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
                  placeholder="(opcional)"
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
                rows={2}
                placeholder="Alergias, preferencias, dirección... (opcional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 transition-colors text-sm font-medium"
              >
                Guardar Cliente
              </button>
              <button
                type="button"
                onClick={() => setAbierto(false)}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors text-sm"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}