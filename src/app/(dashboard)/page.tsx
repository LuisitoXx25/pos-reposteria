import { createClient } from "@/lib/supabase/server";

// Esta es la página principal del dashboard.
// Por ahora solo muestra un saludo. La llenaremos con las
// alertas de pedidos próximos a entregar más adelante.

export default async function DashboardPage() {
  const supabase = await createClient();

  // Obtenemos el usuario actual para mostrar su email
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="text-gray-500 mt-2">
        Bienvenido, {user?.email}
      </p>

      {/* Aquí irán las alertas de pedidos próximos */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500">Entregas Hoy</h3>
          <p className="text-3xl font-bold text-pink-600 mt-2">—</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500">Entregas Mañana</h3>
          <p className="text-3xl font-bold text-yellow-600 mt-2">—</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500">Próximos 3 días</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">—</p>
        </div>
      </div>
    </div>
  );
}