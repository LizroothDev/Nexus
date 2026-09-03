import { useState } from "react";
import { Link } from "react-router-dom";

const escalones = [
  { min: 1, max: 9, precio: 189 },
  { min: 10, max: 49, precio: 162 },
  { min: 50, max: 199, precio: 134 },
  { min: 200, max: Infinity, precio: 118 },
];

const categorias = [
  { nombre: "Embebidos", ejemplo: "ESP32 · RP2040 · STM32", piezas: 48 },
  { nombre: "Sensores", ejemplo: "IMU · Temperatura · ToF", piezas: 63 },
  { nombre: "Pasivos", ejemplo: "Resistencias · Capacitores", piezas: 210 },
  { nombre: "Redes", ejemplo: "LoRa · Ethernet · RF", piezas: 27 },
];

export default function Inicio() {
  const [cantidad, setCantidad] = useState(1);

  const escalonActivo =
    escalones.find((e) => cantidad >= e.min && cantidad <= e.max) ?? escalones[0];
  const precioBase = escalones[0].precio;
  const ahorro = Math.round(
    ((precioBase - escalonActivo.precio) / precioBase) * 100
  );

  return (
    <>
      {/* HERO */}
      <section className="mx-auto max-w-6xl px-5 pt-16 pb-20">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-trace">
              Distribuidor · Aguascalientes
            </p>
            <h1 className="mt-4 font-display text-5xl leading-[0.95] font-extrabold tracking-tight sm:text-6xl">
              El componente
              <br />
              que ocupas
              <br />
              <span className="text-band-red">en un solo lugar.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink/70">
              Microcontroladores, sensores y hardware que normalmente esperarías
              tres semanas a que crucen la frontera. Compra una pieza para tu
              proyecto o doscientas para tu línea de producción.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/catalogo"
                className="rounded-sm bg-ink px-6 py-3 font-mono text-xs font-medium tracking-wider text-board uppercase transition-colors hover:bg-ink-soft"
              >
                Ver productos
              </Link>
              <Link
                to="/registro"
                className="rounded-sm border border-ink/25 px-6 py-3 font-mono text-xs font-medium tracking-wider uppercase transition-colors hover:border-ink"
              >
                Abrir cuenta mayoreo
              </Link>
            </div>
          </div>

          {/* Escala de precios */}
          <div className="rounded-sm border border-ink/15 bg-white p-6 shadow-sm">
            <div className="flex items-baseline justify-between">
              <p className="font-mono text-xs uppercase tracking-widest text-trace">
                Precio por volumen
              </p>
              <p className="font-mono text-xs text-trace">MXN</p>
            </div>

            <p className="mt-3 font-display text-lg font-bold">ESP32-WROOM-32</p>
            <p className="font-mono text-xs text-trace">
              Módulo Wi-Fi + BLE · 38 pines
            </p>

            <div className="mt-6 flex items-end gap-2">
              <span className="font-display text-5xl font-extrabold tabular-nums">
                ${escalonActivo.precio}
              </span>
              <span className="pb-2 font-mono text-xs text-trace">/ pieza</span>
              {ahorro > 0 && (
                <span className="mb-2 ml-auto rounded-sm bg-band-green/10 px-2 py-1 font-mono text-xs font-semibold text-band-green">
                  −{ahorro}%
                </span>
              )}
            </div>

            <label
              htmlFor="cantidad"
              className="mt-6 block font-mono text-xs uppercase tracking-widest text-trace"
            >
              Cantidad: <span className="text-ink">{cantidad}</span>
            </label>
            <input
              id="cantidad"
              type="range"
              min="1"
              max="300"
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
              className="mt-3 w-full accent-band-red"
            />

            <ul className="mt-6 divide-y divide-ink/10 border-t border-ink/10">
              {escalones.map((e) => {
                const activo = e === escalonActivo;
                return (
                  <li
                    key={e.min}
                    className={`flex justify-between px-2 py-2 font-mono text-sm transition-colors ${
                      activo ? "bg-ink text-board" : "text-trace"
                    }`}
                  >
                    <span>
                      {e.max === Infinity ? `${e.min}+` : `${e.min} – ${e.max}`} pz
                    </span>
                    <span className="tabular-nums">${e.precio}</span>
                  </li>
                );
              })}
            </ul>

            <p className="mt-4 font-mono text-xs leading-relaxed text-trace">
              El descuento se aplica solo al llegar al escalón. No hay mínimo de
              compra.
            </p>
          </div>
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section className="border-y border-ink/10 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <p className="font-mono text-xs uppercase tracking-widest text-trace">
            Existencia local
          </p>
          <div className="mt-6 grid gap-px overflow-hidden rounded-sm bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
            {categorias.map((c) => (
              <Link
                key={c.nombre}
                to="/catalogo"
                className="group bg-white p-5 transition-colors hover:bg-board"
              >
                <p className="font-display text-xl font-bold">{c.nombre}</p>
                <p className="mt-1 font-mono text-xs text-trace">{c.ejemplo}</p>
                <p className="mt-4 font-mono text-xs text-trace">
                  <span className="tabular-nums text-ink">{c.piezas}</span> claves
                  disponibles
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PROPUESTA DE VALOR */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-band-red">
              Entrega
            </p>
            <p className="mt-3 font-display text-2xl font-bold">
              48 horas, no 3 semanas
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink/70">
              Inventario en Aguascalientes. Lo que ves en catálogo está físicamente
              en el almacén, no en tránsito desde Shenzhen.
            </p>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-band-violet">
              Documentación
            </p>
            <p className="mt-3 font-display text-2xl font-bold">
              Datasheet en cada clave
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink/70">
              Voltajes, encapsulado, tolerancias y pinout. Lo que necesitas para
              saber si la pieza sirve antes de comprarla.
            </p>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-band-gold">
              Facturación
            </p>
            <p className="mt-3 font-display text-2xl font-bold">
              CFDI para tu empresa
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink/70">
              Cuenta empresarial con crédito, precios de mayoreo automáticos y
              factura desglosada en cada pedido.
            </p>
          </div>
        </div>
      </section>

      {/* CIERRE */}
      <section className="bg-ink text-board">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-5 py-16 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-3xl font-extrabold">
              ¿Compras para un laboratorio o una empresa?
            </h2>
            <p className="mt-2 text-board/70">
              Abre cuenta de mayoreo y accede a precios por volumen desde la
              primera compra.
            </p>
          </div>
          <Link
            to="/registro"
            className="shrink-0 rounded-sm bg-board px-6 py-3 font-mono text-xs font-medium tracking-wider text-ink uppercase transition-opacity hover:opacity-90"
          >
            Crear cuenta
          </Link>
        </div>
      </section>
    </>
  );
}