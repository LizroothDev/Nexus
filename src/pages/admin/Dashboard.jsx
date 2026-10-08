import { leerProductos } from "../../store/catalogo";

const label = "font-mono text-xs uppercase tracking-widest text-trace";
const pesos = (n) =>
  n.toLocaleString("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });

const pedidosRecientes = [
  { folio: "NX-2041", cliente: "Automatización del Bajío", piezas: 120, monto: 18420, estado: "Pendiente" },
  { folio: "NX-2040", cliente: "Diego Ramírez", piezas: 3, monto: 486, estado: "Enviado" },
  { folio: "NX-2039", cliente: "ITA · Lab. Mecatrónica", piezas: 60, monto: 9340, estado: "Pendiente" },
  { folio: "NX-2038", cliente: "Samuel Ortiz", piezas: 8, monto: 1215, estado: "Entregado" },
  { folio: "NX-2037", cliente: "Robótica Aguascalientes", piezas: 200, monto: 26800, estado: "Entregado" },
];

const colorEstado = {
  Pendiente: "bg-band-gold/15 text-band-gold",
  Enviado: "bg-band-violet/15 text-band-violet",
  Entregado: "bg-band-green/15 text-band-green",
};

const ventasMes = [
  ["Abr", 62], ["May", 78], ["Jun", 54],
  ["Jul", 88], ["Ago", 96], ["Sep", 71],
];

export default function Dashboard() {
  const productos = leerProductos();

  const sinStock = productos.filter((p) => p.stock < 60);
  const valorInventario = productos.reduce((s, p) => s + p.precio * p.stock, 0);
  const pendientes = pedidosRecientes.filter((p) => p.estado === "Pendiente").length;
  const maxVenta = Math.max(...ventasMes.map(([, v]) => v));

  const metricas = [
    { titulo: "Ventas del mes", valor: pesos(184300), nota: "+12% vs agosto", color: "text-band-green" },
    { titulo: "Pedidos pendientes", valor: pendientes, nota: "Por surtir hoy", color: "text-band-gold" },
    { titulo: "Claves con stock bajo", valor: sinStock.length, nota: "Menos de 60 pz", color: "text-band-red" },
    { titulo: "Valor de inventario", valor: pesos(valorInventario), nota: `${productos.length} claves activas`, color: "text-trace" },
  ];

  return (
    <section>
      <p className={label}>Resumen</p>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight">
        Panel de control
      </h1>

      {/* Métricas */}
      <div className="mt-8 grid gap-px bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
        {metricas.map((m) => (
          <div key={m.titulo} className="bg-white p-5">
            <p className={label}>{m.titulo}</p>
            <p className="mt-2 font-display text-3xl font-extrabold tabular-nums">
              {m.valor}
            </p>
            <p className={`mt-1 font-mono text-xs ${m.color}`}>{m.nota}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        {/* Pedidos */}
        <div>
          <p className={label}>Pedidos recientes</p>
          <div className="mt-4 overflow-x-auto rounded-sm border border-ink/15 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink/10 text-left">
                  <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-trace">Folio</th>
                  <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-trace">Cliente</th>
                  <th className="px-4 py-3 text-right font-mono text-xs uppercase tracking-wider text-trace">Pz</th>
                  <th className="px-4 py-3 text-right font-mono text-xs uppercase tracking-wider text-trace">Monto</th>
                  <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-trace">Estado</th>
                </tr>
              </thead>
              <tbody>
                {pedidosRecientes.map((p) => (
                  <tr key={p.folio} className="border-b border-ink/5 last:border-0">
                    <td className="px-4 py-3 font-mono text-xs">{p.folio}</td>
                    <td className="px-4 py-3">{p.cliente}</td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums">{p.piezas}</td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums">{pesos(p.monto)}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-sm px-2 py-1 font-mono text-xs ${colorEstado[p.estado]}`}>
                        {p.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Gráfica */}
        <div>
          <p className={label}>Ventas por mes (miles)</p>
          <div className="mt-4 rounded-sm border border-ink/15 bg-white p-5">
            <div className="flex h-44 items-end gap-3">
              {ventasMes.map(([mes, valor]) => (
                <div key={mes} className="flex flex-1 flex-col items-center gap-2">
                  <span className="font-mono text-xs tabular-nums text-trace">{valor}</span>
                  <div
                    className="w-full rounded-t-sm bg-band-violet"
                    style={{ height: `${(valor / maxVenta) * 100}%` }}
                  />
                  <span className="font-mono text-xs text-trace">{mes}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stock bajo */}
          <p className={`${label} mt-8`}>Requieren resurtido</p>
          {sinStock.length === 0 ? (
            <p className="mt-4 rounded-sm border border-ink/15 bg-white p-4 text-sm text-trace">
              Todas las claves tienen existencia suficiente.
            </p>
          ) : (
            <ul className="mt-4 rounded-sm border border-ink/15 bg-white">
              {sinStock.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between gap-3 border-b border-ink/5 px-4 py-3 last:border-0"
                >
                  <span className="text-sm">{p.nombre}</span>
                  <span className="font-mono text-xs tabular-nums text-band-red">
                    {p.stock} pz
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}