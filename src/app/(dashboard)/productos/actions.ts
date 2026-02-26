"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// ============================================
// Server Actions de Productos
// ============================================

export async function obtenerProductos() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error al obtener productos:", error.message);
    return [];
  }

  return data;
}

export async function obtenerProducto(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error al obtener producto:", error.message);
    return null;
  }

  return data;
}

// Solo traer productos activos (para usar en el módulo de pedidos)
export async function obtenerProductosActivos() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("activo", true)
    .order("nombre", { ascending: true });

  if (error) {
    console.error("Error al obtener productos activos:", error.message);
    return [];
  }

  return data;
}

export async function crearProducto(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const nombre = formData.get("nombre") as string;
  const precio = parseFloat(formData.get("precio") as string);

  if (!nombre || nombre.trim() === "") {
    redirect("/productos?error=" + encodeURIComponent("El nombre es obligatorio"));
  }

  if (isNaN(precio) || precio <= 0) {
    redirect("/productos?error=" + encodeURIComponent("El precio debe ser mayor a 0"));
  }

  const { error } = await supabase.from("productos").insert({
    user_id: user.id,
    nombre: nombre.trim(),
    precio,
    activo: true,
  });

  if (error) {
    redirect("/productos?error=" + encodeURIComponent(error.message));
  }

  revalidatePath("/productos");
  redirect("/productos");
}

export async function actualizarProducto(id: string, formData: FormData) {
  const supabase = await createClient();

  const nombre = formData.get("nombre") as string;
  const precio = parseFloat(formData.get("precio") as string);

  if (!nombre || nombre.trim() === "") {
    redirect(`/productos/${id}/editar?error=` + encodeURIComponent("El nombre es obligatorio"));
  }

  if (isNaN(precio) || precio <= 0) {
    redirect(`/productos/${id}/editar?error=` + encodeURIComponent("El precio debe ser mayor a 0"));
  }

  const { error } = await supabase
    .from("productos")
    .update({
      nombre: nombre.trim(),
      precio,
    })
    .eq("id", id);

  if (error) {
    redirect(`/productos/${id}/editar?error=` + encodeURIComponent(error.message));
  }

  revalidatePath("/productos");
  redirect("/productos");
}

// Toggle activo/inactivo (baja lógica)
// En lugar de borrar un producto, lo desactivamos.
// Así el historial de pedidos sigue intacto.
export async function toggleActivoProducto(formData: FormData) {
  const supabase = await createClient();

  const id = formData.get("id") as string;
  const activoActual = formData.get("activo") === "true";

  const { error } = await supabase
    .from("productos")
    .update({ activo: !activoActual })
    .eq("id", id);

  if (error) {
    redirect("/productos?error=" + encodeURIComponent(error.message));
  }

  revalidatePath("/productos");
}