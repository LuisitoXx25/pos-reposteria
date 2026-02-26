import { createClient } from "@/lib/supabase/server";
import { formatearMoneda, formatearFecha } from "@/lib/utils";
import Link from "next/link";

// ============================================
// Dashboard con Alertas de Entrega
// ============================================
// Muestra pedidos pendientes agrupados por urgencia:
// - Hoy (rojo): entregas para hoy
// - Mañana (amarillo): entregas para mañana
// - Próximos 3 días (azul): entregas en 2-3 días
// También muestra un resumen general y los pedidos próximos en tabla.

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Calcular fechas
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const manana = new Date(hoy);
  manana.setDate(manana.getDate() + 1);

  const en3Dias = new Date(hoy);
  en3Dias.setDate(en3Dias.getDate() + 3);

  // Formato YYYY-MM-DD para comparar con la BD
  const formatoISO = (d: Date) => d.toISOString().split("T")[0];

  const hoyStr = formatoISO(hoy);
  const mananaStr = formatoISO(manana);
  const en3DiasStr = formatoISO(en3Dias);

  // Traer pedidos pendientes con fecha de entrega dentro de los próximos 3 días
  const { data: pedidosProximos } = await supabase
    .from("pedidos")
    .select(`
      *,
      cliente:clientes(id, nombre, telefono),
      estado:estados_pedido(id, nombre)
    `)
    .eq("estado_id", 1) // Solo pendientes
    .lte("fecha_entrega", en3DiasStr) // Fecha entrega <= 3 días desde hoy
    .gte("fecha_entrega", hoyStr) // Fecha entrega >= hoy (no mostrar atrasados aquí)
    .order("fecha_entrega", { ascending: true });

  // Traer pedidos atrasados (fecha de entrega ya pasó y siguen pendientes)
  const { data: pedidosAtrasados } = await supabase
    .from("pedidos")
    .select(`
      *,
      cliente:clientes(id, nombre, telefono),
      estado:estados_pedido(id, nombre)
    `)
    .eq("estado_id", 1)
    .lt("fecha_entrega", hoyStr)
    .order("fecha_entrega", { ascending: true });

  // Contar por categoría
  const entregasHoy = pedidosProximos?.filter(
    (p) => p.fecha_entrega === hoyStr
  ) || [];

  const entregasManana = pedidosProximos?.filter(
    (p) => p.fecha_entrega === mananaStr
  ) || [];

  const entregasProximas = pedidosProximos?.filter(
    (p) => p.fecha_entrega > mananaStr && p.fecha_entrega <= en3DiasStr
  ) || [];

  // Totales generales
  const { count: totalPendientes } = await supabase
    .from("pedidos")
    .select("*", { count: "exact", head: true })
    .eq("estado_id", 1);

  const { count: totalEntregados } = await supabase
    .from("pedidos")
    .select("*", { count: "exact", head: true })
    .eq("estado_id", 2);

  const { count: totalClientes } = await supabase
    .from("clientes")
    .select("*", { count: "exact", head: true });

  const { count: totalProductos } = await supabase
    .from("productos")
    .select("*", { count: "exact", head: true })
    .eq("activo", true);

  // Combinar atrasados + próximos para la tabla
  const todosPedidosUrgentes = [
    ...(pedidosAtrasados || []).map((p) => ({ ...p, _urgencia: "atrasado" })),
    ...entregasHoy.map((p) => ({ ...p, _urgencia: "hoy" })),
    ...entregasManana.map((p) => ({ ...p, _urgencia: "manana" })),
    ...entregasProximas.map((p) => ({ ...p, _urgencia: "proximos" })),
  ];

  const colorUrgencia: Record<string, string> = {
    atrasado: "bg-red-600 text-white",
    hoy: "bg-red-100 text-red-700",
    manana: "bg-yellow-100 text-yellow-700",
    proximos: "bg-blue-100 text-blue-700",
  };

  const textoUrgencia: Record<string, string> = {
    atrasado: "Atrasado",
    hoy: "Hoy",
    manana: "Mañana",
    proximos: "Próximo",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="text-gray-500 mt-1">
        Bienvenido, {user?.email}
      </p>

      {/* Alertas de entrega */}
      {(pedidosAtrasados?.length || 0) > 0 && (
        <div className="mt-6 bg-red-600 text-white px-4 py-3 rounded-md text-sm font-medium">
          ⚠️ Tienes {pedidosAtrasados?.length}{" "}
          {pedidosAtrasados?.length === 1 ? "pedido atrasado" : "pedidos atrasados"}{" "}
          sin entregar.
        </div>
      )}

      {/* Cards de alertas */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500">Entregas Hoy</h3>
          <p className={`text-3xl font-bold mt-2 ${entregasHoy.length > 0 ? "text-red-600" : "text-gray-300"}`}>
            {entregasHoy.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500">Entregas Mañana</h3>
          <p className={`text-3xl font-bold mt-2 ${entregasManana.length > 0 ? "text-yellow-600" : "text-gray-300"}`}>
            {entregasManana.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500">Próximos 3 días</h3>
          <p className={`text-3xl font-bold mt-2 ${entregasProximas.length > 0 ? "text-blue-600" : "text-gray-300"}`}>
            {entregasProximas.length}
          </p>
        </div>
      </div>

      {/* Resumen general */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase">Pedidos Pendientes</p>
          <p className="text-xl font-bold text-gray-900 mt-1">{totalPendientes || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase">Pedidos Entregados</p>
          <p className="text-xl font-bold text-gray-900 mt-1">{totalEntregados || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase">Clientes</p>
          <p className="text-xl font-bold text-gray-900 mt-1">{totalClientes || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase">Productos Activos</p>
          <p className="text-xl font-bold text-gray-900 mt-1">{totalProductos || 0}</p>
        </div>
      </div>

      {/* Tabla de pedidos urgentes */}
      {todosPedidosUrgentes.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Pedidos que requieren atención
          </h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                    Urgencia
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                    Cliente
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                    Fecha Entrega
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                    Total
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {todosPedidosUrgentes.map((pedido) => (
                  <tr key={pedido.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                          colorUrgencia[pedido._urgencia]
                        }`}
                      >
                        {textoUrgencia[pedido._urgencia]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">
                        {pedido.cliente?.nombre}
                      </p>
                      <p className="text-xs text-gray-500">
                        {pedido.cliente?.telefono || ""}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {formatearFecha(pedido.fecha_entrega)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                      {formatearMoneda(pedido.total)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/pedidos/${pedido.id}`}
                        className="text-sm text-pink-600 hover:text-pink-700 font-medium"
                      >
                        Ver detalle
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {todosPedidosUrgentes.length === 0 && (
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No hay pedidos urgentes por atender.</p>
          <Link
            href="/pedidos/nuevo"
            className="text-pink-600 hover:text-pink-700 text-sm font-medium mt-2 inline-block"
          >
            Crear un nuevo pedido
          </Link>
        </div>
      )}
    </div>
  );
}