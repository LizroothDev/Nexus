import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { guardarUsuario } from "../store/sesion";
import Toast from "../components/Toast";

const tipos = [
  {
    id: "maker",
    titulo: "Estudiante / Maker",
    desc: "Compras por pieza, sin mínimo. Precio de menudeo.",
  },
  {
    id: "empresa",
    titulo: "Empresa / Mayoreo",
    desc: "Precio por volumen automático, crédito y factura CFDI.",
  },
];

const input =
  "mt-1 w-full rounded-sm border border-ink/20 bg-white px-3 py-2.5 text-sm outline-none focus:border-ink";
const label = "font-mono text-xs uppercase tracking-widest text-trace";

export default function Registro() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const tipoInicial = params.get("tipo") === "empresa" ? "empresa" : "maker";

  const [tipo, setTipo] = useState(tipoInicial);
  const [acepto, setAcepto] = useState(false);
  const [datos, setDatos] = useState({
    nombre: "",
    correo: "",
    password: "",
    empresa: "",
    rfc: "",
  });
  const [toast, setToast] = useState(false);

  function cambiar(e) {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  }

  function enviar(e) {
    e.preventDefault();

    guardarUsuario({
      ...datos,
      tipo,
      acepto,
      nombre: datos.nombre || "Usuario de prueba",
      correo: datos.correo || "demo@nexus.mx",
    });

    setToast(true);
    setTimeout(() => navigate("/login"), 1400);
  }

  return (
    <section className="mx-auto max-w-2xl px-5 pt-16 pb-24">
      <p className={label}>Registro</p>
      <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight">
        Crea tu cuenta
      </h1>
      <p className="mt-3 text-ink/70">
        El tipo de cuenta define los precios que ves en el catálogo.
      </p>

      {/* Selector de tipo */}
      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        {tipos.map((t) => {
          const activo = tipo === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTipo(t.id)}
              className={`rounded-sm border p-4 text-left transition-colors ${
                activo
                  ? "border-ink bg-ink text-board"
                  : "border-ink/20 bg-white hover:border-ink/50"
              }`}
            >
              <span className="font-display text-lg font-bold">{t.titulo}</span>
              <span
                className={`mt-1 block text-xs leading-relaxed ${
                  activo ? "text-board/70" : "text-trace"
                }`}
              >
                {t.desc}
              </span>
            </button>
          );
        })}
      </div>

      {/* Formulario */}
      <form onSubmit={enviar} className="mt-8 grid gap-5">
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
          <label htmlFor="password" className={label}>
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={datos.password}
            onChange={cambiar}
            placeholder="••••••••"
            className={input}
          />
        </div>

        {/* Campos que solo aparecen para empresa */}
        {tipo === "empresa" && (
          <div className="grid gap-5 rounded-sm border border-band-violet/30 bg-band-violet/5 p-5">
            <p className="font-mono text-xs uppercase tracking-widest text-band-violet">
              Datos fiscales
            </p>
            <div>
              <label htmlFor="empresa" className={label}>
                Razón social
              </label>
              <input
                id="empresa"
                name="empresa"
                value={datos.empresa}
                onChange={cambiar}
                placeholder="Automatización del Bajío S.A. de C.V."
                className={input}
              />
            </div>
            <div>
              <label htmlFor="rfc" className={label}>
                RFC
              </label>
              <input
                id="rfc"
                name="rfc"
                value={datos.rfc}
                onChange={cambiar}
                placeholder="ABC010203XY9"
                className={input}
              />
            </div>
          </div>
        )}

        <label className="flex items-start gap-3 text-sm leading-relaxed">
          <input
            type="checkbox"
            checked={acepto}
            onChange={(e) => setAcepto(e.target.checked)}
            className="mt-1 h-4 w-4 shrink-0 accent-ink"
          />
          <span className="text-ink/75">
            Acepto los{" "}
            <Link
              to="/legal?doc=terminos"
              target="_blank"
              className="font-semibold text-ink underline hover:text-band-red"
            >
              términos y condiciones
            </Link>{" "}
            y el{" "}
            <Link
              to="/legal?doc=privacidad"
              target="_blank"
              className="font-semibold text-ink underline hover:text-band-red"
            >
              aviso de privacidad
            </Link>
            .
          </span>
        </label>

        <button
          type="submit"
          className="mt-2 rounded-sm bg-ink px-6 py-3 font-mono text-xs uppercase tracking-wider text-board transition-colors hover:bg-ink-soft"
        >
          Registrarme
        </button>

        <p className="text-center text-sm text-trace">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="font-semibold text-ink hover:underline">
            Inicia sesión
          </Link>
        </p>
      </form>

      <Toast
        mensaje="Registro exitoso (simulado)"
        visible={toast}
        onCerrar={() => setToast(false)}
      />
    </section>
  );
}