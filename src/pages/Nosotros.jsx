const publicos = [
  {
    color: "bg-band-red",
    titulo: "Estudiantes",
    texto:
      "Compras de una o dos piezas para el proyecto de la materia, sin mínimo de compra y sin pagar envío de importación.",
  },
  {
    color: "bg-band-violet",
    titulo: "Makers",
    texto:
      "Claves específicas que no encuentras en tiendas generales: encapsulados raros, sensores de nicho, módulos RF.",
  },
  {
    color: "bg-band-green",
    titulo: "Empresas y laboratorios",
    texto:
      "Precio por volumen automático, cuenta con crédito y factura CFDI desglosada en cada pedido.",
  },
];

const horarios = [
  { dia: "Lunes a viernes", hora: "9:00 – 19:00" },
  { dia: "Sábado", hora: "10:00 – 14:00" },
  { dia: "Domingo", hora: "Cerrado" },
];

export default function Nosotros() {
  return (
    <>
      {/* Encabezado */}
      <section className="mx-auto max-w-6xl px-5 pt-16 pb-12">
        <p className="font-mono text-xs uppercase tracking-widest text-trace">
          Nosotros
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          Nació de tener que esperar tres semanas por un sensor de doscientos pesos.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink/70">
          Nexus abrió en 2024 en Aguascalientes, después de que sus fundadores
          pasaran la carrera pidiendo componentes a proveedores extranjeros y
          perdiendo semanas de proyecto en aduana. La idea fue simple: tener
          físicamente en la ciudad las claves que todo mundo termina necesitando.
        </p>
      </section>

      {/* Misión y visión */}
      <section className="border-y border-ink/10 bg-white">
        <div className="mx-auto grid max-w-6xl gap-px bg-ink/10 sm:grid-cols-2">
          <div className="bg-white p-8 sm:p-10">
            <p className="font-mono text-xs uppercase tracking-widest text-band-red">
              Misión
            </p>
            <p className="mt-4 text-lg leading-relaxed">
              Acortar la distancia entre una idea y el componente que la hace
              funcionar, con inventario local, información técnica completa y
              precios que escalan con el volumen.
            </p>
          </div>
          <div className="bg-white p-8 sm:p-10">
            <p className="font-mono text-xs uppercase tracking-widest text-band-violet">
              Visión
            </p>
            <p className="mt-4 text-lg leading-relaxed">
              Ser el proveedor de referencia de electrónica en el Bajío, donde una
              escuela, un taller y una línea de producción compren en el mismo
              lugar sin importar el tamaño del pedido.
            </p>
          </div>
        </div>
      </section>

      {/* Para quién */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <p className="font-mono text-xs uppercase tracking-widest text-trace">
          Para quién
        </p>
        <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight">
          Tres tipos de cliente, un solo catálogo
        </h2>

        <div className="mt-10 grid gap-10 sm:grid-cols-3">
          {publicos.map((p) => (
            <div key={p.titulo}>
              <div className={`h-1 w-10 rounded-sm ${p.color}`} />
              <h3 className="mt-4 font-display text-2xl font-bold">{p.titulo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{p.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Datos de la sucursal */}
      <section className="border-t border-ink/10 bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:grid-cols-2">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-trace">
              Sucursal
            </p>
            <address className="mt-4 space-y-1 text-lg not-italic leading-relaxed">
              <p className="font-semibold">Nexus Componentes</p>
              <p className="text-ink/70">Av. Convención de 1914 Nte. 1420</p>
              <p className="text-ink/70">Col. Circunvalación Norte</p>
              <p className="text-ink/70">Aguascalientes, Ags. · C.P. 20020</p>
            </address>
            <p className="mt-4 font-mono text-sm text-trace">
              449 123 4567 · hola@nexus.mx
            </p>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-trace">
              Horarios
            </p>
            <ul className="mt-4 divide-y divide-ink/10 border-y border-ink/10">
              {horarios.map((h) => (
                <li
                  key={h.dia}
                  className="flex justify-between py-3 font-mono text-sm"
                >
                  <span>{h.dia}</span>
                  <span className="text-trace">{h.hora}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-ink/70">
              Pedidos en línea se surten el mismo día si entran antes de las 16:00.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}