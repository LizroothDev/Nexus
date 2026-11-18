import { useState, useEffect } from "react";
import { etapas, etapaActual } from "../store/pedidos";

const label = "font-mono text-xs uppercase tracking-widest text-trace";

export default function Rastreo({ pedido, compacto = false }) {
  const [indice, setIndice] = useState(() => etapaActual(pedido));

  useEffect(() => {
    const id = setInterval(() => setIndice(etapaActual(pedido)), 2000);
    return () => clearInterval(id);
  }, [pedido]);

  const entregado = indice === etapas.length - 1;

  if (compacto) {
    return (
      <div className="mt-4">
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-xs">
            <span className={entregado ? "text-band-green" : "text-band-violet"}>
              ● {etapas[indice].nombre}
            </span>
          </p>
          <p className="font-mono text-xs text-trace">
            {indice + 1} de {etapas.length}
          </p>
        </div>
        <div className="mt-2 flex gap-1">
          {etapas.map((e, i) => (
            <span
              key={e.id}
              className={`h-1.5 flex-1 rounded-sm transition-colors ${
                i <= indice
                  ? entregado
                    ? "bg-band-green"
                    : "bg-band-violet"
                  : "bg-ink/10"
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  const base = new Date(pedido.fecha).getTime();

  return (
    <div className="rounded-sm border border-ink/15 bg-white p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className={label}>Rastreo</p>
          <h2 className="mt-2 font-display text-2xl font-extrabold">
            {etapas[indice].nombre}
          </h2>
          <p className="mt-1 text-sm text-trace">{etapas[indice].detalle}</p>
        </div>
        <p className="font-mono text-xs text-trace">
          Guía NX{pedido.folio.replace("NX-", "")}MX
        </p>
      </div>

      <ol className="mt-8 grid gap-0">
        {etapas.map((e, i) => {
          const hecho = i < indice;
          const activo = i === indice;
          const momento = new Date(base + i * 20000);

          return (
            <li key={e.id} className="flex gap-4">
              {/* Línea y punto */}
              <div className="flex flex-col items-center">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-xs transition-colors ${
                    hecho
                      ? "bg-band-green text-board"
                      : activo
                        ? "bg-band-violet text-board"
                        : "border-2 border-ink/15 text-trace"
                  }`}
                >
                  {hecho ? "✓" : i + 1}
                </span>
                {i < etapas.length - 1 && (
                  <span
                    className={`w-0.5 flex-1 transition-colors ${
                      hecho ? "bg-band-green" : "bg-ink/10"
                    }`}
                  />
                )}
              </div>

              {/* Texto */}
              <div className={`pb-7 ${activo ? "" : "opacity-60"}`}>
                <p
                  className={`font-display text-lg font-bold leading-tight ${
                    activo ? "text-ink" : ""
                  }`}
                >
                  {e.nombre}
                </p>
                <p className="mt-0.5 text-sm text-trace">{e.detalle}</p>
                {(hecho || activo) && (
                  <p className="mt-1 font-mono text-xs text-trace">
                    {momento.toLocaleDateString("es-MX", {
                      day: "numeric",
                      month: "short",
                    })}{" "}
                    ·{" "}
                    {momento.toLocaleTimeString("es-MX", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      <p className="font-mono text-xs italic text-trace">
        Seguimiento simulado: el pedido avanza una etapa cada 20 segundos.
      </p>
    </div>
  );
}