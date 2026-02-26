import Link from "next/link";
import { obtenerPedidos } from "./actions";
import { formatearMoneda, formatearFecha } from "@/lib/utils";
import { CambiarEstadoSelect } from "./cambiar-estado-select";

// ============================================
// Página principal de Pedidos
// ============================================

// Colores por estado para los badges
const colorEstado: Record<string, string> = {
  Pendiente: "bg-yellow-100 text-yellow-700",
  Entregado: "bg-green-100 text-green-700",
  Cancelado: "bg-red-100 text-red-500",
};

export default async function PedidosPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const pedidos = await obtenerPedidos();

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
          <p className="text-gray-500 mt-1">
            {pedidos.length} {pedidos.length === 1 ? "pedido" : "pedidos"} registrados
          </p>
        </div>
        <Link
          href="/pedidos/nuevo"
          className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 transition-colors text-sm font-medium"
        >
          + Nuevo Pedido
        </Link>
      </div>

      {/* Error */}
      {params.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6 text-sm">
          {params.error}
        </div>
      )}

      {/* Tabla */}
      {pedidos.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No hay pedidos registrados todavía.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Entrega
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pedidos.map((pedido) => (
                <tr key={pedido.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">
                      {pedido.cliente?.nombre}
                    </p>
                    <p className="text-xs text-gray-500">
                      {pedido.cliente?.telefono || "Sin teléfono"}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {formatearFecha(pedido.fecha_entrega)}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {formatearMoneda(pedido.total)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                        colorEstado[pedido.estado?.nombre] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {pedido.estado?.nombre}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <Link
                      href={`/pedidos/${pedido.id}`}
                      className="text-sm text-pink-600 hover:text-pink-700 font-medium"
                    >
                      Ver detalle
                    </Link>
                    <CambiarEstadoSelect
                      pedidoId={pedido.id}
                      estadoActualId={pedido.estado_id}
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