"use client";

import { crearCliente } from "./actions";
import { useState } from "react";
import { Modal } from "@/components/ui/modal";

export function CrearClienteForm() {
  const [abierto, setAbierto] = useState(false);

  return (
    <>
      <button onClick={() => setAbierto(true)} className="btn-primary">
        + Nuevo Cliente
      </button>

      <Modal abierto={abierto} onCerrar={() => setAbierto(false)} titulo="Nuevo Cliente">
        <form action={crearCliente} className="space-y-4">
          <div>
            <label htmlFor="nombre" className="block mb-1">Nombre *</label>
            <input id="nombre" name="nombre" type="text" required placeholder="Nombre del cliente" />
          </div>

          <div>
            <label htmlFor="telefono" className="block mb-1">Teléfono</label>
            <input id="telefono" name="telefono" type="tel" placeholder="(opcional)" />
          </div>

          <div>
            <label htmlFor="notas" className="block mb-1">Notas</label>
            <textarea id="notas" name="notas" rows={2} placeholder="Alergias, preferencias, dirección..." />
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