import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-24 bg-ink text-board">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:grid-cols-3">
        <div>
          <p className="font-display text-xl font-extrabold">NEXUS</p>
          <p className="mt-2 max-w-xs text-sm text-board/60">
            Componentes, microcontroladores y hardware especializado. Mayoreo y menudeo.
          </p>
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-board/50">Sitio</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/catalogo" className="hover:underline">Catálogo</Link></li>
            <li><Link to="/nosotros" className="hover:underline">Nosotros</Link></li>
            <li><Link to="/contacto" className="hover:underline">Contacto</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-board/50">Sucursal</p>
          <address className="mt-3 space-y-1 text-sm not-italic text-board/80">
            <p>Aguascalientes, Ags.</p>
            <p>Lun a Vie · 9:00 – 19:00</p>
            <p>Sáb · 10:00 – 14:00</p>
          </address>
        </div>
      </div>

      <div className="border-t border-board/10 px-5 py-4 text-center font-mono text-xs text-board/40">
        Nexus dejanos conectar tus ideas 
      </div>
    </footer>
  );
}