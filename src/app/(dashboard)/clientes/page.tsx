import { obtenerClientes } from "./actions";
import { formatearFecha } from "@/lib/utils";
import { EliminarClienteBoton } from "./eliminar-boton";
import { CrearClienteForm } from "./crear-form";
import Link from "next/link";

export default async function ClientesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const clientes = await obtenerClientes();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 600 }}>Clientes</h1>
          <p style={{ color: "var(--dolci-texto-muted)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
            {clientes.length} {clientes.length === 1 ? "cliente registrado" : "clientes registrados"}
          </p>
        </div>
        <CrearClienteForm />
      </div>

      {params.error && <div className="alert-error mb-6">{params.error}</div>}

      {clientes.length === 0 ? (
        <div className="card text-center" style={{ padding: "3rem" }}>
          <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>👥</p>
          <p style={{ color: "var(--dolci-texto-muted)" }}>No hay clientes registrados todavía.</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Teléfono</th>
                <th>Notas</th>
                <th>Registrado</th>
                <th style={{ textAlign: "right" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.id}>
                  <td style={{ fontWeight: 500 }}>{cliente.nombre}</td>
                  <td style={{ color: "var(--dolci-texto-light)" }}>{cliente.telefono || "—"}</td>
                  <td style={{ color: "var(--dolci-texto-light)", maxWidth: "200px" }} className="truncate">
                    {cliente.notas || "—"}
                  </td>
                  <td style={{ color: "var(--dolci-texto-muted)", fontSize: "0.8125rem" }}>
                    {formatearFecha(cliente.created_at)}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/clientes/${cliente.id}/editar`} className="link-primary">Editar</Link>
                      <EliminarClienteBoton id={cliente.id} nombre={cliente.nombre} />
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