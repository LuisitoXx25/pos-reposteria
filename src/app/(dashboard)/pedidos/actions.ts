"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  calcularDescuentoMonto,
  calcularSubtotal,
  calcularTotalPedido,
} from "@/lib/utils";

// ============================================
// Server Actions de Pedidos
// ============================================

// Tipo para las líneas del pedido que llegan del formulario
interface LineaPedido {
  producto_id: string;
  cantidad: number;
  precio_unitario: number;
  descuento_porcentaje: number;
}

export async function obtenerPedidos() {
  const supabase = await createClient();

  // JOIN con clientes y estados_pedido para traer nombres
  const { data, error } = await supabase
    .from("pedidos")
    .select(`
      *,
      cliente:clientes(id, nombre, telefono),
      estado:estados_pedido(id, nombre)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error al obtener pedidos:", error.message);
    return [];
  }

  return data;
}

export async function obtenerPedido(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("pedidos")
    .select(`
      *,
      cliente:clientes(id, nombre, telefono),
      estado:estados_pedido(id, nombre),
      detalles:pedido_detalle(
        *,
        producto:productos(id, nombre)
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error al obtener pedido:", error.message);
    return null;
  }

  return data;
}

export async function obtenerEstados() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("estados_pedido")
    .select("*")
    .order("id");

  if (error) {
    console.error("Error al obtener estados:", error.message);
    return [];
  }

  return data;
}

export async function crearPedido(datos: {
  cliente_id: string;
  fecha_entrega: string;
  lineas: LineaPedido[];
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Validaciones
  if (!datos.cliente_id) {
    redirect("/pedidos/nuevo?error=" + encodeURIComponent("Debes seleccionar un cliente"));
  }

  if (!datos.fecha_entrega) {
    redirect("/pedidos/nuevo?error=" + encodeURIComponent("Debes seleccionar una fecha de entrega"));
  }

  if (!datos.lineas || datos.lineas.length === 0) {
    redirect("/pedidos/nuevo?error=" + encodeURIComponent("Debes agregar al menos un producto"));
  }

  // Calcular los montos de cada línea
  const detallesCalculados = datos.lineas.map((linea) => {
    const descMonto = calcularDescuentoMonto(
      linea.precio_unitario,
      linea.cantidad,
      linea.descuento_porcentaje
    );
    const sub = calcularSubtotal(
      linea.precio_unitario,
      linea.cantidad,
      descMonto
    );

    return {
      producto_id: linea.producto_id,
      cantidad: linea.cantidad,
      precio_unitario: linea.precio_unitario,
      descuento_porcentaje: linea.descuento_porcentaje,
      descuento_monto: descMonto,
      subtotal: sub,
    };
  });

  const total = calcularTotalPedido(detallesCalculados);

  // 1. Insertar el pedido
  const { data: pedido, error: errorPedido } = await supabase
    .from("pedidos")
    .insert({
      user_id: user.id,
      cliente_id: datos.cliente_id,
      estado_id: 1, // Pendiente
      fecha_entrega: datos.fecha_entrega,
      total,
    })
    .select()
    .single();

  if (errorPedido) {
    redirect("/pedidos/nuevo?error=" + encodeURIComponent(errorPedido.message));
  }

  // 2. Insertar los detalles asociados al pedido
  const detallesConPedidoId = detallesCalculados.map((d) => ({
    ...d,
    pedido_id: pedido.id,
  }));

  const { error: errorDetalles } = await supabase
    .from("pedido_detalle")
    .insert(detallesConPedidoId);

  if (errorDetalles) {
    // Si fallan los detalles, eliminamos el pedido huérfano
    await supabase.from("pedidos").delete().eq("id", pedido.id);
    redirect("/pedidos/nuevo?error=" + encodeURIComponent(errorDetalles.message));
  }

  revalidatePath("/pedidos");
  redirect("/pedidos");
}

export async function cambiarEstadoPedido(formData: FormData) {
  const supabase = await createClient();

  const pedidoId = formData.get("pedido_id") as string;
  const estadoId = parseInt(formData.get("estado_id") as string);

  const { error } = await supabase
    .from("pedidos")
    .update({ estado_id: estadoId })
    .eq("id", pedidoId);

  if (error) {
    redirect("/pedidos?error=" + encodeURIComponent(error.message));
  }

  revalidatePath("/pedidos");
  revalidatePath(`/pedidos/${pedidoId}`);
}