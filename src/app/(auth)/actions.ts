"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

// ============================================
// Server Actions de Autenticación
// ============================================
// Los Server Actions son funciones que se ejecutan en el servidor
// pero se pueden llamar directamente desde formularios del cliente.
// Piénsalo como endpoints de API, pero sin tener que crear rutas.

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Redirigimos de vuelta al login con el error como query param
    // para mostrarlo en la UI
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/");
}

export async function registro(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  // Validación básica en servidor (nunca confíes solo en el cliente)
  if (password !== confirmPassword) {
    redirect("/registro?error=" + encodeURIComponent("Las contraseñas no coinciden"));
  }

  if (password.length < 6) {
    redirect("/registro?error=" + encodeURIComponent("La contraseña debe tener al menos 6 caracteres"));
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    redirect(`/registro?error=${encodeURIComponent(error.message)}`);
  }

  // Como desactivamos "Confirm email", el usuario queda logueado de inmediato
  redirect("/");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}