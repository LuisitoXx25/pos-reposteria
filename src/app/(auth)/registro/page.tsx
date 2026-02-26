"use client";

import { registro } from "../actions";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function RegistroForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="card" style={{ padding: "2rem" }}>
      <div className="text-center mb-6">
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>Crear tu cuenta</h1>
        <p style={{ color: "var(--dolci-texto-muted)", fontSize: "0.875rem", marginTop: "0.5rem" }}>
          Comienza a gestionar tu repostería
        </p>
      </div>

      {error && <div className="alert-error mb-4">{error}</div>}

      <form action={registro} className="space-y-4">
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
            minLength={6}
            placeholder="Mínimo 6 caracteres"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block mb-1">Confirmar contraseña</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            minLength={6}
            placeholder="Repite tu contraseña"
          />
        </div>

        <button type="submit" className="btn-primary w-full justify-center" style={{ marginTop: "0.5rem" }}>
          Crear Cuenta
        </button>
      </form>

      <p className="text-center mt-6" style={{ fontSize: "0.875rem", color: "var(--dolci-texto-muted)" }}>
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="link-primary">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}

export default function RegistroPage() {
  return (
    <Suspense>
      <RegistroForm />
    </Suspense>
  );
}