import Link from "next/link";
import { obtenerClientes } from "./actions";
import { formatearFecha } from "@/lib/utils";
import { EliminarClienteBoton } from "./eliminar-boton";
import { CrearClienteForm } from "./crear-form";

// ============================================
// Página principal de Clientes
// ============================================
// Esta es una Server Component (no tiene "use client").
// Eso significa que el fetch de datos sucede en el servidor
// y el HTML llega ya renderizado al browser. Más rápido y más SEO.

export default async function ClientesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const clientes = await obtenerClientes();

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-500 mt-1">
            {clientes.length} {clientes.length === 1 ? "cliente" : "clientes"} registrados
          </p>
        </div>
      </div>

      {/* Error message */}
      {params.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6 text-sm">
          {params.error}
        </div>
      )}

      {/* Formulario para crear cliente */}
      <CrearClienteForm />

      {/* Tabla de clientes */}
      {clientes.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No hay clientes registrados todavía.</p>
          <p className="text-gray-400 text-sm mt-1">Usa el formulario de arriba para agregar tu primer cliente.</p>
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
                  Teléfono
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notas
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
              {clientes.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {cliente.nombre}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {cliente.telefono || "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {cliente.notas || "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatearFecha(cliente.created_at)}
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <Link
                      href={`/clientes/${cliente.id}/editar`}
                      className="text-sm text-pink-600 hover:text-pink-700 font-medium"
                    >
                      Editar
                    </Link>
                    <EliminarClienteBoton id={cliente.id} nombre={cliente.nombre} />
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