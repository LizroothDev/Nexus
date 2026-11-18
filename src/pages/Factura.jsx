import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { buscarPedido } from "../store/pedidos";
import Toast from "../components/Toast";

const label = "font-mono text-xs uppercase tracking-widest text-trace";
const pesos = (n) =>
  n.toLocaleString("es-MX", { style: "currency", currency: "MXN" });

export default function Factura() {
  const { folio } = useParams();
  const pedido = buscarPedido(folio);
  const [toast, setToast] = useState("");

  if (!pedido) {
    return (
      <section className="mx-auto max-w-3xl px-5 py-32 text-center">
        <h1 className="font-display text-3xl font-extrabold">
          No encontramos ese comprobante
        </h1>
        <Link
          to="/perfil"
          className="mt-6 inline-block rounded-sm bg-ink px-6 py-3 font-mono text-xs uppercase tracking-wider text-board"
        >
          Mis compras
        </Link>
      </section>
    );
  }

  const fecha = new Date(pedido.fecha);
  const esFactura = pedido.factura;
  const uuid = `A1B2C3D4-${pedido.folio.replace("NX-", "")}-E5F6-7890-ABCDEF123456`;

  return (
    <section className="mx-auto max-w-3xl px-5 pt-10 pb-24">
      <Link
        to="/perfil"
        className="font-mono text-xs uppercase tracking-widest text-trace hover:text-ink"
      >
        ← Mis compras
      </Link>

      {/* Documento */}
      <article className="mt-6 overflow-hidden rounded-sm border border-ink/20 bg-white">
        {/* Encabezado */}
        <div className="flex flex-wrap items-start justify-between gap-6 border-b border-ink/15 p-7">
          <div>
            <p className="font-display text-2xl font-extrabold">NEXUS</p>
            <p className="mt-2 font-mono text-xs leading-relaxed text-trace">
              Nexus Componentes S.A. de C.V.
              <br />
              RFC: NCO240115AB3
              <br />
              Av. Convención de 1914 Nte. 1420
              <br />
              Aguascalientes, Ags. · C.P. 20020
            </p>
          </div>

          <div className="text-right">
            <p className={label}>
              {esFactura ? "Factura · CFDI 4.0" : "Ticket de compra"}
            </p>
            <p className="mt-1 font-display text-xl font-extrabold">{pedido.folio}</p>
            <p className="mt-2 font-mono text-xs text-trace">
              {fecha.toLocaleDateString("es-MX", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}{" "}
              {fecha.toLocaleTimeString("es-MX", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        {/* Receptor */}
        <div className="grid gap-6 border-b border-ink/15 p-7 sm:grid-cols-2">
          <div>
            <p className={label}>Receptor</p>
            <p className="mt-2 text-sm leading-relaxed">
              {esFactura ? (
                <>
                  <span className="font-semibold">
                    {pedido.envio.razonSocial || "Razón social pendiente"}
                  </span>
                  <br />
                  <span className="font-mono uppercase">
                    RFC: {pedido.envio.rfc || "XAXX010101000"}
                  </span>
                  <br />
                  <span className="font-mono text-xs text-trace">
                    {pedido.envio.usoCfdi}
                  </span>
                </>
              ) : (
                <>
                  <span className="font-semibold">{pedido.envio.nombre}</span>
                  <br />
                  <span className="font-mono text-xs text-trace">
                    Público en general
                  </span>
                </>
              )}
            </p>
          </div>

          <div>
            <p className={label}>Lugar de expedición</p>
            <p className="mt-2 font-mono text-sm">20020 · Aguascalientes</p>
            <p className={`${label} mt-4`}>Forma de pago</p>
            <p className="mt-1 font-mono text-sm">
              {pedido.metodo === "tarjeta" && "04 · Tarjeta de crédito"}
              {pedido.metodo === "spei" && "03 · Transferencia electrónica"}
              {pedido.metodo === "wallet" && "28 · Tarjeta de débito"}
            </p>
          </div>
        </div>

        {/* Conceptos */}
        <div className="p-7">
          <p className={label}>Conceptos</p>
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="border-b border-ink/15 text-left">
                <th className="pb-2 font-mono text-xs uppercase tracking-wider text-trace">Clave SAT</th>
                <th className="pb-2 font-mono text-xs uppercase tracking-wider text-trace">Descripción</th>
                <th className="pb-2 text-right font-mono text-xs uppercase tracking-wider text-trace">Cant.</th>
                <th className="pb-2 text-right font-mono text-xs uppercase tracking-wider text-trace">P. Unit.</th>
                <th className="pb-2 text-right font-mono text-xs uppercase tracking-wider text-trace">Importe</th>
              </tr>
            </thead>
            <tbody>
              {pedido.items.map((i) => (
                <tr key={i.id} className="border-b border-ink/5">
                  <td className="py-3 font-mono text-xs text-trace">43211500</td>
                  <td className="py-3">{i.nombre}</td>
                  <td className="py-3 text-right font-mono tabular-nums">{i.cantidad}</td>
                  <td className="py-3 text-right font-mono tabular-nums">{pesos(i.unitario)}</td>
                  <td className="py-3 text-right font-mono tabular-nums">
                    {pesos(i.unitario * i.cantidad)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totales */}
          <div className="mt-6 ml-auto max-w-xs">
            <dl className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-trace">Subtotal</dt>
                <dd className="font-mono tabular-nums">{pesos(pedido.subtotal)}</dd>
              </div>
              {pedido.descuento > 0 && (
                <div className="flex justify-between text-band-green">
                  <dt>Descuento {pedido.cupon.codigo}</dt>
                  <dd className="font-mono tabular-nums">−{pesos(pedido.descuento)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-trace">Envío</dt>
                <dd className="font-mono tabular-nums">
                  {pedido.envioCosto === 0 ? "0.00" : pesos(pedido.envioCosto)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-trace">IVA trasladado 16%</dt>
                <dd className="font-mono tabular-nums">{pesos(pedido.iva)}</dd>
              </div>
              <div className="mt-2 flex items-baseline justify-between border-t border-ink/15 pt-3">
                <dt className="font-mono text-xs uppercase tracking-widest">Total</dt>
                <dd className="font-display text-2xl font-extrabold tabular-nums">
                  {pesos(pedido.total)}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Sello fiscal */}
        {esFactura && (
          <div className="border-t border-ink/15 bg-board/50 p-7">
            <p className={label}>Folio fiscal (UUID)</p>
            <p className="mt-1 break-all font-mono text-xs">{uuid}</p>
            <p className={`${label} mt-4`}>Sello digital del CFDI</p>
            <p className="mt-1 break-all font-mono text-xs leading-relaxed text-trace">
              kL9vQx2mNpR7wTzY4hJdF8sA3bC6eG1nM5uV0iO9pX7rW2tE4yU6aS8dH3gK1lZ
            </p>
            <p className="mt-4 font-mono text-xs italic text-trace">
              Documento con fines académicos. Este comprobante no tiene validez
              fiscal.
            </p>
          </div>
        )}
      </article>

      {/* Descargas */}
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={() => setToast("Descarga de PDF simulada")}
          className="rounded-sm bg-ink px-6 py-3 font-mono text-xs uppercase tracking-wider text-board hover:bg-ink-soft"
        >
          Descargar PDF
        </button>
        {esFactura && (
          <button
            onClick={() => setToast("Descarga de XML simulada")}
            className="rounded-sm border border-ink/25 px-6 py-3 font-mono text-xs uppercase tracking-wider hover:border-ink"
          >
            Descargar XML
          </button>
        )}
        <button
          onClick={() => window.print()}
          className="rounded-sm border border-ink/25 px-6 py-3 font-mono text-xs uppercase tracking-wider hover:border-ink"
        >
          Imprimir
        </button>
      </div>

      <Toast mensaje={toast} visible={!!toast} onCerrar={() => setToast("")} />
    </section>
  );
}