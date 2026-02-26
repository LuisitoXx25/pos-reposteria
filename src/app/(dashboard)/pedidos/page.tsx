import Link from "next/link";
import { obtenerPedidos } from "./actions";
import { formatearMoneda, formatearFecha } from "@/lib/utils";
import { CambiarEstadoSelect } from "./cambiar-estado-select";

const badgeEstado: Record<string, string> = {
  Pendiente: "badge-pendiente",
  Entregado: "badge-entregado",
  Cancelado: "badge-cancelado",
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 600 }}>Pedidos</h1>
          <p style={{ color: "var(--dolci-texto-muted)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
            {pedidos.length} {pedidos.length === 1 ? "pedido" : "pedidos"} registrados
          </p>
        </div>
        <Link href="/pedidos/nuevo" className="btn-primary">
          + Nuevo Pedido
        </Link>
      </div>

      {params.error && <div className="alert-error mb-6">{params.error}</div>}

      {pedidos.length === 0 ? (
        <div className="card text-center" style={{ padding: "3rem" }}>
          <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📋</p>
          <p style={{ color: "var(--dolci-texto-muted)" }}>No hay pedidos registrados todavía.</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Fecha Entrega</th>
                <th>Total</th>
                <th>Estado</th>
                <th style={{ textAlign: "right" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <tr key={pedido.id}>
                  <td>
                    <p style={{ fontWeight: 500 }}>{pedido.cliente?.nombre}</p>
                    <p style={{ color: "var(--dolci-texto-muted)", fontSize: "0.75rem" }}>
                      {pedido.cliente?.telefono || ""}
                    </p>
                  </td>
                  <td>{formatearFecha(pedido.fecha_entrega)}</td>
                  <td style={{ fontWeight: 500 }}>{formatearMoneda(pedido.total)}</td>
                  <td>
                    <span className={`badge ${badgeEstado[pedido.estado?.nombre] || ""}`}>
                      {pedido.estado?.nombre}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/pedidos/${pedido.id}`} className="link-primary">Ver detalle</Link>
                      <CambiarEstadoSelect pedidoId={pedido.id} estadoActualId={pedido.estado_id} />
                    </div>
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