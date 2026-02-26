import Link from "next/link";
import { logout } from "../(auth)/actions";

// Layout del dashboard: todas las rutas protegidas comparten
// este layout con sidebar de navegación.
// El route group (dashboard) no aparece en la URL.

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
        <h1 className="text-xl font-bold text-pink-600 mb-8">🧁 POS Repostería</h1>

        <nav className="space-y-2 flex-1">
          <Link
            href="/"
            className="block px-4 py-2 rounded-md text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/clientes"
            className="block px-4 py-2 rounded-md text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
          >
            Clientes
          </Link>
          <Link
            href="/productos"
            className="block px-4 py-2 rounded-md text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
          >
            Productos
          </Link>
          <Link
            href="/pedidos"
            className="block px-4 py-2 rounded-md text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
          >
            Pedidos
          </Link>
        </nav>

        {/* Logout al fondo del sidebar */}
        <form action={logout}>
          <button
            type="submit"
            className="w-full px-4 py-2 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors text-left"
          >
            Cerrar Sesión
          </button>
        </form>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}