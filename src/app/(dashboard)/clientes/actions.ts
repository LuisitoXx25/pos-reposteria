"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// ============================================
// Server Actions de Clientes
// ============================================
// Cada función aquí es una operación de BD que se ejecuta
// en el servidor. revalidatePath() le dice a Next.js que
// los datos cambiaron y debe recargar la página para mostrar
// la info actualizada.

export async function obtenerClientes() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error al obtener clientes:", error.message);
    return [];
  }

  return data;
}

export async function obtenerCliente(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .eq("id", id)
    .single(); // .single() porque esperamos exactamente 1 resultado

  if (error) {
    console.error("Error al obtener cliente:", error.message);
    return null;
  }

  return data;
}

export async function crearCliente(formData: FormData) {
  const supabase = await createClient();

  // Obtener el usuario autenticado para asignar el user_id
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const nombre = formData.get("nombre") as string;
  const telefono = formData.get("telefono") as string;
  const notas = formData.get("notas") as string;

  // Validación básica en servidor
  if (!nombre || nombre.trim() === "") {
    redirect("/clientes?error=" + encodeURIComponent("El nombre es obligatorio"));
  }

  const { error } = await supabase.from("clientes").insert({
    user_id: user.id,
    nombre: nombre.trim(),
    telefono: telefono?.trim() || null,
    notas: notas?.trim() || null,
  });

  if (error) {
    redirect("/clientes?error=" + encodeURIComponent(error.message));
  }

  // Revalidar la página de clientes para que aparezca el nuevo registro
  revalidatePath("/clientes");
  redirect("/clientes");
}

export async function actualizarCliente(id: string, formData: FormData) {
  const supabase = await createClient();

  const nombre = formData.get("nombre") as string;
  const telefono = formData.get("telefono") as string;
  const notas = formData.get("notas") as string;

  if (!nombre || nombre.trim() === "") {
    redirect(`/clientes/${id}/editar?error=` + encodeURIComponent("El nombre es obligatorio"));
  }

  const { error } = await supabase
    .from("clientes")
    .update({
      nombre: nombre.trim(),
      telefono: telefono?.trim() || null,
      notas: notas?.trim() || null,
    })
    .eq("id", id);

  if (error) {
    redirect(`/clientes/${id}/editar?error=` + encodeURIComponent(error.message));
  }

  revalidatePath("/clientes");
  redirect("/clientes");
}

export async function eliminarCliente(formData: FormData) {
  const supabase = await createClient();

  const id = formData.get("id") as string;

  const { error } = await supabase
    .from("clientes")
    .delete()
    .eq("id", id);

  if (error) {
    // Si tiene pedidos asociados, RESTRICT no lo deja borrar
    redirect("/clientes?error=" + encodeURIComponent("No se puede eliminar: el cliente tiene pedidos asociados"));
  }

  revalidatePath("/clientes");
  redirect("/clientes");
}