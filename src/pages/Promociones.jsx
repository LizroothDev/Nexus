import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { cupones } from "../data/cupones";
import { leerCuponActivo, activarCupon, quitarCupon } from "../store/cupon";
import Toast from "../components/Toast";

const label = "font-mono text-xs uppercase tracking-widest text-trace";

const promos = [
  {
    titulo: "2×1 en sensores infrarrojos",
    texto: "Llévate dos módulos seguidores de línea al precio de uno. Hasta agotar existencias.",
    color: "bg-band-red",
    vigencia: "Hasta el 31 de octubre",
  },
  {
    titulo: "Envío sin costo en el Bajío",
    texto: "Pedidos mayores a $800 con entrega gratuita en Aguascalientes, León y Querétaro.",
    color: "bg-band-violet",
    vigencia: "Permanente",
  },
  {
    titulo: "Kit de robótica a $549",
    texto: "Diez componentes compatibles entre sí con 38% de descuento sobre el precio suelto.",
    color: "bg-band-gold",
    vigencia: "Campaña de regreso a clases",
    enlace: "/campana",
  },
];

export default function Promociones() {
  const [codigo, setCodigo] = useState("");
  const [activo, setActivo] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    setActivo(leerCuponActivo());
  }, []);

  function aplicar(cupon) {
    activarCupon(cupon);
    setActivo(cupon);
    setCodigo("");
    setToast(`Cupón ${cupon.codigo} aplicado (simulado)`);
  }

  function enviar(e) {
    e.preventDefault();
    const limpio = codigo.trim().toUpperCase();
    const encontrado = cupones.find((c) => c.codigo === limpio);

    if (encontrado) {
      aplicar(encontrado);
    } else {
      setToast("Ese código no existe");
    }
  }

  function retirar() {
    quitarCupon();
    setActivo(null);
    setToast("Cupón retirado");
  }

  return (
    <section className="mx-auto max-w-6xl px-5 pt-16 pb-24">
      <p className={label}>Promociones</p>
      <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
        Descuentos activos
      </h1>
      <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink/70">
        Aplica un cupón y el descuento se refleja en el total de tu carrito.
      </p>

      {/* Cupón activo */}
      {activo && (
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-sm bg-band-green px-5 py-4 text-board">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-board/70">
              Cupón activo
            </p>
            <p className="mt-1 font-display text-xl font-extrabold">
              {activo.codigo} · {activo.descripcion}
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/carrito"
              className="rounded-sm bg-board px-4 py-2 font-mono text-xs uppercase tracking-wider text-ink hover:opacity-90"
            >
              Ver carrito
            </Link>
            <button
              onClick={retirar}
              className="rounded-sm border border-board/40 px-4 py-2 font-mono text-xs uppercase tracking-wider hover:border-board"
            >
              Quitar
            </button>
          </div>
        </div>
      )}

      {/* Capturar código */}
      <form
        onSubmit={enviar}
        className="mt-8 flex flex-wrap gap-3 rounded-sm border border-ink/15 bg-white p-5"
      >
        <div className="min-w-56 flex-1">
          <label htmlFor="codigo" className={label}>
            ¿Tienes un código?
          </label>
          <input
            id="codigo"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="MAKER10"
            className="mt-1 w-full rounded-sm border border-ink/20 px-3 py-2.5 font-mono text-sm uppercase outline-none focus:border-ink"
          />
        </div>
        <button
          type="submit"
          className="self-end rounded-sm bg-ink px-6 py-2.5 font-mono text-xs uppercase tracking-wider text-board hover:bg-ink-soft"
        >
          Aplicar
        </button>
      </form>

      {/* Cupones disponibles */}
      <p className={`${label} mt-14`}>Cupones vigentes</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {cupones.map((c) => {
          const esActivo = activo?.codigo === c.codigo;
          return (
            <article
              key={c.codigo}
              className={`rounded-sm border bg-white p-5 transition-colors ${
                esActivo ? "border-band-green" : "border-ink/15"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-lg font-semibold tracking-wider">
                    {c.codigo}
                  </p>
                  <p className="mt-1 font-display text-xl font-bold leading-tight">
                    {c.descripcion}
                  </p>
                </div>
                <span className="shrink-0 font-display text-3xl font-extrabold text-band-red tabular-nums">
                  {c.tipo === "porcentaje" ? `${c.valor}%` : `$${c.valor}`}
                </span>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-ink/70">
                {c.detalle}
              </p>

              <p className="mt-3 font-mono text-xs text-trace">
                {c.minimo > 0 ? `Compra mínima: $${c.minimo}` : "Sin compra mínima"}
              </p>

              <button
                onClick={() => aplicar(c)}
                disabled={esActivo}
                className="mt-4 w-full rounded-sm bg-ink px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-board transition-colors hover:bg-ink-soft disabled:cursor-not-allowed disabled:bg-band-green"
              >
                {esActivo ? "Aplicado" : "Aplicar cupón"}
              </button>
            </article>
          );
        })}
      </div>

      {/* Promos visuales */}
      <p className={`${label} mt-16`}>Otras promociones</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {promos.map((p) => (
          <article
            key={p.titulo}
            className="overflow-hidden rounded-sm border border-ink/15 bg-white"
          >
            <div className={`h-1.5 w-full ${p.color}`} />
            <div className="p-5">
              <h2 className="font-display text-xl font-bold leading-tight">
                {p.titulo}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{p.texto}</p>
              <p className="mt-4 font-mono text-xs text-trace">{p.vigencia}</p>
              {p.enlace && (
                <Link
                  to={p.enlace}
                  className="mt-4 inline-block font-mono text-xs uppercase tracking-wider text-ink underline hover:text-band-red"
                >
                  Ver campaña →
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>

      <Toast mensaje={toast} visible={!!toast} onCerrar={() => setToast("")} />
    </section>
  );
}