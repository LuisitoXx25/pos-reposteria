import Link from "next/link";
import { obtenerProductos } from "./actions";
import { formatearMoneda, formatearFecha } from "@/lib/utils";
import { CrearProductoForm } from "./crear-form";
import { ToggleActivoBoton } from "./toggle-activo-boton";

export default async function ProductosPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const productos = await obtenerProductos();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 600 }}>Productos</h1>
          <p style={{ color: "var(--dolci-texto-muted)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
            {productos.length} {productos.length === 1 ? "producto registrado" : "productos registrados"}
          </p>
        </div>
        <CrearProductoForm />
      </div>

      {params.error && <div className="alert-error mb-6">{params.error}</div>}

      {productos.length === 0 ? (
        <div className="card text-center" style={{ padding: "3rem" }}>
          <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🧁</p>
          <p style={{ color: "var(--dolci-texto-muted)" }}>No hay productos registrados todavía.</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Estado</th>
                <th>Registrado</th>
                <th style={{ textAlign: "right" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.id} style={{ opacity: producto.activo ? 1 : 0.5 }}>
                  <td style={{ fontWeight: 500 }}>{producto.nombre}</td>
                  <td>{formatearMoneda(producto.precio)}</td>
                  <td>
                    <span className={`badge ${producto.activo ? "badge-activo" : "badge-inactivo"}`}>
                      {producto.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td style={{ color: "var(--dolci-texto-muted)", fontSize: "0.8125rem" }}>
                    {formatearFecha(producto.created_at)}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/productos/${producto.id}/editar`} className="link-primary">Editar</Link>
                      <ToggleActivoBoton id={producto.id} activo={producto.activo} nombre={producto.nombre} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}