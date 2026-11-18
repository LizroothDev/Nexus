import { useParams, Link } from "react-router-dom";
import { buscarPedido } from "../store/pedidos";
import Rastreo from "../components/Rastreo";

const label = "font-mono text-xs uppercase tracking-widest text-trace";
const pesos = (n) =>
  n.toLocaleString("es-MX", { style: "currency", currency: "MXN" });

const nombreMetodo = {
  tarjeta: "Tarjeta de crédito o débito",
  spei: "Transferencia SPEI",
  wallet: "Monedero Nexus",
};

export default function Confirmacion() {
  const { folio } = useParams();
  const pedido = buscarPedido(folio);

  if (!pedido) {
    return (
      <section className="mx-auto max-w-3xl px-5 py-32 text-center">
        <h1 className="font-display text-3xl font-extrabold">
          No encontramos ese pedido
        </h1>
        <Link
          to="/catalogo"
          className="mt-6 inline-block rounded-sm bg-ink px-6 py-3 font-mono text-xs uppercase tracking-wider text-board"
        >
          Ver catálogo
        </Link>
      </section>
    );
  }

  const entrega = new Date(pedido.fecha);
  entrega.setDate(entrega.getDate() + 2);

  return (
    <section className="mx-auto max-w-3xl px-5 pt-16 pb-24">
      {/* Encabezado */}
      <div className="rounded-sm bg-band-green px-6 py-8 text-center text-board">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-board/20 font-display text-3xl">
          ✓
        </span>
        <h1 className="mt-4 font-display text-3xl font-extrabold">
          Pago aprobado
        </h1>
        <p className="mt-2 text-board/80">
          Tu pedido quedó confirmado. Te mandamos el comprobante por correo.
        </p>
      </div>

      {/* Folio */}
      <div className="mt-8 grid gap-px overflow-hidden rounded-sm bg-ink/10 sm:grid-cols-3">
        <div className="bg-white p-5">
          <p className={label}>Folio</p>
          <p className="mt-1 font-display text-2xl font-extrabold">{pedido.folio}</p>
        </div>
        <div className="bg-white p-5">
          <p className={label}>Total pagado</p>
          <p className="mt-1 font-display text-2xl font-extrabold tabular-nums">
            {pesos(pedido.total)}
          </p>
        </div>
        <div className="bg-white p-5">
          <p className={label}>Entrega estimada</p>
          <p className="mt-1 font-display text-lg font-bold">
            {entrega.toLocaleDateString("es-MX", { day: "numeric", month: "long" })}
          </p>
        </div>
      </div>

      {/* Rastreo del paquete */}
      <div className="mt-6">
        <Rastreo pedido={pedido} />
      </div>

      {/* Detalle */}
      <div className="mt-6 rounded-sm border border-ink/15 bg-white p-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className={label}>Se envía a</p>
            <p className="mt-2 text-sm leading-relaxed text-ink/80">
              {pedido.envio.nombre}
              <br />
              {pedido.envio.calle || "Dirección por confirmar"}
              <br />
              {pedido.envio.colonia && `${pedido.envio.colonia}, `}
              {pedido.envio.ciudad} {pedido.envio.cp}
            </p>
          </div>
          <div>
            <p className={label}>Pago</p>
            <p className="mt-2 text-sm leading-relaxed text-ink/80">
              {nombreMetodo[pedido.metodo]}
              {pedido.metodo === "tarjeta" && (
                <>
                  <br />
                  Terminada en {pedido.ultimos4}
                </>
              )}
            </p>
          </div>
        </div>

        <ul className="mt-6 divide-y divide-ink/10 border-t border-ink/10 pt-2">
          {pedido.items.map((i) => (
            <li key={i.id} className="flex justify-between gap-4 py-3">
              <span className="text-sm">
                {i.nombre}
                <span className="block font-mono text-xs text-trace">
                  {i.cantidad} × {pesos(i.unitario)}
                </span>
              </span>
              <span className="font-mono text-sm tabular-nums">
                {pesos(i.unitario * i.cantidad)}
              </span>
            </li>
          ))}
        </ul>

        <dl className="mt-4 grid gap-2 border-t border-ink/10 pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-trace">Subtotal</dt>
            <dd className="font-mono tabular-nums">{pesos(pedido.subtotal)}</dd>
          </div>
          {pedido.descuento > 0 && (
            <div className="flex justify-between text-band-green">
              <dt className="font-mono text-xs">{pedido.cupon.codigo}</dt>
              <dd className="font-mono tabular-nums">−{pesos(pedido.descuento)}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-trace">IVA (16%)</dt>
            <dd className="font-mono tabular-nums">{pesos(pedido.iva)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-trace">Envío</dt>
            <dd className="font-mono tabular-nums">
              {pedido.envioCosto === 0 ? "Gratis" : pesos(pedido.envioCosto)}
            </dd>
          </div>
          <div className="mt-2 flex items-baseline justify-between border-t border-ink/10 pt-3">
            <dt className="font-mono text-xs uppercase tracking-widest">Total</dt>
            <dd className="font-display text-2xl font-extrabold tabular-nums">
              {pesos(pedido.total)}
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          to={`/factura/${pedido.folio}`}
          className="rounded-sm bg-ink px-6 py-3 font-mono text-xs uppercase tracking-wider text-board hover:bg-ink-soft"
        >
          Ver comprobante
        </Link>
        <Link
          to="/perfil"
          className="rounded-sm border border-ink/25 px-6 py-3 font-mono text-xs uppercase tracking-wider hover:border-ink"
        >
          Mis compras
        </Link>
        <Link
          to="/catalogo"
          className="rounded-sm border border-ink/25 px-6 py-3 font-mono text-xs uppercase tracking-wider hover:border-ink"
        >
          Seguir comprando
        </Link>
      </div>
    </section>
  );
}