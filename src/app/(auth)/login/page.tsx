"use client";

import { login } from "../actions";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="card" style={{ padding: "2rem" }}>
      <div className="text-center mb-6">
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>Bienvenida de vuelta</h1>
        <p style={{ color: "var(--dolci-texto-muted)", fontSize: "0.875rem", marginTop: "0.5rem" }}>
          Inicia sesión para gestionar tus pedidos
        </p>
      </div>

      {error && <div className="alert-error mb-4">{error}</div>}

      <form action={login} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1">Correo electrónico</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="tu@correo.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-1">Contraseña</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="••••••••"
          />
        </div>

        <button type="submit" className="btn-primary w-full justify-center" style={{ marginTop: "0.5rem" }}>
          Iniciar Sesión
        </button>
      </form>

      <p className="text-center mt-6" style={{ fontSize: "0.875rem", color: "var(--dolci-texto-muted)" }}>
        ¿No tienes cuenta?{" "}
        <Link href="/registro" className="link-primary">
          Regístrate
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}