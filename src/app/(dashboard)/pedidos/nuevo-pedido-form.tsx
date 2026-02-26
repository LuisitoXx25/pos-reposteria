"use client";

import { useState } from "react";
import { crearPedido } from "./actions";
import { Cliente, Producto } from "@/types";
import {
  calcularDescuentoMonto,
  calcularSubtotal,
  calcularTotalPedido,
  formatearMoneda,
} from "@/lib/utils";

// ============================================
// Formulario de Nuevo Pedido
// ============================================
// Este es el componente más complejo de la app.
// Maneja estado local para las líneas de productos
// y calcula todo en tiempo real antes de enviar al servidor.

interface LineaFormulario {
  key: number; // Para React keys, no se envía al server
  producto_id: string;
  cantidad: number;
  precio_unitario: number;
  descuento_porcentaje: number;
}

export function NuevoPedidoForm({
  clientes,
  productos,
}: {
  clientes: Cliente[];
  productos: Producto[];
}) {
  const [clienteId, setClienteId] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [lineas, setLineas] = useState<LineaFormulario[]>([]);
  const [enviando, setEnviando] = useState(false);

  // Contador para keys únicas
  const [nextKey, setNextKey] = useState(1);

  // Agregar una línea vacía
  function agregarLinea() {
    setLineas([
      ...lineas,
      {
        key: nextKey,
        producto_id: "",
        cantidad: 1,
        precio_unitario: 0,
        descuento_porcentaje: 0,
      },
    ]);
    setNextKey(nextKey + 1);
  }

  // Eliminar una línea
  function eliminarLinea(key: number) {
    setLineas(lineas.filter((l) => l.key !== key));
  }

  // Actualizar una línea
  function actualizarLinea(key: number, campo: Partial<LineaFormulario>) {
    setLineas(
      lineas.map((l) => {
        if (l.key !== key) return l;

        const actualizada = { ...l, ...campo };

        // Si cambió el producto, actualizar el precio automáticamente
        if (campo.producto_id) {
          const producto = productos.find((p) => p.id === campo.producto_id);
          if (producto) {
            actualizada.precio_unitario = producto.precio;
          }
        }

        return actualizada;
      })
    );
  }

  // Calcular totales para mostrar en la UI
  const lineasConCalculos = lineas.map((l) => {
    const descMonto = calcularDescuentoMonto(
      l.precio_unitario,
      l.cantidad,
      l.descuento_porcentaje
    );
    const sub = calcularSubtotal(l.precio_unitario, l.cantidad, descMonto);
    return { ...l, descuento_monto: descMonto, subtotal: sub };
  });

  const total = calcularTotalPedido(lineasConCalculos);

  // Enviar al servidor
  async function handleSubmit() {
    setEnviando(true);

    await crearPedido({
      cliente_id: clienteId,
      fecha_entrega: fechaEntrega,
      lineas: lineas.map((l) => ({
        producto_id: l.producto_id,
        cantidad: l.cantidad,
        precio_unitario: l.precio_unitario,
        descuento_porcentaje: l.descuento_porcentaje,
      })),
    });

    // Si llegamos aquí sin redirect, algo salió mal
    setEnviando(false);
  }

  // Fecha mínima: hoy
  const hoy = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-6">
      {/* Datos generales del pedido */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Datos del Pedido
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cliente *
            </label>
            <select
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="">Selecciona un cliente</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre} {c.telefono ? `(${c.telefono})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Entrega *
            </label>
            <input
              type="date"
              value={fechaEntrega}
              onChange={(e) => setFechaEntrega(e.target.value)}
              min={hoy}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Líneas de productos */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Productos</h2>
          <button
            type="button"
            onClick={agregarLinea}
            className="bg-pink-600 text-white px-3 py-1 rounded-md hover:bg-pink-700 transition-colors text-sm font-medium"
          >
            + Agregar producto
          </button>
        </div>

        {lineas.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">
            Agrega productos al pedido usando el botón de arriba.
          </p>
        ) : (
          <div className="space-y-4">
            {/* Header de la tabla */}
            <div className="hidden md:grid md:grid-cols-12 gap-3 text-xs font-medium text-gray-500 uppercase px-1">
              <div className="col-span-4">Producto</div>
              <div className="col-span-1">Cant.</div>
              <div className="col-span-2">Precio Unit.</div>
              <div className="col-span-1">Desc. %</div>
              <div className="col-span-2">Desc. $</div>
              <div className="col-span-1">Subtotal</div>
              <div className="col-span-1"></div>
            </div>

            {/* Líneas */}
            {lineasConCalculos.map((linea) => (
              <div
                key={linea.key}
                className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-gray-50 rounded-md p-3"
              >
                {/* Producto */}
                <div className="md:col-span-4">
                  <label className="md:hidden text-xs text-gray-500 mb-1 block">
                    Producto
                  </label>
                  <select
                    value={linea.producto_id}
                    onChange={(e) =>
                      actualizarLinea(linea.key, {
                        producto_id: e.target.value,
                      })
                    }
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="">Seleccionar...</option>
                    {productos.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nombre} — {formatearMoneda(p.precio)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Cantidad */}
                <div className="md:col-span-1">
                  <label className="md:hidden text-xs text-gray-500 mb-1 block">
                    Cantidad
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={linea.cantidad}
                    onChange={(e) =>
                      actualizarLinea(linea.key, {
                        cantidad: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                {/* Precio unitario (readonly, viene del producto) */}
                <div className="md:col-span-2">
                  <label className="md:hidden text-xs text-gray-500 mb-1 block">
                    Precio Unit.
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={formatearMoneda(linea.precio_unitario)}
                    className="w-full px-2 py-1.5 border border-gray-200 rounded-md text-sm bg-gray-100 text-gray-600"
                  />
                </div>

                {/* Descuento % */}
                <div className="md:col-span-1">
                  <label className="md:hidden text-xs text-gray-500 mb-1 block">
                    Desc. %
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={linea.descuento_porcentaje}
                    onChange={(e) =>
                      actualizarLinea(linea.key, {
                        descuento_porcentaje:
                          parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                {/* Descuento monto (calculado) */}
                <div className="md:col-span-2">
                  <label className="md:hidden text-xs text-gray-500 mb-1 block">
                    Desc. $
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={formatearMoneda(linea.descuento_monto)}
                    className="w-full px-2 py-1.5 border border-gray-200 rounded-md text-sm bg-gray-100 text-gray-600"
                  />
                </div>

                {/* Subtotal (calculado) */}
                <div className="md:col-span-1">
                  <label className="md:hidden text-xs text-gray-500 mb-1 block">
                    Subtotal
                  </label>
                  <span className="text-sm font-medium text-gray-900">
                    {formatearMoneda(linea.subtotal)}
                  </span>
                </div>

                {/* Eliminar */}
                <div className="md:col-span-1 text-right">
                  <button
                    type="button"
                    onClick={() => eliminarLinea(linea.key)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Total */}
        {lineas.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
            <div className="text-right">
              <p className="text-sm text-gray-500">Total del pedido</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatearMoneda(total)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Botón guardar */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={
            enviando ||
            !clienteId ||
            !fechaEntrega ||
            lineas.length === 0 ||
            lineas.some((l) => !l.producto_id)
          }
          className="bg-pink-600 text-white px-6 py-2 rounded-md hover:bg-pink-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {enviando ? "Guardando..." : "Crear Pedido"}
        </button>
        <a
          href="/pedidos"
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors text-sm inline-block"
        >
          Cancelar
        </a>
      </div>
    </div>
  );
}