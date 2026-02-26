import Link from "next/link";
import { obtenerProductos } from "./actions";
import { formatearMoneda, formatearFecha } from "@/lib/utils";
import { CrearProductoForm } from "./crear-form";
import { ToggleActivoBoton } from "./toggle-activo-boton";

// ============================================
// Página principal de Productos
// ============================================

export default async function ProductosPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const productos = await obtenerProductos();

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
          <p className="text-gray-500 mt-1">
            {productos.length} {productos.length === 1 ? "producto" : "productos"} registrados
          </p>
        </div>
      </div>

      {/* Error */}
      {params.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6 text-sm">
          {params.error}
        </div>
      )}

      {/* Formulario crear */}
      <CrearProductoForm />

      {/* Tabla */}
      {productos.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No hay productos registrados todavía.</p>
          <p className="text-gray-400 text-sm mt-1">Usa el formulario de arriba para agregar tu primer producto.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registrado
                </th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {productos.map((producto) => (
                <tr
                  key={producto.id}
                  className={`hover:bg-gray-50 ${!producto.activo ? "opacity-50" : ""}`}
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {producto.nombre}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {formatearMoneda(producto.precio)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                        producto.activo
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {producto.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatearFecha(producto.created_at)}
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <Link
                      href={`/productos/${producto.id}/editar`}
                      className="text-sm text-pink-600 hover:text-pink-700 font-medium"
                    >
                      Editar
                    </Link>
                    <ToggleActivoBoton
                      id={producto.id}
                      activo={producto.activo}
                      nombre={producto.nombre}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}