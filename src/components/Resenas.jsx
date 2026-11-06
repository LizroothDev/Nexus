import { useState, useEffect } from "react";
import { leerResenas, agregarResena } from "../store/resenas";
import { leerSesion } from "../store/sesion";
import Toast from "./Toast";

const label = "font-mono text-xs uppercase tracking-widest text-trace";
const input =
  "mt-1 w-full rounded-sm border border-ink/20 bg-white px-3 py-2.5 text-sm outline-none focus:border-ink";

function Estrellas({ cantidad }) {
  return (
    <span className="font-mono text-sm text-band-gold" aria-label={`${cantidad} de 5`}>
      {"★".repeat(cantidad)}
      <span className="text-ink/20">{"★".repeat(5 - cantidad)}</span>
    </span>
  );
}

export default function Resenas({ productoId }) {
  const [lista, setLista] = useState([]);
  const [tipo, setTipo] = useState("resena");
  const [estrellas, setEstrellas] = useState(5);
  const [texto, setTexto] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    setLista(leerResenas(productoId));
  }, [productoId]);

  function enviar(e) {
    e.preventDefault();
    const sesion = leerSesion();

    const entrada = {
      autor: sesion?.nombre || "Usuario anónimo",
      tipo,
      texto: texto.trim() || "(sin comentario)",
    };
    if (tipo === "resena") entrada.estrellas = estrellas;

    setLista(agregarResena(productoId, entrada));
    setTexto("");
    setToast(tipo === "resena" ? "Reseña publicada (simulado)" : "Pregunta enviada (simulado)");
  }

  const resenas = lista.filter((r) => r.tipo === "resena");
  const promedio =
    resenas.length > 0
      ? (resenas.reduce((s, r) => s + r.estrellas, 0) / resenas.length).toFixed(1)
      : null;

  return (
    <div className="mt-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className={label}>Comunidad</p>
          <h2 className="mt-2 font-display text-2xl font-extrabold">
            Opiniones y preguntas técnicas
          </h2>
        </div>
        {promedio && (
          <div className="text-right">
            <p className="font-display text-3xl font-extrabold tabular-nums">{promedio}</p>
            <p className="font-mono text-xs text-trace">{resenas.length} reseñas</p>
          </div>
        )}
      </div>

      {/* Formulario */}
      <form onSubmit={enviar} className="mt-6 rounded-sm border border-ink/15 bg-white p-5">
        <div className="flex flex-wrap gap-2">
          {[
            ["resena", "Dejar reseña"],
            ["pregunta", "Hacer pregunta"],
          ].map(([id, nombre]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTipo(id)}
              className={`rounded-sm px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors ${
                tipo === id ? "bg-ink text-board" : "border border-ink/20 hover:border-ink"
              }`}
            >
              {nombre}
            </button>
          ))}
        </div>

        {tipo === "resena" && (
          <div className="mt-4">
            <p className={label}>Calificación</p>
            <div className="mt-2 flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setEstrellas(n)}
                  className={`font-mono text-2xl leading-none transition-colors ${
                    n <= estrellas ? "text-band-gold" : "text-ink/20 hover:text-band-gold/50"
                  }`}
                  aria-label={`${n} estrellas`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4">
          <label htmlFor="texto" className={label}>
            {tipo === "resena" ? "Tu experiencia con el componente" : "Tu duda técnica"}
          </label>
          <textarea
            id="texto"
            rows="3"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder={
              tipo === "resena"
                ? "Lo usé en un proyecto de..."
                : "¿Es compatible con...?"
            }
            className={`${input} resize-y`}
          />
        </div>

        <button
          type="submit"
          className="mt-4 rounded-sm bg-ink px-6 py-2.5 font-mono text-xs uppercase tracking-wider text-board hover:bg-ink-soft"
        >
          Publicar
        </button>
      </form>

      {/* Listado */}
      {lista.length === 0 ? (
        <p className="mt-6 rounded-sm border border-dashed border-ink/25 bg-white p-8 text-center text-sm text-trace">
          Todavía no hay opiniones de esta clave. Sé la primera persona en comentar.
        </p>
      ) : (
        <ul className="mt-6 grid gap-4">
          {lista.map((r) => (
            <li key={r.id} className="rounded-sm border border-ink/15 bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-display font-bold">{r.autor}</span>
                  <span
                    className={`rounded-sm px-2 py-0.5 font-mono text-xs uppercase tracking-wider ${
                      r.tipo === "resena"
                        ? "bg-band-green/10 text-band-green"
                        : "bg-band-violet/10 text-band-violet"
                    }`}
                  >
                    {r.tipo === "resena" ? "Reseña" : "Pregunta"}
                  </span>
                </div>
                <span className="font-mono text-xs text-trace">{r.fecha}</span>
              </div>

              {r.estrellas && (
                <div className="mt-2">
                  <Estrellas cantidad={r.estrellas} />
                </div>
              )}

              <p className="mt-3 text-sm leading-relaxed text-ink/80">{r.texto}</p>

              {r.respuesta && (
                <div className="mt-4 border-l-2 border-band-gold pl-4">
                  <p className={label}>Respuesta de Nexus</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink/75">{r.respuesta}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <Toast mensaje={toast} visible={!!toast} onCerrar={() => setToast("")} />
    </div>
  );
}