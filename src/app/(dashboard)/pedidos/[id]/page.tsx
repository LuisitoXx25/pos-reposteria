import { obtenerClientes } from "../../clientes/actions";
import { obtenerProductosActivos } from "../../productos/actions";
import { NuevoPedidoForm } from "../nuevo-pedido-form";
import Link from "next/link";

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
        <Link href="/pedidos" style={{ color: "var(--dolci-texto-muted)", fontSize: "0.875rem" }}>
          ← Volver a pedidos
        </Link>
      </div>

      <h1 style={{ fontSize: "1.75rem", fontWeight: 600, marginBottom: "1.5rem" }}>Nuevo Pedido</h1>

      {params.error && <div className="alert-error mb-6">{params.error}</div>}

      {clientes.length === 0 && (
        <div className="alert-warning mb-6">
          No tienes clientes registrados.{" "}
          <Link href="/clientes" className="underline font-medium">Crea uno primero</Link>.
        </div>
      )}

      {productos.length === 0 && (
        <div className="alert-warning mb-6">
          No tienes productos activos.{" "}
          <Link href="/productos" className="underline font-medium">Crea uno primero</Link>.
        </div>
      )}

      {clientes.length > 0 && productos.length > 0 && (
        <NuevoPedidoForm clientes={clientes} productos={productos} />
      )}
    </div>
  );
}