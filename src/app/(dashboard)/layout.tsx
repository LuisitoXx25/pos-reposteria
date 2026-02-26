"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "../(auth)/actions";
import Image from "next/image";

const navItems = [
  { href: "/", label: "Dashboard", icon: "📊" },
  { href: "/clientes", label: "Clientes", icon: "👥" },
  { href: "/productos", label: "Productos", icon: "🧁" },
  { href: "/pedidos", label: "Pedidos", icon: "📋" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "var(--dolci-crema)" }}>
      {/* Sidebar */}
      <aside className="sidebar">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8 pt-2">
          <Image
            src="/logo.png"
            alt="Dolci Enid"
            width={120}
            height={120}
            className="rounded-full"
            priority
          />
        </div>

        {/* Navigation */}
        <nav className="space-y-1 flex-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-link ${isActive ? "sidebar-link-active" : ""}`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div style={{ borderTop: "1px solid var(--dolci-borde-light)", paddingTop: "1rem" }}>
          <form action={logout}>
            <button
              type="submit"
              className="sidebar-link w-full text-left"
              style={{ color: "var(--dolci-texto-muted)" }}
            >
              <span>🚪</span>
              <span>Cerrar Sesión</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}