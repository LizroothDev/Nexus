import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { categorias } from "../data/productos";
import { leerProductos } from "../store/catalogo";
import ImagenProducto from "../components/ImagenProducto";

const label = "font-mono text-xs uppercase tracking-widest text-trace";
const TOPE = 300;

export default function Catalogo() {
  const [productos, setProductos] = useState(leerProductos);
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("Todas");
  const [precioMax, setPrecioMax] = useState(TOPE);

  useEffect(() => {
    const actualizar = () => setProductos(leerProductos());
    window.addEventListener("catalogo-cambio", actualizar);
    return () => window.removeEventListener("catalogo-cambio", actualizar);
  }, []);

  const filtrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return productos.filter((p) => {
      const coincide =
        p.nombre.toLowerCase().includes(texto) ||
        p.resumen.toLowerCase().includes(texto);
      const enCategoria = categoria === "Todas" || p.categoria === categoria;
      const enPrecio = p.precio <= precioMax;
      return coincide && enCategoria && enPrecio;
    });
  }, [productos, busqueda, categoria, precioMax]);

  function limpiar() {
    setBusqueda("");
    setCategoria("Todas");
    setPrecioMax(TOPE);
  }

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

      {/* Controles */}
      <div className="mt-10 grid gap-5 rounded-sm border border-ink/15 bg-white p-5">
        <div>
          <label htmlFor="busqueda" className={label}>
            Buscar
          </label>
          <input
            id="busqueda"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="ESP32, sensor, resistencias..."
            className="mt-1 w-full rounded-sm border border-ink/20 px-3 py-2.5 text-sm outline-none focus:border-ink"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <p className={label}>Categoría</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {["Todas", ...categorias].map((c) => (
                <button
                  key={c}
                  onClick={() => setCategoria(c)}
                  className={`rounded-sm px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors ${
                    categoria === c
                      ? "bg-ink text-board"
                      : "border border-ink/20 hover:border-ink"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="precio" className={label}>
              Precio máximo: <span className="text-ink">${precioMax}</span>
            </label>
            <input
              id="precio"
              type="range"
              min="30"
              max={TOPE}
              step="5"
              value={precioMax}
              onChange={(e) => setPrecioMax(Number(e.target.value))}
              className="mt-3 w-full accent-band-red"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="font-mono text-sm text-trace">
          {filtrados.length} de {productos.length} claves
        </p>
        <button
          onClick={limpiar}
          className="font-mono text-xs uppercase tracking-wider text-trace hover:text-ink"
        >
          Limpiar filtros
        </button>
      </div>

      {/* Resultados */}
      {filtrados.length === 0 ? (
        <div className="mt-10 rounded-sm border border-dashed border-ink/25 bg-white p-12 text-center">
          <p className="font-display text-lg font-bold">Ninguna clave coincide</p>
          <p className="mt-1 text-sm text-trace">
            Prueba con otro término o amplía el rango de precio.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtrados.map((p) => (
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

                <p className="mt-2 self-start rounded-sm bg-band-green/10 px-2 py-1 font-mono text-xs text-band-green">
                  Mayoreo desde {p.minMayoreo} pz · ${p.precioMayoreo}
                </p>

                <Link
                  to={`/producto/${p.id}`}
                  className="mt-5 rounded-sm bg-ink px-4 py-2.5 text-center font-mono text-xs uppercase tracking-wider text-board hover:bg-ink-soft"
                >
                  Ver detalle
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}