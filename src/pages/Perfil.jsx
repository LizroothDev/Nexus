import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { leerSesion, cerrarSesion } from "../store/sesion";

const label = "font-mono text-xs uppercase tracking-widest text-trace";

export default function Perfil() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const sesion = leerSesion();
    if (!sesion) {
      navigate("/login");
      return;
    }
    setUsuario(sesion);
  }, [navigate]);

  function salir() {
    cerrarSesion();
    navigate("/");
  }

  if (!usuario) return null;

  const esEmpresa = usuario.tipo === "empresa";

  return (
    <section className="mx-auto max-w-4xl px-5 pt-16 pb-24">
      <p className={label}>Mi cuenta</p>

      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-4xl font-extrabold tracking-tight">
          {usuario.nombre}
        </h1>
        <span
          className={`rounded-sm px-3 py-1 font-mono text-xs uppercase tracking-wider ${
            esEmpresa
              ? "bg-band-violet text-board"
              : "bg-band-green text-board"
          }`}
        >
          {esEmpresa ? "Cuenta mayoreo" : "Cuenta menudeo"}
        </span>
      </div>

      {/* Mis datos */}
      <div className="mt-10">
        <p className={label}>Mis datos</p>
        <dl className="mt-4 divide-y divide-ink/10 border-y border-ink/10">
          <div className="flex justify-between gap-4 py-3">
            <dt className="text-sm text-trace">Nombre</dt>
            <dd className="text-sm font-medium">{usuario.nombre}</dd>
          </div>
          <div className="flex justify-between gap-4 py-3">
            <dt className="text-sm text-trace">Correo</dt>
            <dd className="font-mono text-sm">{usuario.correo}</dd>
          </div>
          <div className="flex justify-between gap-4 py-3">
            <dt className="text-sm text-trace">Tipo de cuenta</dt>
            <dd className="text-sm font-medium">
              {esEmpresa ? "Empresa / Mayoreo" : "Estudiante / Maker"}
            </dd>
          </div>
          {esEmpresa && usuario.empresa && (
            <div className="flex justify-between gap-4 py-3">
              <dt className="text-sm text-trace">Razón social</dt>
              <dd className="text-sm font-medium">{usuario.empresa}</dd>
            </div>
          )}
          {esEmpresa && usuario.rfc && (
            <div className="flex justify-between gap-4 py-3">
              <dt className="text-sm text-trace">RFC</dt>
              <dd className="font-mono text-sm uppercase">{usuario.rfc}</dd>
            </div>
          )}
        </dl>
      </div>

      {/* Estado de cuenta */}
      <div className="mt-12 grid gap-px bg-ink/10 sm:grid-cols-3">
        <div className="bg-white p-5">
          <p className={label}>Pedidos</p>
          <p className="mt-2 font-display text-3xl font-extrabold tabular-nums">0</p>
        </div>
        <div className="bg-white p-5">
          <p className={label}>Crédito disponible</p>
          <p className="mt-2 font-display text-3xl font-extrabold tabular-nums">
            {esEmpresa ? "$25,000" : "—"}
          </p>
        </div>
        <div className="bg-white p-5">
          <p className={label}>Descuento activo</p>
          <p className="mt-2 font-display text-3xl font-extrabold tabular-nums">
            {esEmpresa ? "12%" : "0%"}
          </p>
        </div>
      </div>

      {/* Mis compras */}
      <div className="mt-12">
        <p className={label}>Mis compras</p>
        <div className="mt-4 rounded-sm border border-dashed border-ink/25 bg-white p-8 text-center">
          <p className="font-display text-lg font-bold">Todavía no hay pedidos</p>
          <p className="mt-1 text-sm text-trace">
            El historial de compras se activa en el Bloque 4.
          </p>
          <Link
            to="/catalogo"
            className="mt-4 inline-block rounded-sm bg-ink px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-board hover:bg-ink-soft"
          >
            Ver catálogo
          </Link>
        </div>
      </div>

      <button
        onClick={salir}
        className="mt-12 rounded-sm border border-band-red px-6 py-3 font-mono text-xs uppercase tracking-wider text-band-red transition-colors hover:bg-band-red hover:text-board"
      >
        Cerrar sesión
      </button>
    </section>
  );
}