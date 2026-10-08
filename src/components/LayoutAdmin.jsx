import { NavLink, Outlet, Link } from "react-router-dom";

const secciones = [
  { to: "/admin", label: "Resumen", exacto: true },
  { to: "/admin/productos", label: "Productos" },
];

const proximas = [
  { label: "Pedidos", bloque: "Bloque 4" },
  { label: "Promociones", bloque: "Bloque 3" },
];

export default function LayoutAdmin() {
  const estilo = ({ isActive }) =>
    `block rounded-sm px-3 py-2 font-mono text-xs uppercase tracking-wider transition-colors ${
      isActive ? "bg-ink text-board" : "text-trace hover:bg-ink/5 hover:text-ink"
    }`;

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-5 pt-10 pb-24 lg:grid-cols-[200px_1fr]">
      <aside className="lg:sticky lg:top-24 lg:h-fit">
        <p className="font-mono text-xs uppercase tracking-widest text-trace">
          Administración
        </p>

        <nav className="mt-4 grid gap-1">
          {secciones.map((s) => (
            <NavLink key={s.to} to={s.to} end={s.exacto} className={estilo}>
              {s.label}
            </NavLink>
          ))}

          {proximas.map((p) => (
            <span
              key={p.label}
              className="flex items-center justify-between rounded-sm px-3 py-2 font-mono text-xs uppercase tracking-wider text-trace/50"
            >
              {p.label}
              <span className="text-[10px]">{p.bloque}</span>
            </span>
          ))}
        </nav>

        <Link
          to="/catalogo"
          className="mt-6 block font-mono text-xs uppercase tracking-wider text-trace hover:text-ink"
        >
          ← Ver tienda
        </Link>
      </aside>

      <div className="min-w-0">
        <Outlet />
      </div>
    </div>
  );
}