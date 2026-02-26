"use client";

import { actualizarProducto } from "../../../productos/actions";
import { Producto } from "@/types";

export function EditarProductoForm({ producto }: { producto: Producto }) {
  const actualizarConId = actualizarProducto.bind(null, producto.id);

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
              defaultValue={producto.nombre}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="precio" className="block text-sm font-medium text-gray-700 mb-1">
              Precio (MXN) *
            </label>
            <input
              id="precio"
              name="precio"
              type="number"
              required
              min="0.01"
              step="0.01"
              defaultValue={producto.precio}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 transition-colors text-sm font-medium"
          >
            Guardar Cambios
          </button>
          <a
            href="/productos"
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors text-sm inline-block"
          >
            Cancelar
          </a>
        </div>
      </form>
    </div>
  );
}