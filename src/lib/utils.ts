// ============================================
// Funciones de cálculo
// ============================================
// Centralizamos la lógica de cálculos aquí para que
// se use igual en toda la app (formularios, server actions, etc.)

/**
 * Calcula el monto de descuento a partir del porcentaje.
 * @param precioUnitario - Precio del producto
 * @param cantidad - Cantidad de productos
 * @param descuentoPorcentaje - Porcentaje de 0 a 100 (ej: 15 = 15%)
 * @returns Monto del descuento redondeado a 2 decimales
 *
 * Ejemplo: precioUnitario=150, cantidad=3, descuentoPorcentaje=10
 * → (150 * 3 * 10) / 100 = 45.00
 */
export function calcularDescuentoMonto(
  precioUnitario: number,
  cantidad: number,
  descuentoPorcentaje: number
): number {
  return Math.round((precioUnitario * cantidad * descuentoPorcentaje) / 100 * 100) / 100;
}

/**
 * Calcula el subtotal de una línea de pedido.
 * @returns (precioUnitario * cantidad) - descuentoMonto
 *
 * Ejemplo: precioUnitario=150, cantidad=3, descuentoMonto=45
 * → (150 * 3) - 45 = 405.00
 */
export function calcularSubtotal(
  precioUnitario: number,
  cantidad: number,
  descuentoMonto: number
): number {
  return Math.round((precioUnitario * cantidad - descuentoMonto) * 100) / 100;
}

/**
 * Calcula el total del pedido sumando todos los subtotales.
 * @param detalles - Array con los subtotales de cada línea
 * @returns Suma de todos los subtotales
 */
export function calcularTotalPedido(
  detalles: { subtotal: number }[]
): number {
  return Math.round(detalles.reduce((sum, d) => sum + d.subtotal, 0) * 100) / 100;
}

// ============================================
// Funciones de formato
// ============================================

/**
 * Formatea un número como moneda mexicana.
 * Ejemplo: 1500.5 → "$1,500.50"
 */
export function formatearMoneda(monto: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(monto);
}

/**
 * Formatea una fecha ISO a formato legible.
 * Ejemplo: "2026-02-15" → "15 de febrero de 2026"
 */
export function formatearFecha(fecha: string): string {
  return new Date(fecha + "T00:00:00").toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
