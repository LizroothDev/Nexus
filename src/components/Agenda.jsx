import { useState, useEffect } from "react";
import {
  leerDirecciones, guardarDireccion, eliminarDireccion, fijarDireccion,
  leerTarjetas, guardarTarjeta, eliminarTarjeta, fijarTarjeta, detectarMarca,
} from "../store/agenda";
import Toast from "./Toast";

const label = "font-mono text-xs uppercase tracking-widest text-trace";
const input =
  "mt-1 w-full rounded-sm border border-ink/20 bg-white px-3 py-2.5 text-sm outline-none focus:border-ink";
const MAX = 5;

const dirVacia = {
  alias: "", nombre: "", calle: "", colonia: "",
  ciudad: "Aguascalientes", cp: "", telefono: "",
};

const tarVacia = { alias: "", titular: "", numero: "", vence: "" };

const coloresMarca = {
  Visa: "bg-band-violet",
  Mastercard: "bg-band-red",
  "American Express": "bg-band-green",
  Discover: "bg-band-gold",
  Tarjeta: "bg-trace",
};

export default function Agenda() {
  const [vista, setVista] = useState("direcciones");
  const [direcciones, setDirecciones] = useState([]);
  const [tarjetas, setTarjetas] = useState([]);
  const [formDir, setFormDir] = useState(dirVacia);
  const [formTar, setFormTar] = useState(tarVacia);
  const [editandoDir, setEditandoDir] = useState(null);
  const [abierto, setAbierto] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    setDirecciones(leerDirecciones());
    setTarjetas(leerTarjetas());
  }, []);

  const lleno =
    vista === "direcciones" ? direcciones.length >= MAX : tarjetas.length >= MAX;

  function enviarDireccion(e) {
    e.preventDefault();
    setDirecciones(
      guardarDireccion(
        { ...formDir, alias: formDir.alias || "Dirección" },
        editandoDir
      )
    );
    setFormDir(dirVacia);
    setEditandoDir(null);
    setAbierto(false);
    setToast(editandoDir ? "Dirección actualizada" : "Dirección guardada");
  }

  function enviarTarjeta(e) {
    e.preventDefault();
    setTarjetas(guardarTarjeta(formTar));
    setFormTar(tarVacia);
    setAbierto(false);
    setToast("Tarjeta guardada (simulado)");
  }

  function editarDireccion(d) {
    setFormDir({
      alias: d.alias, nombre: d.nombre, calle: d.calle,
      colonia: d.colonia, ciudad: d.ciudad, cp: d.cp, telefono: d.telefono,
    });
    setEditandoDir(d.id);
    setAbierto(true);
  }

  return (
    <div className="mt-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className={label}>Agenda</p>
          <h2 className="mt-2 font-display text-2xl font-extrabold">
            Direcciones y métodos de pago
          </h2>
        </div>

        <div className="flex gap-2">
          {[
            ["direcciones", `Direcciones (${direcciones.length}/${MAX})`],
            ["tarjetas", `Tarjetas (${tarjetas.length}/${MAX})`],
          ].map(([id, nombre]) => (
            <button
              key={id}
              onClick={() => {
                setVista(id);
                setAbierto(false);
                setEditandoDir(null);
              }}
              className={`rounded-sm px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors ${
                vista === id ? "bg-ink text-board" : "border border-ink/20 hover:border-ink"
              }`}
            >
              {nombre}
            </button>
          ))}
        </div>
      </div>

      {/* DIRECCIONES */}
      {vista === "direcciones" && (
        <div className="mt-6 grid gap-4">
          {direcciones.length === 0 && !abierto && (
            <div className="rounded-sm border border-dashed border-ink/25 bg-white p-8 text-center">
              <p className="font-display text-lg font-bold">Sin direcciones guardadas</p>
              <p className="mt-1 text-sm text-trace">
                Guarda hasta {MAX} para no escribirlas en cada compra.
              </p>
            </div>
          )}

          {direcciones.map((d) => (
            <article
              key={d.id}
              className={`rounded-sm border bg-white p-5 transition-colors ${
                d.predeterminado ? "border-band-green" : "border-ink/15"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-display text-lg font-bold">{d.alias}</p>
                    {d.predeterminado && (
                      <span className="rounded-sm bg-band-green/10 px-2 py-0.5 font-mono text-xs text-band-green">
                        Predeterminada
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-ink/75">
                    {d.nombre}
                    <br />
                    {d.calle}
                    {d.colonia && `, ${d.colonia}`}
                    <br />
                    {d.ciudad} {d.cp}
                    {d.telefono && ` · Tel. ${d.telefono}`}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  {!d.predeterminado && (
                    <button
                      onClick={() => {
                        setDirecciones(fijarDireccion(d.id));
                        setToast("Dirección predeterminada actualizada");
                      }}
                      className="font-mono text-xs uppercase tracking-wider text-trace hover:text-band-green"
                    >
                      Usar por defecto
                    </button>
                  )}
                  <button
                    onClick={() => editarDireccion(d)}
                    className="font-mono text-xs uppercase tracking-wider text-trace hover:text-ink"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      setDirecciones(eliminarDireccion(d.id));
                      setToast("Dirección eliminada");
                    }}
                    className="font-mono text-xs uppercase tracking-wider text-trace hover:text-band-red"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </article>
          ))}

          {abierto ? (
            <form onSubmit={enviarDireccion} className="rounded-sm border border-ink/15 bg-white p-6">
              <h3 className="font-display text-xl font-extrabold">
                {editandoDir ? "Editar dirección" : "Nueva dirección"}
              </h3>

              <div className="mt-5 grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="alias" className={label}>Nombre corto</label>
                    <input id="alias" value={formDir.alias}
                      onChange={(e) => setFormDir({ ...formDir, alias: e.target.value })}
                      placeholder="Casa, Escuela, Taller" className={input} />
                  </div>
                  <div>
                    <label htmlFor="dnombre" className={label}>Quien recibe</label>
                    <input id="dnombre" value={formDir.nombre}
                      onChange={(e) => setFormDir({ ...formDir, nombre: e.target.value })}
                      placeholder="Ana Martínez" className={input} />
                  </div>
                </div>

                <div>
                  <label htmlFor="dcalle" className={label}>Calle y número</label>
                  <input id="dcalle" value={formDir.calle}
                    onChange={(e) => setFormDir({ ...formDir, calle: e.target.value })}
                    placeholder="Av. Convención 1420" className={input} />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="dcolonia" className={label}>Colonia</label>
                    <input id="dcolonia" value={formDir.colonia}
                      onChange={(e) => setFormDir({ ...formDir, colonia: e.target.value })}
                      className={input} />
                  </div>
                  <div>
                    <label htmlFor="dcp" className={label}>Código postal</label>
                    <input id="dcp" value={formDir.cp}
                      onChange={(e) => setFormDir({ ...formDir, cp: e.target.value })}
                      placeholder="20020" className={input} />
                  </div>
                  <div>
                    <label htmlFor="dciudad" className={label}>Ciudad</label>
                    <input id="dciudad" value={formDir.ciudad}
                      onChange={(e) => setFormDir({ ...formDir, ciudad: e.target.value })}
                      className={input} />
                  </div>
                  <div>
                    <label htmlFor="dtel" className={label}>Teléfono</label>
                    <input id="dtel" value={formDir.telefono}
                      onChange={(e) => setFormDir({ ...formDir, telefono: e.target.value })}
                      placeholder="449 123 4567" className={input} />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button type="submit"
                  className="rounded-sm bg-ink px-6 py-3 font-mono text-xs uppercase tracking-wider text-board hover:bg-ink-soft">
                  Guardar
                </button>
                <button type="button"
                  onClick={() => { setAbierto(false); setEditandoDir(null); setFormDir(dirVacia); }}
                  className="rounded-sm border border-ink/25 px-6 py-3 font-mono text-xs uppercase tracking-wider hover:border-ink">
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setAbierto(true)}
              disabled={lleno}
              className="rounded-sm border border-dashed border-ink/30 bg-white px-5 py-4 font-mono text-xs uppercase tracking-wider text-trace transition-colors hover:border-ink hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
            >
              {lleno ? `Máximo ${MAX} direcciones` : "+ Agregar dirección"}
            </button>
          )}
        </div>
      )}

      {/* TARJETAS */}
      {vista === "tarjetas" && (
        <div className="mt-6 grid gap-4">
          {tarjetas.length === 0 && !abierto && (
            <div className="rounded-sm border border-dashed border-ink/25 bg-white p-8 text-center">
              <p className="font-display text-lg font-bold">Sin tarjetas guardadas</p>
              <p className="mt-1 text-sm text-trace">
                Solo se guardan los últimos cuatro dígitos.
              </p>
            </div>
          )}

          {tarjetas.map((t) => (
            <article
              key={t.id}
              className={`flex flex-wrap items-center justify-between gap-4 rounded-sm border bg-white p-5 ${
                t.predeterminado ? "border-band-green" : "border-ink/15"
              }`}
            >
              <div className="flex items-center gap-4">
                <span
                  className={`flex h-10 w-14 shrink-0 items-center justify-center rounded-sm font-mono text-xs font-semibold text-board ${coloresMarca[t.marca]}`}
                >
                  {t.marca === "American Express" ? "AMEX" : t.marca.slice(0, 4).toUpperCase()}
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-mono text-sm font-semibold tabular-nums">
                      •••• {t.ultimos4}
                    </p>
                    {t.alias && (
                      <span className="font-mono text-xs text-trace">{t.alias}</span>
                    )}
                    {t.predeterminado && (
                      <span className="rounded-sm bg-band-green/10 px-2 py-0.5 font-mono text-xs text-band-green">
                        Predeterminada
                      </span>
                    )}
                  </div>
                  <p className="font-mono text-xs text-trace">
                    {t.titular} · Vence {t.vence}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {!t.predeterminado && (
                  <button
                    onClick={() => {
                      setTarjetas(fijarTarjeta(t.id));
                      setToast("Tarjeta predeterminada actualizada");
                    }}
                    className="font-mono text-xs uppercase tracking-wider text-trace hover:text-band-green"
                  >
                    Usar por defecto
                  </button>
                )}
                <button
                  onClick={() => {
                    setTarjetas(eliminarTarjeta(t.id));
                    setToast("Tarjeta eliminada");
                  }}
                  className="font-mono text-xs uppercase tracking-wider text-trace hover:text-band-red"
                >
                  Eliminar
                </button>
              </div>
            </article>
          ))}

          {abierto ? (
            <form onSubmit={enviarTarjeta} className="rounded-sm border border-ink/15 bg-white p-6">
              <h3 className="font-display text-xl font-extrabold">Nueva tarjeta</h3>

              <div className="mt-5 grid gap-4">
                <div>
                  <label htmlFor="tnumero" className={label}>Número de tarjeta</label>
                  <input id="tnumero" value={formTar.numero}
                    onChange={(e) => setFormTar({ ...formTar, numero: e.target.value })}
                    placeholder="4242 4242 4242 4242" className={`${input} font-mono`} />
                  {formTar.numero && (
                    <p className="mt-1 font-mono text-xs text-band-violet">
                      {detectarMarca(formTar.numero)}
                    </p>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="ttitular" className={label}>Titular</label>
                    <input id="ttitular" value={formTar.titular}
                      onChange={(e) => setFormTar({ ...formTar, titular: e.target.value })}
                      placeholder="ANA MARTINEZ" className={`${input} uppercase`} />
                  </div>
                  <div>
                    <label htmlFor="tvence" className={label}>Vence</label>
                    <input id="tvence" value={formTar.vence}
                      onChange={(e) => setFormTar({ ...formTar, vence: e.target.value })}
                      placeholder="MM/AA" className={`${input} font-mono`} />
                  </div>
                </div>

                <div>
                  <label htmlFor="talias" className={label}>Nombre corto</label>
                  <input id="talias" value={formTar.alias}
                    onChange={(e) => setFormTar({ ...formTar, alias: e.target.value })}
                    placeholder="Personal, Empresa" className={input} />
                </div>
              </div>

              <p className="mt-4 font-mono text-xs leading-relaxed text-trace">
                Simulación. Solo se almacenan los últimos cuatro dígitos; el número
                completo y el CVV nunca se guardan.
              </p>

              <div className="mt-6 flex gap-3">
                <button type="submit"
                  className="rounded-sm bg-ink px-6 py-3 font-mono text-xs uppercase tracking-wider text-board hover:bg-ink-soft">
                  Guardar tarjeta
                </button>
                <button type="button"
                  onClick={() => { setAbierto(false); setFormTar(tarVacia); }}
                  className="rounded-sm border border-ink/25 px-6 py-3 font-mono text-xs uppercase tracking-wider hover:border-ink">
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setAbierto(true)}
              disabled={lleno}
              className="rounded-sm border border-dashed border-ink/30 bg-white px-5 py-4 font-mono text-xs uppercase tracking-wider text-trace transition-colors hover:border-ink hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
            >
              {lleno ? `Máximo ${MAX} tarjetas` : "+ Agregar tarjeta"}
            </button>
          )}
        </div>
      )}

      <Toast mensaje={toast} visible={!!toast} onCerrar={() => setToast("")} />
    </div>
  );
}