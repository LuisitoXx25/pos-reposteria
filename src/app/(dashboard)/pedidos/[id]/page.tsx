import { obtenerPedido } from "../actions";
import { formatearMoneda, formatearFecha } from "@/lib/utils";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CambiarEstadoSelect } from "../cambiar-estado-select";

// ============================================
// Página de detalle de un pedido
// ============================================
// Muestra toda la información del pedido incluyendo
// cada línea con producto, cantidad, descuento y subtotal.

const colorEstado: Record<string, string> = {
  Pendiente: "bg-yellow-100 text-yellow-700",
  Entregado: "bg-green-100 text-green-700",
  Cancelado: "bg-red-100 text-red-500",
};

export default async function DetallePedidoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pedido = await obtenerPedido(id);

  if (!pedido) {
    notFound();
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/pedidos"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← Volver a pedidos
        </Link>
      </div>

      {/* Encabezado del pedido */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Pedido para {pedido.cliente?.nombre}
            </h1>
            <p className="text-gray-500 mt-1">
              {pedido.cliente?.telefono || "Sin teléfono"}
            </p>
          </div>
          <span
            className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
              colorEstado[pedido.estado?.nombre] || "bg-gray-100 text-gray-700"
            }`}
          >
            {pedido.estado?.nombre}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div>
            <p className="text-xs text-gray-500 uppercase">Fecha de Entrega</p>
            <p className="text-sm font-medium text-gray-900 mt-1">
              {formatearFecha(pedido.fecha_entrega)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Fecha de Creación</p>
            <p className="text-sm font-medium text-gray-900 mt-1">
              {formatearFecha(pedido.created_at)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Cambiar Estado</p>
            <div className="mt-1">
              <CambiarEstadoSelect
                pedidoId={pedido.id}
                estadoActualId={pedido.estado_id}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Detalle de productos */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Productos del Pedido
          </h2>
        </div>

        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                Producto
              </th>
              <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                Cantidad
              </th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                Precio Unit.
              </th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                Descuento
              </th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                Subtotal
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {pedido.detalles?.map((detalle: Record<string, any>) => (
              <tr key={detalle.id}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {detalle.producto?.nombre || "Producto eliminado"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 text-center">
                  {detalle.cantidad}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 text-right">
                  {formatearMoneda(detalle.precio_unitario)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 text-right">
                  {detalle.descuento_porcentaje > 0 ? (
                    <span>
                      {detalle.descuento_porcentaje}% ({formatearMoneda(detalle.descuento_monto)})
                    </span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                  {formatearMoneda(detalle.subtotal)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
          <div className="text-right">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatearMoneda(pedido.total)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}