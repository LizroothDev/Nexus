import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { productos } from "../data/productos";
import ImagenProducto from "../components/ImagenProducto";
import Toast from "../components/Toast";

const label = "font-mono text-xs uppercase tracking-widest text-trace";

export default function DetalleProducto() {
  const { id } = useParams();
  const producto = productos.find((p) => p.id === id);

  const [modo, setModo] = useState("menudeo");
  const [toast, setToast] = useState(false);

  if (!producto) {
    return (
      <section className="mx-auto max-w-6xl px-5 py-32 text-center">
        <h1 className="font-display text-3xl font-extrabold">
          No encontramos esa clave
        </h1>
        <Link
          to="/catalogo"
          className="mt-6 inline-block rounded-sm bg-ink px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-board"
        >
          Regresar al catálogo
        </Link>
      </section>
    );
  }

  const esMayoreo = modo === "mayoreo";
  const precio = esMayoreo ? producto.precioMayoreo : producto.precio;
  const ahorro = Math.round(
    ((producto.precio - producto.precioMayoreo) / producto.precio) * 100
  );

  const relacionados = productos
    .filter((p) => p.categoria === producto.categoria && p.id !== producto.id)
    .slice(0, 3);

  return (
    <section className="mx-auto max-w-6xl px-5 pt-10 pb-24">
      <Link
        to="/catalogo"
        className="font-mono text-xs uppercase tracking-widest text-trace hover:text-ink"
      >
        ← Regresar al catálogo
      </Link>

      <div className="mt-8 grid gap-12 lg:grid-cols-2">
        {/* Imagen */}
        <ImagenProducto
          categoria={producto.categoria}
          className="aspect-[10/7] rounded-sm"
        />

        {/* Información */}
        <div>
          <p className={label}>{producto.categoria}</p>
          <h1 className="mt-2 font-display text-4xl font-extrabold leading-tight tracking-tight">
            {producto.nombre}
          </h1>
          <p className="mt-4 leading-relaxed text-ink/70">
            {producto.descripcion}
          </p>

          {/* Selector menudeo / mayoreo */}
          <div className="mt-8 grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setModo("menudeo")}
              className={`rounded-sm border p-4 text-left transition-colors ${
                !esMayoreo
                  ? "border-ink bg-ink text-board"
                  : "border-ink/20 bg-white hover:border-ink/50"
              }`}
            >
              <span className="font-mono text-xs uppercase tracking-wider">
                Menudeo
              </span>
              <span className="mt-1 block font-display text-2xl font-extrabold tabular-nums">
                ${producto.precio}
              </span>
              <span
                className={`text-xs ${!esMayoreo ? "text-board/60" : "text-trace"}`}
              >
                1 a {producto.minMayoreo - 1} piezas
              </span>
            </button>

            <button
              type="button"
              onClick={() => setModo("mayoreo")}
              className={`rounded-sm border p-4 text-left transition-colors ${
                esMayoreo
                  ? "border-ink bg-ink text-board"
                  : "border-ink/20 bg-white hover:border-ink/50"
              }`}
            >
              <span className="font-mono text-xs uppercase tracking-wider">
                Mayoreo · −{ahorro}%
              </span>
              <span className="mt-1 block font-display text-2xl font-extrabold tabular-nums">
                ${producto.precioMayoreo}
              </span>
              <span
                className={`text-xs ${esMayoreo ? "text-board/60" : "text-trace"}`}
              >
                Desde {producto.minMayoreo} piezas
              </span>
            </button>
          </div>

          <p className="mt-4 font-mono text-sm text-trace">
            Precio seleccionado:{" "}
            <span className="font-semibold text-ink">${precio}</span> por pieza ·{" "}
            {producto.stock} en existencia
          </p>

          <button
            onClick={() => setToast(true)}
            className="mt-6 w-full rounded-sm bg-ink px-6 py-3.5 font-mono text-xs uppercase tracking-wider text-board transition-colors hover:bg-ink-soft sm:w-auto"
          >
            Agregar al carrito
          </button>
        </div>
      </div>

      {/* Ficha técnica */}
      <div className="mt-20">
        <p className={label}>Ficha técnica</p>
        <h2 className="mt-2 font-display text-2xl font-extrabold">
          Datasheet resumido
        </h2>
        <dl className="mt-6 grid gap-px bg-ink/10 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(producto.ficha).map(([clave, valor]) => (
            <div key={clave} className="bg-white p-4">
              <dt className="font-mono text-xs uppercase tracking-widest text-trace">
                {clave}
              </dt>
              <dd className="mt-1 text-sm font-medium">{valor}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Relacionados */}
      {relacionados.length > 0 && (
        <div className="mt-20">
          <p className={label}>También en {producto.categoria}</p>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {relacionados.map((r) => (
              <Link
                key={r.id}
                to={`/producto/${r.id}`}
                className="overflow-hidden rounded-sm border border-ink/15 bg-white transition-colors hover:border-ink"
              >
                <ImagenProducto categoria={r.categoria} className="aspect-[10/7]" />
                <div className="p-4">
                  <p className="font-display text-lg font-bold leading-tight">
                    {r.nombre}
                  </p>
                  <p className="mt-1 font-mono text-sm text-trace">${r.precio}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <Toast
        mensaje="Función disponible en Bloque 2"
        visible={toast}
        onCerrar={() => setToast(false)}
      />
    </section>
  );
}