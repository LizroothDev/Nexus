import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Toast from "../components/Toast";
import BandaResistencia from "../components/BandaResistencia";

const kit = [
  ["ESP32-WROOM-32", "Wi-Fi + BLE, 38 pines", 189],
  ["Protoboard 830 puntos", "Con bus de alimentación doble", 78],
  ["Driver de motor L298N", "Doble puente H, 2A por canal", 96],
  ["Motorreductores TT ×2", "6V, 200 RPM, con llantas", 124],
  ["Sensor ultrasónico HC-SR04", "Rango de 2 a 400 cm", 52],
  ["Servomotor SG90", "180 grados", 68],
  ["Sensores infrarrojos ×2", "Seguidor de línea", 64],
  ["Surtido de resistencias", "120 piezas de 1/4W", 45],
  ["LEDs, botones y jumpers", "Accesorios de armado", 94],
  ["Portapilas 6×AA con switch", "Salida de 9V", 42],
];

const beneficios = [
  {
    color: "bg-band-red",
    titulo: "Todo compatible",
    texto:
      "Funciona en 3.3V con el regulador incluido. Sin divisores de voltaje improvisados.",
  },
  {
    color: "bg-band-violet",
    titulo: "Con datasheets",
    texto:
      "Hojas técnicas, pinout de la placa y tres diagramas de conexión para arrancar el mismo día.",
  },
  {
    color: "bg-band-green",
    titulo: "Reposición por pieza",
    texto:
      "Si quemas un componente lo repones suelto. No compras otro kit completo.",
  },
];

const opiniones = [
  [
    "Llevaba dos semanas esperando un driver de motor. Aquí lo recogí al día siguiente y ya con todo el kit.",
    "Diego Ramírez",
    "Mecatrónica, 6to semestre",
  ],
  [
    "Lo compramos para el taller. Doce alumnos armaron su seguidor de línea sin quemar una sola placa.",
    "Ing. Paola Estrada",
    "Coordinadora de laboratorio",
  ],
  [
    "El detalle de que todo sea 3.3V me ahorró el problema de conectar un sensor de 5V al ESP32.",
    "Samuel Ortiz",
    "Maker, Aguascalientes",
  ],
];

const PRECIO_KIT = 549;
const suelto = kit.reduce((total, [, , precio]) => total + precio, 0);

const input =
  "mt-1 w-full rounded-sm border border-ink/20 bg-white px-3 py-2.5 text-sm outline-none focus:border-ink";
const label = "font-mono text-xs uppercase tracking-widest text-trace";

// Fecha límite: 9 días desde que se carga la página
const limite = new Date(Date.now() + 9 * 24 * 60 * 60 * 1000);

export default function Campana() {
  const [datos, setDatos] = useState({ nombre: "", correo: "", perfil: "" });
  const [toast, setToast] = useState(false);
  const [restante, setRestante] = useState("");

  useEffect(() => {
    function tick() {
      const falta = limite - new Date();
      if (falta <= 0) {
        setRestante("Campaña terminada");
        return;
      }
      const dias = Math.floor(falta / 86400000);
      const horas = Math.floor(falta / 3600000) % 24;
      const min = Math.floor(falta / 60000) % 60;
      const seg = Math.floor(falta / 1000) % 60;
      setRestante(`${dias}d ${horas}h ${min}m ${seg}s`);
    }

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  function cambiar(e) {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  }

  function enviar(e) {
    e.preventDefault();
    setToast(true);
    setDatos({ nombre: "", correo: "", perfil: "" });
  }

  return (
    <div className="min-h-screen bg-board">
      {/* Barra sin menú: es una landing */}
      <div className="bg-ink text-board">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4">
          <Link to="/" className="font-display text-xl font-extrabold">
            NEXUS
          </Link>
          <span className="font-mono text-xs uppercase tracking-widest text-board/50">
            Campaña · Regreso a clases
          </span>
        </div>
      </div>
      <BandaResistencia />

      {/* Hero */}
      <section className="bg-band-violet text-board">
        <div className="mx-auto grid max-w-5xl items-center gap-10 px-5 py-14 md:grid-cols-2">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-band-gold">
              Kit armado · Existencia limitada
            </p>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Tu primer robot, sin buscar pieza por pieza
            </h1>
            <p className="mt-5 max-w-md leading-relaxed text-board/80">
              Diez componentes seleccionados para que un estudiante arme su primer
              proyecto de robótica. Todos compatibles entre sí, con datasheet
              incluido.
            </p>

            
              href="#apartar"
              className="mt-7 inline-block rounded-sm bg-band-gold px-6 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-ink transition-opacity hover:opacity-90"
            <a>
              Apartar mi kit
            </a>

            <p className="mt-8 font-mono text-xs uppercase tracking-widest text-board/60">
              La campaña termina en
            </p>
            <p className="mt-2 inline-block rounded-sm bg-ink/30 px-4 py-2 font-display text-xl font-extrabold tabular-nums">
              {restante}
            </p>
          </div>

          {/* Ilustración */}
          <div className="flex justify-center">
            <svg viewBox="0 0 300 200" className="w-full max-w-xs" aria-hidden="true">
              <rect x="20" y="20" width="260" height="160" rx="6" fill="#2E7D5B" />
              <rect x="110" y="70" width="80" height="60" rx="4" fill="#10141C" />
              <rect x="35" y="30" width="230" height="10" rx="2" fill="#10141C" />
              <rect x="35" y="160" width="230" height="10" rx="2" fill="#10141C" />
              <circle cx="60" cy="100" r="14" fill="#10141C" />
              <circle cx="240" cy="100" r="10" fill="#10141C" />
              <rect x="45" y="130" width="34" height="10" rx="5" fill="#F2F4F1" />
              <rect x="221" y="130" width="34" height="10" rx="5" fill="#F2F4F1" />
              <circle cx="240" cy="60" r="6" fill="#C1272D" />
            </svg>
          </div>
        </div>
      </section>

      {/* Formulario */}
      <div className="mx-auto max-w-5xl px-5">
        <div
          id="apartar"
          className="mx-auto -mt-10 max-w-md rounded-sm border border-ink/15 bg-white p-6 shadow-lg"
        >
          <h2 className="font-display text-xl font-extrabold">Aparta tu kit</h2>
          <p className="mt-1 text-sm text-trace">
            Déjanos tus datos y te lo reservamos. Pagas al recoger en sucursal.
          </p>

          <form onSubmit={enviar} className="mt-5 grid gap-4">
            <div>
              <label htmlFor="nombre" className={label}>
                Nombre completo
              </label>
              <input
                id="nombre"
                name="nombre"
                value={datos.nombre}
                onChange={cambiar}
                placeholder="Ana Martínez"
                className={input}
              />
            </div>

            <div>
              <label htmlFor="correo" className={label}>
                Correo
              </label>
              <input
                id="correo"
                name="correo"
                type="email"
                value={datos.correo}
                onChange={cambiar}
                placeholder="ana@ejemplo.com"
                className={input}
              />
            </div>

            <div>
              <label htmlFor="perfil" className={label}>
                Perfil
              </label>
              <select
                id="perfil"
                name="perfil"
                value={datos.perfil}
                onChange={cambiar}
                className={input}
              >
                <option value="">Selecciona una opción</option>
                <option>Estudiante</option>
                <option>Maker</option>
                <option>Laboratorio o escuela</option>
                <option>Empresa</option>
              </select>
            </div>

            <label className="flex items-start gap-2 text-xs text-trace">
              <input type="checkbox" className="mt-0.5 accent-band-violet" />
              <span>Acepto recibir avisos de campañas de Nexus.</span>
            </label>

            <button
              type="submit"
              className="rounded-sm bg-band-gold px-6 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-ink transition-opacity hover:opacity-90"
            >
              Apartar mi kit
            </button>
            <p className="text-center font-mono text-xs text-trace">
              Sin costo. Reserva válida 72 horas.
            </p>
          </form>
        </div>
      </div>

      {/* Qué incluye */}
      <section className="mx-auto max-w-5xl px-5 py-16">
        <h2 className="font-display text-3xl font-extrabold tracking-tight">
          Qué incluye el kit
        </h2>
        <p className="mt-3 max-w-xl text-ink/70">
          Los kits genéricos mezclan módulos de 5V con lógica de 3.3V y terminas
          quemando algo la primera semana. Este está armado para que eso no pase.
        </p>

        <ul className="mt-8 overflow-hidden rounded-sm border border-ink/15 bg-white">
          {kit.map(([nombre, spec, precio]) => (
            <li
              key={nombre}
              className="flex justify-between gap-4 border-b border-ink/10 px-4 py-3"
            >
              <span>
                <span className="text-sm font-medium">{nombre}</span>
                <span className="block font-mono text-xs text-trace">{spec}</span>
              </span>
              <span className="font-mono text-sm tabular-nums text-trace">
                ${precio}
              </span>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap items-center justify-between gap-4 rounded-b-sm bg-ink px-4 py-5 text-board">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-board/60">
              Precio del kit
            </p>
            <p className="mt-1 font-mono text-sm text-board/45 line-through">
              Por separado: ${suelto}
            </p>
          </div>
          <div className="text-right">
            <p className="font-display text-3xl font-extrabold tabular-nums">
              ${PRECIO_KIT}
            </p>
            <p className="font-mono text-xs text-band-gold">
              Ahorras ${suelto - PRECIO_KIT}
            </p>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="mx-auto max-w-5xl px-5 pb-16">
        <div className="grid gap-8 sm:grid-cols-3">
          {beneficios.map((b) => (
            <div key={b.titulo}>
              <div className={`h-1 w-10 rounded-sm ${b.color}`} />
              <h3 className="mt-4 font-display text-xl font-bold">{b.titulo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{b.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Opiniones */}
      <section className="border-y border-ink/10 bg-white">
        <div className="mx-auto max-w-5xl px-5 py-16">
          <h2 className="font-display text-2xl font-extrabold">
            Quienes ya lo armaron
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {opiniones.map(([texto, autor, rol]) => (
              <div key={autor} className="border-l-2 border-band-gold pl-4">
                <p className="text-sm leading-relaxed">{texto}</p>
                <p className="mt-3 font-mono text-xs text-trace">
                  <span className="block font-semibold text-ink">{autor}</span>
                  {rol}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cierre */}
      <section className="bg-ink px-5 py-16 text-center text-board">
        <h2 className="font-display text-3xl font-extrabold">
          Quedan pocas piezas
        </h2>
        <p className="mt-2 text-board/70">
          Aparta el tuyo sin costo y recógelo cuando te acomode.
        </p>
        
          href="#apartar"
          className="mt-6 inline-block rounded-sm bg-band-gold px-6 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-ink transition-opacity hover:opacity-90"
         <a>
          Apartar mi kit
         </a>

      </section>

      <footer className="bg-ink-soft px-5 py-5 text-center font-mono text-xs leading-relaxed text-board/50">
        Nexus · Aguascalientes, Ags. · Lun a Vie 9:00 a 19:00
        <br />
        <Link to="/" className="hover:text-board">
          Ir al sitio completo
        </Link>
      </footer>

      <Toast
        mensaje="Kit apartado (simulado)"
        visible={toast}
        onCerrar={() => setToast(false)}
      />
    </div>
  );
}