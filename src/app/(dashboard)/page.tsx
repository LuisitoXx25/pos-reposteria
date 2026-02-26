import { createClient } from "@/lib/supabase/server";
import { formatearMoneda, formatearFecha } from "@/lib/utils";
import Link from "next/link";

const badgeUrgencia: Record<string, string> = {
  atrasado: "badge-atrasado",
  hoy: "badge-hoy",
  manana: "badge-manana",
  proximos: "badge-proximos",
};

const textoUrgencia: Record<string, string> = {
  atrasado: "Atrasado",
  hoy: "Hoy",
  manana: "Mañana",
  proximos: "Próximo",
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fechas
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const manana = new Date(hoy);
  manana.setDate(manana.getDate() + 1);
  const en3Dias = new Date(hoy);
  en3Dias.setDate(en3Dias.getDate() + 3);

  const fmt = (d: Date) => d.toISOString().split("T")[0];
  const hoyStr = fmt(hoy);
  const mananaStr = fmt(manana);
  const en3DiasStr = fmt(en3Dias);

  // Queries
  const { data: pedidosProximos } = await supabase
    .from("pedidos")
    .select("*, cliente:clientes(id, nombre, telefono), estado:estados_pedido(id, nombre)")
    .eq("estado_id", 1)
    .lte("fecha_entrega", en3DiasStr)
    .gte("fecha_entrega", hoyStr)
    .order("fecha_entrega", { ascending: true });

  const { data: pedidosAtrasados } = await supabase
    .from("pedidos")
    .select("*, cliente:clientes(id, nombre, telefono), estado:estados_pedido(id, nombre)")
    .eq("estado_id", 1)
    .lt("fecha_entrega", hoyStr)
    .order("fecha_entrega", { ascending: true });

  const entregasHoy = pedidosProximos?.filter((p) => p.fecha_entrega === hoyStr) || [];
  const entregasManana = pedidosProximos?.filter((p) => p.fecha_entrega === mananaStr) || [];
  const entregasProximas = pedidosProximos?.filter((p) => p.fecha_entrega > mananaStr) || [];

  const { count: totalPendientes } = await supabase.from("pedidos").select("*", { count: "exact", head: true }).eq("estado_id", 1);
  const { count: totalEntregados } = await supabase.from("pedidos").select("*", { count: "exact", head: true }).eq("estado_id", 2);
  const { count: totalClientes } = await supabase.from("clientes").select("*", { count: "exact", head: true });
  const { count: totalProductos } = await supabase.from("productos").select("*", { count: "exact", head: true }).eq("activo", true);

  const todosPedidosUrgentes = [
    ...(pedidosAtrasados || []).map((p) => ({ ...p, _urgencia: "atrasado" })),
    ...entregasHoy.map((p) => ({ ...p, _urgencia: "hoy" })),
    ...entregasManana.map((p) => ({ ...p, _urgencia: "manana" })),
    ...entregasProximas.map((p) => ({ ...p, _urgencia: "proximos" })),
  ];

  // Saludo según hora del día
  const hora = new Date().getHours();
  const saludo = hora < 12 ? "Buenos días" : hora < 18 ? "Buenas tardes" : "Buenas noches";

  return (
    <div>
      {/* Header con acción rápida */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 600 }}>{saludo} ✨</h1>
          <p style={{ color: "var(--dolci-texto-muted)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
            {user?.email}
          </p>
        </div>
        <Link href="/pedidos/nuevo" className="btn-primary">
          + Nuevo Pedido
        </Link>
      </div>

      {/* Alerta de atrasados */}
      {(pedidosAtrasados?.length || 0) > 0 && (
        <div className="alert-urgent mb-6">
          ⚠️ Tienes {pedidosAtrasados?.length}{" "}
          {pedidosAtrasados?.length === 1 ? "pedido atrasado" : "pedidos atrasados"} sin entregar
        </div>
      )}

      {/* Cards de urgencia */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card" style={{ textAlign: "center" }}>
          <p style={{ fontSize: "0.75rem", color: "var(--dolci-texto-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Entregas Hoy
          </p>
          <p style={{
            fontSize: "2.5rem",
            fontWeight: 700,
            fontFamily: "Cormorant Garamond, serif",
            color: entregasHoy.length > 0 ? "var(--dolci-error)" : "var(--dolci-borde)",
            marginTop: "0.25rem",
          }}>
            {entregasHoy.length}
          </p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <p style={{ fontSize: "0.75rem", color: "var(--dolci-texto-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Entregas Mañana
          </p>
          <p style={{
            fontSize: "2.5rem",
            fontWeight: 700,
            fontFamily: "Cormorant Garamond, serif",
            color: entregasManana.length > 0 ? "var(--dolci-alerta)" : "var(--dolci-borde)",
            marginTop: "0.25rem",
          }}>
            {entregasManana.length}
          </p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <p style={{ fontSize: "0.75rem", color: "var(--dolci-texto-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Próximos 3 días
          </p>
          <p style={{
            fontSize: "2.5rem",
            fontWeight: 700,
            fontFamily: "Cormorant Garamond, serif",
            color: entregasProximas.length > 0 ? "var(--dolci-info)" : "var(--dolci-borde)",
            marginTop: "0.25rem",
          }}>
            {entregasProximas.length}
          </p>
        </div>
      </div>

      {/* Resumen general */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card-stat">
          <p style={{ fontSize: "0.6875rem", color: "var(--dolci-texto-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Pendientes</p>
          <p style={{ fontSize: "1.5rem", fontWeight: 700, fontFamily: "Cormorant Garamond, serif", marginTop: "0.25rem" }}>{totalPendientes || 0}</p>
        </div>
        <div className="card-stat">
          <p style={{ fontSize: "0.6875rem", color: "var(--dolci-texto-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Entregados</p>
          <p style={{ fontSize: "1.5rem", fontWeight: 700, fontFamily: "Cormorant Garamond, serif", marginTop: "0.25rem" }}>{totalEntregados || 0}</p>
        </div>
        <div className="card-stat">
          <p style={{ fontSize: "0.6875rem", color: "var(--dolci-texto-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Clientes</p>
          <p style={{ fontSize: "1.5rem", fontWeight: 700, fontFamily: "Cormorant Garamond, serif", marginTop: "0.25rem" }}>{totalClientes || 0}</p>
        </div>
        <div className="card-stat">
          <p style={{ fontSize: "0.6875rem", color: "var(--dolci-texto-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Productos</p>
          <p style={{ fontSize: "1.5rem", fontWeight: 700, fontFamily: "Cormorant Garamond, serif", marginTop: "0.25rem" }}>{totalProductos || 0}</p>
        </div>
      </div>

      {/* Tabla de pedidos urgentes */}
      {todosPedidosUrgentes.length > 0 ? (
        <div>
          <h2 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "1rem" }}>
            Pedidos que requieren atención
          </h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Urgencia</th>
                  <th>Cliente</th>
                  <th>Fecha Entrega</th>
                  <th style={{ textAlign: "right" }}>Total</th>
                  <th style={{ textAlign: "right" }}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {todosPedidosUrgentes.map((pedido) => (
                  <tr key={pedido.id}>
                    <td>
                      <span className={`badge ${badgeUrgencia[pedido._urgencia]}`}>
                        {textoUrgencia[pedido._urgencia]}
                      </span>
                    </td>
                    <td>
                      <p style={{ fontWeight: 500 }}>{pedido.cliente?.nombre}</p>
                      <p style={{ color: "var(--dolci-texto-muted)", fontSize: "0.75rem" }}>
                        {pedido.cliente?.telefono || ""}
                      </p>
                    </td>
                    <td>{formatearFecha(pedido.fecha_entrega)}</td>
                    <td style={{ textAlign: "right", fontWeight: 500 }}>{formatearMoneda(pedido.total)}</td>
                    <td style={{ textAlign: "right" }}>
                      <Link href={`/pedidos/${pedido.id}`} className="link-primary">Ver detalle</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card text-center" style={{ padding: "3rem" }}>
          <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🧁</p>
          <p style={{ color: "var(--dolci-texto-muted)" }}>No hay pedidos urgentes por atender</p>
          <Link href="/pedidos/nuevo" className="link-primary" style={{ marginTop: "0.5rem", display: "inline-block" }}>
            Crear un nuevo pedido
          </Link>
        </div>
      )}
    </div>
  );
}