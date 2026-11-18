import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { leerSesion, cerrarSesion } from "../store/sesion";
import { leerPedidos } from "../store/pedidos";

const label = "font-mono text-xs uppercase tracking-widest text-trace";
const pesos = (n) =>
  n.toLocaleString("es-MX", { style: "currency", currency: "MXN" });

export default function Perfil() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const sesion = leerSesion();
    if (!sesion) {
      navigate("/login");
      return;
    }
    setUsuario(sesion);
    setPedidos(leerPedidos());
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
            esEmpresa ? "bg-band-violet text-board" : "bg-band-green text-board"
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
          <p className="mt-2 font-display text-3xl font-extrabold tabular-nums">
            {pedidos.length}
          </p>
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

        {pedidos.length === 0 ? (
          <div className="mt-4 rounded-sm border border-dashed border-ink/25 bg-white p-8 text-center">
            <p className="font-display text-lg font-bold">Todavía no hay pedidos</p>
            <p className="mt-1 text-sm text-trace">
              Tus compras van a aparecer aquí con su comprobante.
            </p>
            <Link
              to="/catalogo"
              className="mt-4 inline-block rounded-sm bg-ink px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-board hover:bg-ink-soft"
            >
              Ver catálogo
            </Link>
          </div>
        ) : (
          <ul className="mt-4 grid gap-4">
            {pedidos.map((p) => (
              <li key={p.folio} className="rounded-sm border border-ink/15 bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-xl font-extrabold">{p.folio}</p>
                    <p className="font-mono text-xs text-trace">
                      {new Date(p.fecha).toLocaleDateString("es-MX", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}{" "}
                      · {p.items.length} {p.items.length === 1 ? "clave" : "claves"}
                    </p>
                  </div>
                  <span className="rounded-sm bg-band-green/10 px-2 py-1 font-mono text-xs text-band-green">
                    {p.estado}
                  </span>
                </div>

                <ul className="mt-4 divide-y divide-ink/10 border-y border-ink/10">
                  {p.items.slice(0, 3).map((i) => (
                    <li key={i.id} className="flex justify-between gap-4 py-2 text-sm">
                      <span>
                        {i.nombre}{" "}
                        <span className="font-mono text-xs text-trace">
                          ×{i.cantidad}
                        </span>
                      </span>
                      <span className="font-mono tabular-nums text-trace">
                        {pesos(i.unitario * i.cantidad)}
                      </span>
                    </li>
                  ))}
                  {p.items.length > 3 && (
                    <li className="py-2 font-mono text-xs text-trace">
                      y {p.items.length - 3} más
                    </li>
                  )}
                </ul>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="font-mono text-sm text-trace">
                    Total{" "}
                    <span className="font-display text-xl font-bold text-ink tabular-nums">
                      {pesos(p.total)}
                    </span>
                  </p>
                  <Link
                    to={`/factura/${p.folio}`}
                    className="rounded-sm border border-ink/25 px-5 py-2 font-mono text-xs uppercase tracking-wider hover:border-ink"
                  >
                    {p.factura ? "Ver factura" : "Ver ticket"}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Acceso administrativo */}
      <div className="mt-12 rounded-sm border border-band-violet/30 bg-band-violet/5 p-5">
        <p className={label}>Acceso administrativo</p>
        <p className="mt-2 text-sm text-ink/70">
          Panel de control del negocio con métricas y gestión de catálogo.
        </p>
        <Link
          to="/admin"
          className="mt-4 inline-block rounded-sm bg-band-violet px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-board hover:opacity-90"
        >
          Abrir panel admin
        </Link>
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