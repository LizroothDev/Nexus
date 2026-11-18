import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { leerCarrito, calcularTotales, precioUnitario, vaciarCarrito } from "../store/carrito";
import { leerCuponActivo, quitarCupon } from "../store/cupon";
import { calcularDescuento } from "../data/cupones";
import { leerSesion } from "../store/sesion";
import { crearPedido } from "../store/pedidos";

const label = "font-mono text-xs uppercase tracking-widest text-trace";
const input =
  "mt-1 w-full rounded-sm border border-ink/20 bg-white px-3 py-2.5 text-sm outline-none focus:border-ink";
const pesos = (n) =>
  n.toLocaleString("es-MX", { style: "currency", currency: "MXN" });

const pasos = ["Envío y datos fiscales", "Método de pago", "Confirmación"];

const metodos = [
  {
    id: "tarjeta",
    nombre: "Tarjeta de crédito o débito",
    detalle: "Visa, Mastercard y American Express",
    color: "border-band-violet",
  },
  {
    id: "spei",
    nombre: "Transferencia SPEI",
    detalle: "Recibes la CLABE al confirmar el pedido",
    color: "border-band-green",
  },
  {
    id: "wallet",
    nombre: "Monedero Nexus",
    detalle: "Saldo disponible: $1,250.00",
    color: "border-band-gold",
  },
];

const envioVacio = {
  nombre: "",
  calle: "",
  colonia: "",
  ciudad: "Aguascalientes",
  estado: "Aguascalientes",
  cp: "",
  telefono: "",
  rfc: "",
  razonSocial: "",
  usoCfdi: "G03 · Gastos en general",
};

const pagoVacio = {
  titular: "",
  tarjeta: "",
  vence: "",
  cvv: "",
};

export default function Checkout() {
  const navigate = useNavigate();
  const [paso, setPaso] = useState(0);
  const [items, setItems] = useState([]);
  const [cupon, setCupon] = useState(null);
  const [envio, setEnvio] = useState(envioVacio);
  const [metodo, setMetodo] = useState("tarjeta");
  const [pago, setPago] = useState(pagoVacio);
  const [factura, setFactura] = useState(false);

  useEffect(() => {
    const carrito = leerCarrito();
    setItems(carrito);
    setCupon(leerCuponActivo());

    const sesion = leerSesion();
    if (sesion) {
      setEnvio((e) => ({
        ...e,
        nombre: sesion.nombre || "",
        rfc: sesion.rfc || "",
        razonSocial: sesion.empresa || "",
      }));
      if (sesion.tipo === "empresa") setFactura(true);
    }
  }, []);

  const { subtotal } = calcularTotales(items);
  const descuento = calcularDescuento(cupon, subtotal);
  const base = subtotal - descuento;
  const iva = base * 0.16;
  const envioCosto = base >= 800 ? 0 : 150;
  const total = base + iva + envioCosto;

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-3xl px-5 py-32 text-center">
        <p className={label}>Checkout</p>
        <h1 className="mt-3 font-display text-3xl font-extrabold">
          No hay nada que pagar
        </h1>
        <p className="mt-2 text-trace">Tu carrito está vacío.</p>
        <Link
          to="/catalogo"
          className="mt-6 inline-block rounded-sm bg-ink px-6 py-3 font-mono text-xs uppercase tracking-wider text-board hover:bg-ink-soft"
        >
          Ver catálogo
        </Link>
      </section>
    );
  }

  function cambiarEnvio(e) {
    setEnvio({ ...envio, [e.target.name]: e.target.value });
  }

  function cambiarPago(e) {
    setPago({ ...pago, [e.target.name]: e.target.value });
  }

  function finalizar() {
    const pedido = crearPedido({
      items: items.map((i) => ({
        id: i.id,
        nombre: i.nombre,
        cantidad: i.cantidad,
        unitario: precioUnitario(i),
      })),
      envio: { ...envio, nombre: envio.nombre || "Cliente de mostrador" },
      metodo,
      ultimos4: pago.tarjeta.slice(-4) || "0000",
      factura,
      cupon: cupon ? { codigo: cupon.codigo, descuento } : null,
      subtotal,
      descuento,
      iva,
      envioCosto,
      total,
    });

    vaciarCarrito();
    quitarCupon();
    navigate(`/confirmacion/${pedido.folio}`);
  }

  return (
    <section className="mx-auto max-w-5xl px-5 pt-16 pb-24">
      <p className={label}>Checkout</p>
      <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight">
        Finaliza tu pedido
      </h1>

      {/* Indicador de pasos */}
      <ol className="mt-10 grid gap-px overflow-hidden rounded-sm bg-ink/10 sm:grid-cols-3">
        {pasos.map((nombre, i) => {
          const activo = i === paso;
          const hecho = i < paso;
          return (
            <li
              key={nombre}
              className={`flex items-center gap-3 p-4 transition-colors ${
                activo ? "bg-ink text-board" : "bg-white"
              }`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-xs ${
                  hecho
                    ? "bg-band-green text-board"
                    : activo
                      ? "bg-board text-ink"
                      : "bg-ink/10 text-trace"
                }`}
              >
                {hecho ? "✓" : i + 1}
              </span>
              <span
                className={`font-mono text-xs uppercase tracking-wider ${
                  activo ? "text-board" : hecho ? "text-ink" : "text-trace"
                }`}
              >
                {nombre}
              </span>
            </li>
          );
        })}
      </ol>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <div>
          {/* PASO 1 */}
          {paso === 0 && (
            <div className="rounded-sm border border-ink/15 bg-white p-6">
              <h2 className="font-display text-2xl font-extrabold">
                Dirección de envío
              </h2>

              <div className="mt-6 grid gap-4">
                <div>
                  <label htmlFor="nombre" className={label}>Nombre de quien recibe</label>
                  <input id="nombre" name="nombre" value={envio.nombre} onChange={cambiarEnvio} placeholder="Ana Martínez" className={input} />
                </div>

                <div>
                  <label htmlFor="calle" className={label}>Calle y número</label>
                  <input id="calle" name="calle" value={envio.calle} onChange={cambiarEnvio} placeholder="Av. Convención 1420" className={input} />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="colonia" className={label}>Colonia</label>
                    <input id="colonia" name="colonia" value={envio.colonia} onChange={cambiarEnvio} placeholder="Circunvalación Norte" className={input} />
                  </div>
                  <div>
                    <label htmlFor="cp" className={label}>Código postal</label>
                    <input id="cp" name="cp" value={envio.cp} onChange={cambiarEnvio} placeholder="20020" className={input} />
                  </div>
                  <div>
                    <label htmlFor="ciudad" className={label}>Ciudad</label>
                    <input id="ciudad" name="ciudad" value={envio.ciudad} onChange={cambiarEnvio} className={input} />
                  </div>
                  <div>
                    <label htmlFor="telefono" className={label}>Teléfono</label>
                    <input id="telefono" name="telefono" value={envio.telefono} onChange={cambiarEnvio} placeholder="449 123 4567" className={input} />
                  </div>
                </div>
              </div>

              {/* Facturación */}
              <label className="mt-8 flex items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={factura}
                  onChange={(e) => setFactura(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-ink"
                />
                <span>Necesito factura (CFDI)</span>
              </label>

              {factura && (
                <div className="mt-5 grid gap-4 rounded-sm border border-band-violet/30 bg-band-violet/5 p-5">
                  <p className="font-mono text-xs uppercase tracking-widest text-band-violet">
                    Datos fiscales
                  </p>
                  <div>
                    <label htmlFor="razonSocial" className={label}>Razón social</label>
                    <input id="razonSocial" name="razonSocial" value={envio.razonSocial} onChange={cambiarEnvio} placeholder="Automatización del Bajío S.A. de C.V." className={input} />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="rfc" className={label}>RFC</label>
                      <input id="rfc" name="rfc" value={envio.rfc} onChange={cambiarEnvio} placeholder="ABC010203XY9" className={`${input} uppercase`} />
                    </div>
                    <div>
                      <label htmlFor="usoCfdi" className={label}>Uso de CFDI</label>
                      <select id="usoCfdi" name="usoCfdi" value={envio.usoCfdi} onChange={cambiarEnvio} className={input}>
                        <option>G01 · Adquisición de mercancías</option>
                        <option>G03 · Gastos en general</option>
                        <option>I04 · Equipo de cómputo</option>
                        <option>P01 · Por definir</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PASO 2 */}
          {paso === 1 && (
            <div className="rounded-sm border border-ink/15 bg-white p-6">
              <h2 className="font-display text-2xl font-extrabold">
                ¿Cómo quieres pagar?
              </h2>

              <div className="mt-6 grid gap-3">
                {metodos.map((m) => {
                  const activo = metodo === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMetodo(m.id)}
                      className={`rounded-sm border-2 p-4 text-left transition-colors ${
                        activo ? `${m.color} bg-board/50` : "border-ink/15 hover:border-ink/40"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`h-4 w-4 shrink-0 rounded-full border-2 ${
                            activo ? "border-ink bg-ink" : "border-ink/30"
                          }`}
                        />
                        <span>
                          <span className="block font-display text-lg font-bold">
                            {m.nombre}
                          </span>
                          <span className="font-mono text-xs text-trace">
                            {m.detalle}
                          </span>
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Formulario de tarjeta */}
              {metodo === "tarjeta" && (
                <div className="mt-6 grid gap-4 rounded-sm bg-board/60 p-5">
                  <p className="font-mono text-xs uppercase tracking-widest text-trace">
                    Datos de la tarjeta
                  </p>
                  <div>
                    <label htmlFor="titular" className={label}>Nombre del titular</label>
                    <input id="titular" name="titular" value={pago.titular} onChange={cambiarPago} placeholder="ANA MARTINEZ" className={`${input} uppercase`} />
                  </div>
                  <div>
                    <label htmlFor="tarjeta" className={label}>Número de tarjeta</label>
                    <input id="tarjeta" name="tarjeta" value={pago.tarjeta} onChange={cambiarPago} placeholder="4242 4242 4242 4242" className={`${input} font-mono`} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="vence" className={label}>Vence</label>
                      <input id="vence" name="vence" value={pago.vence} onChange={cambiarPago} placeholder="MM/AA" className={`${input} font-mono`} />
                    </div>
                    <div>
                      <label htmlFor="cvv" className={label}>CVV</label>
                      <input id="cvv" name="cvv" value={pago.cvv} onChange={cambiarPago} placeholder="123" className={`${input} font-mono`} />
                    </div>
                  </div>
                  <p className="font-mono text-xs leading-relaxed text-trace">
                    Pasarela simulada. No se procesa ningún cargo real ni se
                    almacena información bancaria.
                  </p>
                </div>
              )}

              {metodo === "spei" && (
                <div className="mt-6 rounded-sm bg-board/60 p-5">
                  <p className="font-mono text-xs uppercase tracking-widest text-trace">
                    Datos para transferencia
                  </p>
                  <dl className="mt-3 grid gap-2 font-mono text-sm">
                    <div className="flex justify-between"><dt className="text-trace">Banco</dt><dd>BBVA México</dd></div>
                    <div className="flex justify-between"><dt className="text-trace">Beneficiario</dt><dd>Nexus Componentes</dd></div>
                    <div className="flex justify-between"><dt className="text-trace">CLABE</dt><dd className="tabular-nums">012 914 00123456789 0</dd></div>
                  </dl>
                  <p className="mt-4 font-mono text-xs leading-relaxed text-trace">
                    Datos de ejemplo. Al confirmar recibirás la referencia del
                    pedido para incluirla en el concepto.
                  </p>
                </div>
              )}

              {metodo === "wallet" && (
                <div className="mt-6 rounded-sm bg-board/60 p-5">
                  <div className="flex items-baseline justify-between">
                    <p className="font-mono text-xs uppercase tracking-widest text-trace">
                      Saldo disponible
                    </p>
                    <p className="font-display text-2xl font-extrabold tabular-nums">
                      $1,250.00
                    </p>
                  </div>
                  <div className="mt-3 flex items-baseline justify-between border-t border-ink/10 pt-3">
                    <p className="font-mono text-xs uppercase tracking-widest text-trace">
                      Después de este pedido
                    </p>
                    <p
                      className={`font-mono text-sm tabular-nums ${
                        1250 - total < 0 ? "text-band-red" : "text-band-green"
                      }`}
                    >
                      {pesos(1250 - total)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PASO 3 */}
          {paso === 2 && (
            <div className="grid gap-6">
              <div className="rounded-sm border border-ink/15 bg-white p-6">
                <h2 className="font-display text-2xl font-extrabold">
                  Revisa antes de confirmar
                </h2>

                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className={label}>Se envía a</p>
                    <p className="mt-2 text-sm leading-relaxed text-ink/80">
                      {envio.nombre || "Cliente de mostrador"}
                      <br />
                      {envio.calle || "Dirección por confirmar"}
                      <br />
                      {envio.colonia && `${envio.colonia}, `}
                      {envio.ciudad} {envio.cp}
                      {envio.telefono && (
                        <>
                          <br />
                          Tel. {envio.telefono}
                        </>
                      )}
                    </p>
                  </div>

                  <div>
                    <p className={label}>Pago</p>
                    <p className="mt-2 text-sm leading-relaxed text-ink/80">
                      {metodos.find((m) => m.id === metodo)?.nombre}
                      {metodo === "tarjeta" && pago.tarjeta && (
                        <>
                          <br />
                          Terminada en {pago.tarjeta.slice(-4)}
                        </>
                      )}
                    </p>

                    {factura && (
                      <>
                        <p className={`${label} mt-5`}>Factura</p>
                        <p className="mt-2 text-sm leading-relaxed text-ink/80">
                          {envio.razonSocial || "Razón social por confirmar"}
                          <br />
                          <span className="font-mono uppercase">
                            {envio.rfc || "RFC pendiente"}
                          </span>
                          <br />
                          {envio.usoCfdi}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-sm border border-ink/15 bg-white p-6">
                <p className={label}>Artículos</p>
                <ul className="mt-4 divide-y divide-ink/10">
                  {items.map((i) => (
                    <li key={i.id} className="flex justify-between gap-4 py-3">
                      <span className="text-sm">
                        {i.nombre}
                        <span className="block font-mono text-xs text-trace">
                          {i.cantidad} × {pesos(precioUnitario(i))}
                        </span>
                      </span>
                      <span className="font-mono text-sm tabular-nums">
                        {pesos(precioUnitario(i) * i.cantidad)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Navegación */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            {paso > 0 ? (
              <button
                onClick={() => setPaso(paso - 1)}
                className="rounded-sm border border-ink/25 px-6 py-3 font-mono text-xs uppercase tracking-wider hover:border-ink"
              >
                ← Regresar
              </button>
            ) : (
              <Link
                to="/carrito"
                className="font-mono text-xs uppercase tracking-wider text-trace hover:text-ink"
              >
                ← Volver al carrito
              </Link>
            )}

            {paso < 2 ? (
              <button
                onClick={() => setPaso(paso + 1)}
                className="rounded-sm bg-ink px-8 py-3 font-mono text-xs uppercase tracking-wider text-board hover:bg-ink-soft"
              >
                Continuar
              </button>
            ) : (
              <button
                onClick={finalizar}
                className="rounded-sm bg-band-green px-8 py-3 font-mono text-xs uppercase tracking-wider text-board hover:opacity-90"
              >
                Confirmar y pagar {pesos(total)}
              </button>
            )}
          </div>
        </div>

        {/* Resumen lateral */}
        <aside className="h-fit rounded-sm border border-ink/15 bg-white p-6 lg:sticky lg:top-24">
          <p className={label}>Tu pedido</p>
          <p className="mt-1 font-mono text-xs text-trace">
            {items.length} {items.length === 1 ? "clave" : "claves"}
          </p>

          <dl className="mt-5 grid gap-3 border-y border-ink/10 py-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-trace">Subtotal</dt>
              <dd className="font-mono tabular-nums">{pesos(subtotal)}</dd>
            </div>
            {descuento > 0 && (
              <div className="flex justify-between text-band-green">
                <dt className="font-mono text-xs">{cupon.codigo}</dt>
                <dd className="font-mono tabular-nums">−{pesos(descuento)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-trace">IVA (16%)</dt>
              <dd className="font-mono tabular-nums">{pesos(iva)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-trace">Envío</dt>
              <dd className="font-mono tabular-nums">
                {envioCosto === 0 ? (
                  <span className="text-band-green">Gratis</span>
                ) : (
                  pesos(envioCosto)
                )}
              </dd>
            </div>
          </dl>

          <div className="mt-4 flex items-baseline justify-between">
            <span className={label}>Total</span>
            <span className="font-display text-3xl font-extrabold tabular-nums">
              {pesos(total)}
            </span>
          </div>

          {envioCosto > 0 && (
            <p className="mt-4 rounded-sm bg-band-gold/10 px-3 py-2 font-mono text-xs text-band-gold">
              Agrega {pesos(800 - base)} más y el envío es gratis.
            </p>
          )}
        </aside>
      </div>
    </section>
  );
}