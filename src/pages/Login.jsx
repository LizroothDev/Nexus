import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { leerUsuarios, iniciarSesion } from "../store/sesion";
import Toast from "../components/Toast";

const input =
  "mt-1 w-full rounded-sm border border-ink/20 bg-white px-3 py-2.5 text-sm outline-none focus:border-ink";
const label = "font-mono text-xs uppercase tracking-widest text-trace";

const invitado = {
  nombre: "Usuario de prueba",
  correo: "demo@nexus.mx",
  tipo: "maker",
};

export default function Login() {
  const navigate = useNavigate();
  const [datos, setDatos] = useState({ correo: "", password: "" });
  const [toast, setToast] = useState(false);

  function cambiar(e) {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  }

  function enviar(e) {
    e.preventDefault();

    // Sin validación: entra el último usuario registrado o uno de prueba
    const usuarios = leerUsuarios();
    iniciarSesion(usuarios[usuarios.length - 1] || invitado);

    setToast(true);
    setTimeout(() => navigate("/perfil"), 1200);
  }

  return (
    <section className="mx-auto max-w-md px-5 pt-20 pb-24">
      <p className={label}>Acceso</p>
      <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight">
        Inicia sesión
      </h1>
      <p className="mt-3 text-ink/70">
        Entra a tu cuenta para ver tus precios y tu historial.
      </p>

      <form onSubmit={enviar} className="mt-10 grid gap-5">
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

        <button
          type="submit"
          className="mt-2 rounded-sm bg-ink px-6 py-3 font-mono text-xs uppercase tracking-wider text-board transition-colors hover:bg-ink-soft"
        >
          Entrar
        </button>

        <p className="text-center text-sm text-trace">
          ¿No tienes cuenta?{" "}
          <Link to="/registro" className="font-semibold text-ink hover:underline">
            Regístrate
          </Link>
        </p>
      </form>

      <Toast
        mensaje="Sesión iniciada (simulado)"
        visible={toast}
        onCerrar={() => setToast(false)}
      />
    </section>
  );
}