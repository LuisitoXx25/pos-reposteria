import { obtenerProducto } from "../../actions";
import { EditarProductoForm } from "./editar-form";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function EditarProductoPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const queryParams = await searchParams;
  const producto = await obtenerProducto(id);

  if (!producto) {
    notFound();
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/productos"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← Volver a productos
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Editar Producto</h1>

      {queryParams.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6 text-sm">
          {queryParams.error}
        </div>
      )}

      <EditarProductoForm producto={producto} />
    </div>
  );
}