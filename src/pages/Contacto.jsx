import { useState } from "react";
import Toast from "../components/Toast";

const asuntos = [
  "Cotización de mayoreo",
  "Disponibilidad de una clave",
  "Duda técnica",
  "Facturación",
  "Otro",
];

const redes = [
  ["Instagram", "@nexus.componentes"],
  ["Facebook", "/nexuscomponentes"],
  ["WhatsApp", "449 123 4567"],
];

const inicial = { nombre: "", correo: "", asunto: "", mensaje: "" };

const input =
  "mt-1 w-full rounded-sm border border-ink/20 bg-white px-3 py-2.5 text-sm outline-none focus:border-ink";
const label = "font-mono text-xs uppercase tracking-widest text-trace";

export default function Contacto() {
  const [datos, setDatos] = useState(inicial);
  const [toast, setToast] = useState(false);

  function cambiar(e) {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  }

  function enviar(e) {
    e.preventDefault();
    setToast(true);
    setDatos(inicial);
  }

  return (
    <section className="mx-auto max-w-6xl px-5 pt-16 pb-20">
      <p className={label}>Contacto</p>
      <h1 className="mt-3 max-w-2xl font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
        ¿Buscas una clave que no está en catálogo?
      </h1>
      <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink/70">
        Mándanos el número de parte o describe lo que necesitas. Cotizamos
        mayoreo el mismo día hábil.
      </p>

      <div className="mt-12 grid gap-12 lg:grid-cols-3">
        <form onSubmit={enviar} className="grid gap-5 lg:col-span-2">
          <div>
            <label htmlFor="nombre" className={label}>Nombre</label>
            <input id="nombre" name="nombre" value={datos.nombre} onChange={cambiar} placeholder="Ana Martínez" className={input} />
          </div>

          <div>
            <label htmlFor="correo" className={label}>Correo</label>
            <input id="correo" name="correo" type="email" value={datos.correo} onChange={cambiar} placeholder="ana@ejemplo.com" className={input} />
          </div>

          <div>
            <label htmlFor="asunto" className={label}>Asunto</label>
            <select id="asunto" name="asunto" value={datos.asunto} onChange={cambiar} className={input}>
              <option value="">Selecciona una opción</option>
              {asuntos.map((a) => <option key={a}>{a}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="mensaje" className={label}>Mensaje</label>
            <textarea id="mensaje" name="mensaje" rows="5" value={datos.mensaje} onChange={cambiar} placeholder="Necesito 50 piezas de ESP32-WROOM-32..." className={input} />
          </div>

          <button type="submit" className="justify-self-start rounded-sm bg-ink px-6 py-3 font-mono text-xs uppercase tracking-wider text-board hover:bg-ink-soft">
            Enviar mensaje
          </button>
        </form>

        <div className="grid content-start gap-8 border-t border-ink/10 pt-8 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <div>
            <p className={label}>Sucursal</p>
            <p className="mt-3 text-sm leading-relaxed text-ink/80">
              Av. Convención de 1914 Nte. 1420<br />
              Col. Circunvalación Norte<br />
              Aguascalientes, Ags. · C.P. 20020
            </p>
          </div>

          <div>
            <p className={label}>Horarios</p>
            <p className="mt-3 font-mono text-sm text-ink/80">
              Lun a Vie · 9:00 – 19:00<br />
              Sáb · 10:00 – 14:00
            </p>
          </div>

          <div>
            <p className={label}>Redes</p>
            <ul className="mt-3 space-y-2">
              {redes.map((r) => (
                <li key={r[0]} className="text-sm">
                  <span className="font-semibold">{r[0]}</span>{" "}
                  <span className="font-mono text-xs text-trace">{r[1]}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <Toast mensaje="Mensaje enviado (simulado)" visible={toast} onCerrar={() => setToast(false)} />
    </section>
  );
}