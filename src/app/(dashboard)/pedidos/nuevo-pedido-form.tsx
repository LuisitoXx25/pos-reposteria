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

interface LineaFormulario {
  key: number;
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
  const [fechaEntrega, setFechaEntrega] = useState(
    new Date().toISOString().split("T")[0] // Precargar con fecha actual
  );
  const [lineas, setLineas] = useState<LineaFormulario[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [nextKey, setNextKey] = useState(1);

  function agregarLinea() {
    setLineas([
      ...lineas,
      { key: nextKey, producto_id: "", cantidad: 1, precio_unitario: 0, descuento_porcentaje: 0 },
    ]);
    setNextKey(nextKey + 1);
  }

  function eliminarLinea(key: number) {
    setLineas(lineas.filter((l) => l.key !== key));
  }

  function actualizarLinea(key: number, campo: Partial<LineaFormulario>) {
    setLineas(
      lineas.map((l) => {
        if (l.key !== key) return l;
        const actualizada = { ...l, ...campo };
        if (campo.producto_id) {
          const producto = productos.find((p) => p.id === campo.producto_id);
          if (producto) actualizada.precio_unitario = producto.precio;
        }
        return actualizada;
      })
    );
  }

  const lineasConCalculos = lineas.map((l) => {
    const descMonto = calcularDescuentoMonto(l.precio_unitario, l.cantidad, l.descuento_porcentaje);
    const sub = calcularSubtotal(l.precio_unitario, l.cantidad, descMonto);
    return { ...l, descuento_monto: descMonto, subtotal: sub };
  });

  const total = calcularTotalPedido(lineasConCalculos);

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
    setEnviando(false);
  }

  const hoy = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-6">
      {/* Datos generales */}
      <div className="card">
        <h2 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "1rem" }}>Datos del Pedido</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Cliente *</label>
            <select value={clienteId} onChange={(e) => setClienteId(e.target.value)}>
              <option value="">Selecciona un cliente</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre} {c.telefono ? `(${c.telefono})` : ""}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1">Fecha de Entrega *</label>
            <input type="date" value={fechaEntrega} onChange={(e) => setFechaEntrega(e.target.value)} min={hoy} />
          </div>
        </div>
      </div>

      {/* Líneas de productos */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 style={{ fontSize: "1.125rem", fontWeight: 600 }}>Productos</h2>
          <button type="button" onClick={agregarLinea} className="btn-primary" style={{ padding: "0.375rem 0.75rem", fontSize: "0.8125rem" }}>
            + Agregar
          </button>
        </div>

        {lineas.length === 0 ? (
          <p style={{ color: "var(--dolci-texto-muted)", fontSize: "0.875rem", textAlign: "center", padding: "2rem 0" }}>
            Agrega productos al pedido.
          </p>
        ) : (
          <div className="space-y-3">
            {/* Header */}
            <div className="hidden md:grid md:grid-cols-12 gap-3 px-1" style={{ fontSize: "0.6875rem", fontWeight: 600, color: "var(--dolci-texto-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              <div className="col-span-4">Producto</div>
              <div className="col-span-1">Cant.</div>
              <div className="col-span-2">Precio</div>
              <div className="col-span-1">Desc %</div>
              <div className="col-span-2">Desc $</div>
              <div className="col-span-1">Subtotal</div>
              <div className="col-span-1"></div>
            </div>

            {lineasConCalculos.map((linea) => (
              <div
                key={linea.key}
                className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center p-3"
                style={{ backgroundColor: "var(--dolci-crema)", borderRadius: "0.5rem" }}
              >
                <div className="md:col-span-4">
                  <label className="md:hidden block mb-1" style={{ fontSize: "0.6875rem" }}>Producto</label>
                  <select value={linea.producto_id} onChange={(e) => actualizarLinea(linea.key, { producto_id: e.target.value })}>
                    <option value="">Seleccionar...</option>
                    {productos.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nombre} — {formatearMoneda(p.precio)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-1">
                  <label className="md:hidden block mb-1" style={{ fontSize: "0.6875rem" }}>Cantidad</label>
                  <input type="number" min={1} value={linea.cantidad} onChange={(e) => actualizarLinea(linea.key, { cantidad: parseInt(e.target.value) || 1 })} />
                </div>
                <div className="md:col-span-2">
                  <label className="md:hidden block mb-1" style={{ fontSize: "0.6875rem" }}>Precio</label>
                  <input type="text" readOnly value={formatearMoneda(linea.precio_unitario)} />
                </div>
                <div className="md:col-span-1">
                  <label className="md:hidden block mb-1" style={{ fontSize: "0.6875rem" }}>Desc %</label>
                  <input type="number" min={0} max={100} value={linea.descuento_porcentaje} onChange={(e) => actualizarLinea(linea.key, { descuento_porcentaje: parseFloat(e.target.value) || 0 })} />
                </div>
                <div className="md:col-span-2">
                  <label className="md:hidden block mb-1" style={{ fontSize: "0.6875rem" }}>Desc $</label>
                  <input type="text" readOnly value={formatearMoneda(linea.descuento_monto)} />
                </div>
                <div className="md:col-span-1">
                  <label className="md:hidden block mb-1" style={{ fontSize: "0.6875rem" }}>Subtotal</label>
                  <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>{formatearMoneda(linea.subtotal)}</span>
                </div>
                <div className="md:col-span-1 text-right">
                  <button type="button" onClick={() => eliminarLinea(linea.key)} className="btn-danger">✕</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {lineas.length > 0 && (
          <div className="mt-6 pt-4 flex justify-end" style={{ borderTop: "1px solid var(--dolci-borde-light)" }}>
            <div className="text-right">
              <p style={{ fontSize: "0.8125rem", color: "var(--dolci-texto-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Total del pedido</p>
              <p style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--dolci-texto)", fontFamily: "Cormorant Garamond, serif" }}>
                {formatearMoneda(total)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Botones */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={enviando || !clienteId || !fechaEntrega || lineas.length === 0 || lineas.some((l) => !l.producto_id)}
          className="btn-primary"
        >
          {enviando ? "Guardando..." : "Crear Pedido"}
        </button>
        <a href="/pedidos" className="btn-secondary">Cancelar</a>
      </div>
    </div>
  );
}