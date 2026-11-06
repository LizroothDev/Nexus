import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { leerSubastas, ofertar, ofertaMayor, reiniciarSubastas } from "../store/subastas";
import { leerSesion } from "../store/sesion";
import ImagenProducto from "../components/ImagenProducto";
import Toast from "../components/Toast";

const label = "font-mono text-xs uppercase tracking-widest text-trace";
const pesos = (n) =>
  n.toLocaleString("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });

function restante(cierra, ahora) {
  const falta = cierra - ahora;
  if (falta <= 0) return null;
  const h = Math.floor(falta / 3600000);
  const m = Math.floor(falta / 60000) % 60;
  const s = Math.floor(falta / 1000) % 60;
  return `${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
}

export default function Subastas() {
  const [lotes, setLotes] = useState([]);
  const [montos, setMontos] = useState({});
  const [ahora, setAhora] = useState(Date.now());
  const [toast, setToast] = useState("");

  useEffect(() => {
    setLotes(leerSubastas());
    const id = setInterval(() => setAhora(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  function pujar(e, lote) {
    e.preventDefault();
    const mayor = ofertaMayor(lote);
    const monto = Number(montos[lote.id]) || Math.round(mayor * 1.05);

    if (monto <= mayor) {
      setToast(`Tu oferta debe superar ${pesos(mayor)}`);
      return;
    }

    const sesion = leerSesion();
    setLotes(ofertar(lote.id, sesion?.nombre || "Tú", monto));
    setMontos({ ...montos, [lote.id]: "" });
    setToast("Oferta registrada (simulado)");
  }

  return (
    <section className="mx-auto max-w-5xl px-5 pt-16 pb-24">
      <p className={label}>Subastas</p>
      <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
        Remates de inventario
      </h1>
      <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink/70">
        Lotes de laboratorios y talleres que liberan existencias. La oferta más
        alta al cierre se lleva el lote completo.
      </p>

      <div className="mt-12 grid gap-8">
        {lotes.map((lote) => {
          const mayor = ofertaMayor(lote);
          const tiempo = restante(lote.cierra, ahora);
          const cerrada = tiempo === null;
          const ahorro = Math.round((1 - mayor / lote.valorMercado) * 100);
          const sugerido = Math.round(mayor * 1.05);

          return (
            <article
              key={lote.id}
              className="overflow-hidden rounded-sm border border-ink/15 bg-white"
            >
              <div className="grid gap-6 p-6 sm:grid-cols-[160px_1fr]">
                <ImagenProducto
                  categoria={lote.categoria}
                  className="hidden aspect-[10/7] rounded-sm sm:block"
                />

                <div>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="font-display text-2xl font-extrabold leading-tight">
                        {lote.titulo}
                      </h2>
                      <p className="mt-1 font-mono text-xs text-trace">
                        {lote.piezas} piezas · {lote.vendedor}
                      </p>
                    </div>

                    <div
                      className={`rounded-sm px-3 py-2 text-right ${
                        cerrada ? "bg-ink/5" : "bg-band-red/10"
                      }`}
                    >
                      <p className={label}>{cerrada ? "Cerrada" : "Cierra en"}</p>
                      <p
                        className={`mt-0.5 font-display text-lg font-extrabold tabular-nums ${
                          cerrada ? "text-trace" : "text-band-red"
                        }`}
                      >
                        {cerrada ? "—" : tiempo}
                      </p>
                    </div>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-ink/70">
                    {lote.descripcion}
                  </p>

                  <div className="mt-5 flex flex-wrap items-end gap-6 border-t border-ink/10 pt-4">
                    <div>
                      <p className={label}>Oferta actual</p>
                      <p className="mt-1 font-display text-3xl font-extrabold tabular-nums">
                        {pesos(mayor)}
                      </p>
                    </div>
                    <div>
                      <p className={label}>Valor de mercado</p>
                      <p className="mt-1 font-mono text-sm text-trace line-through">
                        {pesos(lote.valorMercado)}
                      </p>
                      <p className="font-mono text-xs text-band-green">
                        {ahorro}% abajo
                      </p>
                    </div>
                  </div>

                  {/* Formulario de oferta */}
                  {!cerrada && (
                    <form onSubmit={(e) => pujar(e, lote)} className="mt-5 flex flex-wrap gap-3">
                      <div className="min-w-40 flex-1">
                        <label htmlFor={`oferta-${lote.id}`} className={label}>
                          Tu oferta
                        </label>
                        <input
                          id={`oferta-${lote.id}`}
                          type="number"
                          value={montos[lote.id] ?? ""}
                          onChange={(e) =>
                            setMontos({ ...montos, [lote.id]: e.target.value })
                          }
                          placeholder={String(sugerido)}
                          className="mt-1 w-full rounded-sm border border-ink/20 px-3 py-2.5 font-mono text-sm outline-none focus:border-ink"
                        />
                      </div>
                      <button
                        type="submit"
                        className="self-end rounded-sm bg-ink px-6 py-2.5 font-mono text-xs uppercase tracking-wider text-board hover:bg-ink-soft"
                      >
                        Ofertar
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* Historial de ofertas */}
              <div className="border-t border-ink/10 bg-board/50 px-6 py-4">
                <p className={label}>Últimas ofertas</p>
                <ul className="mt-3 grid gap-2">
                  {lote.ofertas.slice(0, 4).map((o, i) => (
                    <li
                      key={`${o.autor}-${o.monto}-${i}`}
                      className="flex items-baseline justify-between gap-3 font-mono text-sm"
                    >
                      <span className={i === 0 ? "font-semibold text-ink" : "text-trace"}>
                        {o.autor}
                      </span>
                      <span className="flex items-baseline gap-3">
                        <span className="text-xs text-trace">{o.hace}</span>
                        <span className="tabular-nums">{pesos(o.monto)}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/publicar"
          className="font-mono text-xs uppercase tracking-wider text-trace hover:text-ink"
        >
          ← Publicar un componente
        </Link>
        <button
          onClick={() => {
            setLotes(reiniciarSubastas());
            setToast("Subastas reiniciadas");
          }}
          className="font-mono text-xs uppercase tracking-wider text-trace hover:text-ink"
        >
          Reiniciar subastas
        </button>
      </div>

      <Toast mensaje={toast} visible={!!toast} onCerrar={() => setToast("")} />
    </section>
  );
}