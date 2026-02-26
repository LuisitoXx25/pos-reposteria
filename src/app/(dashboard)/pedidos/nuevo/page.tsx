import { obtenerClientes } from "../../clientes/actions";
import { obtenerProductosActivos } from "../../productos/actions";
import { NuevoPedidoForm } from "../nuevo-pedido-form";
import Link from "next/link";

// ============================================
// Página para crear un nuevo pedido
// ============================================
// Server Component que carga clientes y productos activos
// y se los pasa al formulario (Client Component).

export default async function NuevoPedidoPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const [clientes, productos] = await Promise.all([
    obtenerClientes(),
    obtenerProductosActivos(),
  ]);

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

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Nuevo Pedido</h1>

      {params.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6 text-sm">
          {params.error}
        </div>
      )}

      {clientes.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md mb-6 text-sm">
          No tienes clientes registrados.{" "}
          <Link href="/clientes" className="underline font-medium">
            Crea uno primero
          </Link>
          .
        </div>
      )}

      {productos.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md mb-6 text-sm">
          No tienes productos activos.{" "}
          <Link href="/productos" className="underline font-medium">
            Crea uno primero
          </Link>
          .
        </div>
      )}

      {clientes.length > 0 && productos.length > 0 && (
        <NuevoPedidoForm clientes={clientes} productos={productos} />
      )}
    </div>
  );
}