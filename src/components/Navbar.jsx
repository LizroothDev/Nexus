import { useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import BandaResistencia from "./BandaResistencia";
import { leerSesion } from "../store/sesion";
import { leerCarrito, contarPiezas } from "../store/carrito";

const enlaces = [
  { to: "/", label: "Inicio" },
  { to: "/catalogo", label: "Catálogo" },
  { to: "/nosotros", label: "Nosotros" },
  { to: "/contacto", label: "Contacto" },
];

export default function Navbar() {
  const [abierto, setAbierto] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [piezas, setPiezas] = useState(0);
  const location = useLocation();

  useEffect(() => {
    setUsuario(leerSesion());
  }, [location]);

  useEffect(() => {
    const actualizar = () => setPiezas(contarPiezas(leerCarrito()));
    actualizar();
    window.addEventListener("carrito-cambio", actualizar);
    return () => window.removeEventListener("carrito-cambio", actualizar);
  }, [location]);

  const estiloEnlace = ({ isActive }) =>
    `text-sm font-medium tracking-wide transition-colors ${
      isActive ? "text-ink" : "text-trace hover:text-ink"
    }`;

  const estiloBoton =
    "rounded-sm bg-ink px-4 py-2 font-mono text-xs font-medium tracking-wider text-board uppercase transition-colors hover:bg-ink-soft";

  const destino = usuario ? "/perfil" : "/login";
  const textoBoton = usuario ? "Mi cuenta" : "Iniciar sesión";

  const enlaceCarrito = (
    <Link
      to="/carrito"
      className="relative font-mono text-xs uppercase tracking-wider text-trace transition-colors hover:text-ink"
    >
      Carrito
      {piezas > 0 && (
        <span className="absolute -right-4 -top-2 rounded-full bg-band-red px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-board">
          {piezas}
        </span>
      )}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 bg-board/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="font-display text-2xl font-extrabold tracking-tight">
          NEXUS
        </Link>

        {/* Escritorio */}
        <nav className="hidden items-center gap-8 md:flex">
          {enlaces.map((e) => (
            <NavLink key={e.to} to={e.to} className={estiloEnlace}>
              {e.label}
            </NavLink>
          ))}
          {enlaceCarrito}
          <Link to={destino} className={estiloBoton}>
            {textoBoton}
          </Link>
        </nav>

        {/* Botón móvil */}
        <button
          onClick={() => setAbierto(!abierto)}
          className="font-mono text-sm uppercase tracking-wider md:hidden"
          aria-expanded={abierto}
        >
          {abierto ? "Cerrar" : "Menú"}
        </button>
      </div>

      {/* Menú móvil */}
      {abierto && (
        <nav className="flex flex-col gap-1 border-t border-trace/20 px-5 py-3 md:hidden">
          {enlaces.map((e) => (
            <NavLink
              key={e.to}
              to={e.to}
              onClick={() => setAbierto(false)}
              className={estiloEnlace}
            >
              <span className="block py-2">{e.label}</span>
            </NavLink>
          ))}

          <Link
            to="/carrito"
            onClick={() => setAbierto(false)}
            className="py-2 font-mono text-sm uppercase tracking-wider text-trace hover:text-ink"
          >
            Carrito {piezas > 0 && `(${piezas})`}
          </Link>

          <Link
            to={destino}
            onClick={() => setAbierto(false)}
            className={`${estiloBoton} mt-2 text-center`}
          >
            {textoBoton}
          </Link>
        </nav>
      )}

      <BandaResistencia />
    </header>
  );
}