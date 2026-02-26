"use client";

import { crearProducto } from "./actions";
import { useState } from "react";
import { Modal } from "@/components/ui/modal";

export function CrearProductoForm() {
  const [abierto, setAbierto] = useState(false);

  return (
    <>
      <button onClick={() => setAbierto(true)} className="btn-primary">
        + Nuevo Producto
      </button>

      <Modal abierto={abierto} onCerrar={() => setAbierto(false)} titulo="Nuevo Producto">
        <form action={crearProducto} className="space-y-4">
          <div>
            <label htmlFor="nombre" className="block mb-1">Nombre *</label>
            <input id="nombre" name="nombre" type="text" required placeholder="Ej: Pastel de chocolate" />
          </div>

          <div>
            <label htmlFor="precio" className="block mb-1">Precio (MXN) *</label>
            <input id="precio" name="precio" type="number" required min="0.01" step="0.01" placeholder="0.00" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1 justify-center">Guardar</button>
            <button type="button" onClick={() => setAbierto(false)} className="btn-secondary">Cancelar</button>
          </div>
        </form>
      </Modal>
    </>
  );
}