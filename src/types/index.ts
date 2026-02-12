// ============================================
// Tipos que representan las tablas de la BD
// ============================================
// Estos tipos te dan autocompletado en todo el proyecto.
// Cuando escribas "cliente." tu editor te va a sugerir
// todos los campos disponibles.

export interface EstadoPedido {
  id: number;
  nombre: string;
}

export interface Cliente {
  id: string;
  user_id: string;
  nombre: string;
  telefono: string | null;
  notas: string | null;
  created_at: string;
  updated_at: string;
}

export interface Producto {
  id: string;
  user_id: string;
  nombre: string;
  precio: number;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Pedido {
  id: string;
  user_id: string;
  cliente_id: string;
  estado_id: number;
  fecha_entrega: string;
  total: number;
  created_at: string;
  updated_at: string;
}

export interface PedidoDetalle {
  id: string;
  pedido_id: string;
  producto_id: string;
  cantidad: number;
  precio_unitario: number;
  descuento_porcentaje: number;
  descuento_monto: number;
  subtotal: number;
}

// ============================================
// Tipos extendidos (con relaciones)
// ============================================
// Cuando hagas JOINs en tus queries, el resultado
// va a traer datos de varias tablas. Estos tipos
// representan esas respuestas combinadas.

export interface PedidoConRelaciones extends Pedido {
  cliente: Cliente;
  estado: EstadoPedido;
  detalles: PedidoDetalleConProducto[];
}

export interface PedidoDetalleConProducto extends PedidoDetalle {
  producto: Producto;
}

// ============================================
// Tipos para formularios (sin campos auto-generados)
// ============================================
// Cuando creas un registro nuevo, no mandas id, created_at, etc.
// Estos tipos representan solo los campos que el usuario llena.

export type ClienteFormData = Omit<Cliente, "id" | "user_id" | "created_at" | "updated_at">;

export type ProductoFormData = Omit<Producto, "id" | "user_id" | "created_at" | "updated_at">;

export type PedidoFormData = Omit<Pedido, "id" | "user_id" | "total" | "created_at" | "updated_at">;

export type PedidoDetalleFormData = Omit<PedidoDetalle, "id" | "descuento_monto" | "subtotal">;
