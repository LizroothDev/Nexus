import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  leerCarrito,
  cambiarCantidad,
  quitarDelCarrito,
  vaciarCarrito,
  calcularTotales,
  precioUnitario,
} from "../store/carrito";
import ImagenProducto from "../components/ImagenProducto";
import Toast from "../components/Toast";

const label = "font-mono text-xs uppercase tracking-widest text-trace";
const pesos = (n) =>
  n.toLocaleString("es-MX", { style: "currency", currency: "MXN" });

export default function Carrito() {
  const [items, setItems] = useState([]);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    setItems(leerCarrito());
  }, []);

  const { subtotal, iva, total } = calcularTotales(items);

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-6xl px-5 py-32 text-center">
        <p className={label}>Carrito</p>
        <h1 className="mt-3 font-display text-3xl font-extrabold">
          Tu carrito está vacío
        </h1>
        <p className="mt-2 text-trace">Agrega componentes desde el catálogo.</p>
        <Link
          to="/catalogo"
          className="mt-6 inline-block rounded-sm bg-ink px-6 py-3 font-mono text-xs uppercase tracking-wider text-board hover:bg-ink-soft"
        >
          Ver catálogo
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-5 pt-16 pb-24">
      <p className={label}>Carrito</p>
      <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight">
        Tu pedido
      </h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        {/* Lista */}
        <div className="grid gap-4">
          {items.map((item) => {
            const unitario = precioUnitario(item);
            const enMayoreo = item.cantidad >= item.minMayoreo;
            const faltan = item.minMayoreo - item.cantidad;

            return (
              <article
                key={item.id}
                className="flex gap-4 rounded-sm border border-ink/15 bg-white p-4"
              >
                <ImagenProducto
                  categoria={item.categoria}
                  className="hidden h-24 w-32 shrink-0 rounded-sm sm:block"
                />

                <div className="flex flex-1 flex-col">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-display text-lg font-bold leading-tight">
                        {item.nombre}
                      </p>
                      <p className="font-mono text-xs text-trace">
                        {item.categoria}
                      </p>
                    </div>
                    <button
                      onClick={() => setItems(quitarDelCarrito(item.id))}
                      className="font-mono text-xs uppercase tracking-wider text-trace hover:text-band-red"
                    >
                      Quitar
                    </button>
                  </div>

                  {enMayoreo ? (
                    <p className="mt-2 self-start rounded-sm bg-band-green/10 px-2 py-1 font-mono text-xs text-band-green">
                      Precio de mayoreo aplicado
                    </p>
                  ) : (
                    <p className="mt-2 font-mono text-xs text-trace">
                      Agrega {faltan} pz más para precio de mayoreo (
                      {pesos(item.precioMayoreo)})
                    </p>
                  )}

                  <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setItems(cambiarCantidad(item.id, -1))}
                        className="h-8 w-8 rounded-sm border border-ink/20 font-mono hover:border-ink"
                        aria-label="Quitar una pieza"
                      >
                        −
                      </button>
                      <span className="w-12 text-center font-mono text-sm tabular-nums">
                        {item.cantidad}
                      </span>
                      <button
                        onClick={() => setItems(cambiarCantidad(item.id, 1))}
                        className="h-8 w-8 rounded-sm border border-ink/20 font-mono hover:border-ink"
                        aria-label="Agregar una pieza"
                      >
                        +
                      </button>
                    </div>

                    <p className="font-mono text-sm text-trace">
                      {pesos(unitario)} ×{" "}
                      <span className="font-display text-lg font-bold text-ink tabular-nums">
                        {pesos(unitario * item.cantidad)}
                      </span>
                    </p>
                  </div>
                </div>
              </article>
            );
          })}

          <button
            onClick={() => {
              setItems(vaciarCarrito());
              setToast(true);
            }}
            className="justify-self-start font-mono text-xs uppercase tracking-wider text-trace hover:text-band-red"
          >
            Vaciar carrito
          </button>
        </div>

        {/* Resumen */}
        <aside className="h-fit rounded-sm border border-ink/15 bg-white p-6 lg:sticky lg:top-24">
          <p className={label}>Resumen</p>

          <dl className="mt-4 grid gap-3 border-b border-ink/10 pb-4">
            <div className="flex justify-between text-sm">
              <dt className="text-trace">Subtotal</dt>
              <dd className="font-mono tabular-nums">{pesos(subtotal)}</dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-trace">IVA (16%)</dt>
              <dd className="font-mono tabular-nums">{pesos(iva)}</dd>
            </div>
          </dl>

          <div className="mt-4 flex items-baseline justify-between">
            <span className="font-mono text-xs uppercase tracking-widest text-trace">
              Total
            </span>
            <span className="font-display text-3xl font-extrabold tabular-nums">
              {pesos(total)}
            </span>
          </div>

          <button
            onClick={() => setToast(true)}
            className="mt-6 w-full rounded-sm bg-ink px-6 py-3.5 font-mono text-xs uppercase tracking-wider text-board hover:bg-ink-soft"
          >
            Ir a checkout
          </button>
          <p className="mt-3 text-center font-mono text-xs text-trace">
            Checkout disponible en Bloque 4
          </p>
        </aside>
      </div>

      <Toast
        mensaje="Acción simulada"
        visible={toast}
        onCerrar={() => setToast(false)}
      />
    </section>
  );
}