import { Link } from "react-router-dom";
import { productos } from "../data/productos";
import ImagenProducto from "../components/ImagenProducto";

const label = "font-mono text-xs uppercase tracking-widest text-trace";

export default function Catalogo() {
  return (
    <section className="mx-auto max-w-6xl px-5 pt-16 pb-24">
      <p className={label}>Catálogo</p>
      <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
        {productos.length} claves en existencia local
      </h1>
      <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink/70">
        Precios en pesos, sin IVA. El descuento por volumen se aplica automático
        al llegar a la cantidad mínima de cada clave.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {productos.map((p) => (
          <article
            key={p.id}
            className="flex flex-col overflow-hidden rounded-sm border border-ink/15 bg-white"
          >
            <ImagenProducto categoria={p.categoria} className="aspect-[10/7]" />

            <div className="flex flex-1 flex-col p-5">
              <p className="font-mono text-xs uppercase tracking-widest text-trace">
                {p.categoria}
              </p>
              <h2 className="mt-1 font-display text-xl font-bold leading-tight">
                {p.nombre}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">
                {p.resumen}
              </p>

              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-display text-2xl font-extrabold tabular-nums">
                  ${p.precio}
                </span>
                <span className="font-mono text-xs text-trace">/ pieza</span>
              </div>

              <p className="mt-2 inline-block self-start rounded-sm bg-band-green/10 px-2 py-1 font-mono text-xs text-band-green">
                Mayoreo disponible desde {p.minMayoreo} pz
              </p>

              <Link
                to={`/producto/${p.id}`}
                className="mt-5 rounded-sm bg-ink px-4 py-2.5 text-center font-mono text-xs uppercase tracking-wider text-board transition-colors hover:bg-ink-soft"
              >
                Ver detalle
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}