import { obtenerCliente } from "../../actions";
import { EditarClienteForm } from "./editar-form";
import { notFound } from "next/navigation";
import Link from "next/link";

// ============================================
// Página de edición de cliente
// ============================================
// La ruta es /clientes/[id]/editar
// [id] es un segmento dinámico: Next.js lo extrae de la URL
// y lo pasa como params. Ejemplo: /clientes/abc-123/editar
// → params.id = "abc-123"

export default async function EditarClientePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const queryParams = await searchParams;
  const cliente = await obtenerCliente(id);

  // Si el cliente no existe (URL inválida o no es tuyo por RLS)
  if (!cliente) {
    notFound();
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/clientes"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← Volver a clientes
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Editar Cliente</h1>

      {queryParams.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6 text-sm">
          {queryParams.error}
        </div>
      )}

      <EditarClienteForm cliente={cliente} />
    </div>
  );
}