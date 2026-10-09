import { useState, useEffect } from "react";
import {
  leerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  restaurarCatalogo,
} from "../../store/catalogo";
import { categorias } from "../../data/productos";
import Toast from "../../components/Toast";

const label = "font-mono text-xs uppercase tracking-widest text-trace";
const input =
  "mt-1 w-full rounded-sm border border-ink/20 bg-white px-3 py-2 text-sm outline-none focus:border-ink";

const vacio = {
  nombre: "",
  categoria: "Embebidos",
  precio: 0,
  precioMayoreo: 0,
  minMayoreo: 50,
  stock: 0,
  resumen: "",
};

export default function Productos() {
  const [lista, setLista] = useState([]);
  const [editando, setEditando] = useState(null); // null | "nuevo" | id
  const [form, setForm] = useState(vacio);
  const [borrando, setBorrando] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    setLista(leerProductos());
  }, []);

  function abrirNuevo() {
    setForm(vacio);
    setEditando("nuevo");
  }

  function abrirEditar(p) {
    setForm({
      nombre: p.nombre,
      categoria: p.categoria,
      precio: p.precio,
      precioMayoreo: p.precioMayoreo,
      minMayoreo: p.minMayoreo,
      stock: p.stock,
      resumen: p.resumen,
      etiqueta: p.etiqueta || "",
    });
    setEditando(p.id);
  }

  function cambiar(e) {
    const { name, value, type } = e.target;
    setForm({ ...form, [name]: type === "number" ? Number(value) : value });
  }

  function guardar(e) {
    e.preventDefault();
    const datos = { ...form, nombre: form.nombre || "Clave sin nombre" };

    if (editando === "nuevo") {
      setLista(crearProducto(datos));
      setToast("Producto agregado (simulado)");
    } else {
      setLista(actualizarProducto(editando, datos));
      setToast("Producto actualizado (simulado)");
    }
    setEditando(null);
  }

  function confirmarBorrado() {
    setLista(eliminarProducto(borrando.id));
    setToast("Producto eliminado (simulado)");
    setBorrando(null);
  }

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className={label}>Gestión de productos</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight">
            {lista.length} claves en catálogo
          </h1>
        </div>
        <button
          onClick={abrirNuevo}
          className="rounded-sm bg-ink px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-board hover:bg-ink-soft"
        >
          + Agregar producto
        </button>
      </div>

      {/* Tabla */}
      <div className="mt-8 overflow-x-auto rounded-sm border border-ink/15 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-left">
              <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-trace">Clave</th>
              <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-trace">Categoría</th>
              <th className="px-4 py-3 text-right font-mono text-xs uppercase tracking-wider text-trace">Menudeo</th>
              <th className="px-4 py-3 text-right font-mono text-xs uppercase tracking-wider text-trace">Mayoreo</th>
              <th className="px-4 py-3 text-right font-mono text-xs uppercase tracking-wider text-trace">Stock</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {lista.map((p) => (
              <tr key={p.id} className="border-b border-ink/5 last:border-0">
                <td className="px-4 py-3 font-medium">{p.nombre}</td>
                <td className="px-4 py-3 font-mono text-xs text-trace">{p.categoria}</td>
                <td className="px-4 py-3 text-right font-mono tabular-nums">${p.precio}</td>
                <td className="px-4 py-3 text-right font-mono tabular-nums">${p.precioMayoreo}</td>
                <td className="px-4 py-3 text-right font-mono tabular-nums">
                  <span className={p.stock < 60 ? "text-band-red" : ""}>{p.stock}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => abrirEditar(p)}
                      className="font-mono text-xs uppercase tracking-wider text-trace hover:text-ink"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => setBorrando(p)}
                      className="font-mono text-xs uppercase tracking-wider text-trace hover:text-band-red"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={() => {
          setLista(restaurarCatalogo());
          setToast("Catálogo restaurado");
        }}
        className="mt-4 font-mono text-xs uppercase tracking-wider text-trace hover:text-ink"
      >
        Restaurar catálogo original
      </button>

      {/* Modal de formulario */}
      {editando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-5">
          <form
            onSubmit={guardar}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-sm bg-board p-6"
          >
            <h2 className="font-display text-2xl font-extrabold">
              {editando === "nuevo" ? "Agregar producto" : "Editar producto"}
            </h2>

            <div className="mt-6 grid gap-4">
              <div>
                <label htmlFor="nombre" className={label}>Nombre</label>
                <input id="nombre" name="nombre" value={form.nombre} onChange={cambiar} className={input} />
              </div>

              <div>
                <label htmlFor="categoria" className={label}>Categoría</label>
                <select id="categoria" name="categoria" value={form.categoria} onChange={cambiar} className={input}>
                  {categorias.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label htmlFor="resumen" className={label}>Descripción corta</label>
                <input id="resumen" name="resumen" value={form.resumen} onChange={cambiar} className={input} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="precio" className={label}>Precio menudeo</label>
                  <input id="precio" name="precio" type="number" value={form.precio} onChange={cambiar} className={input} />
                </div>
                <div>
                  <label htmlFor="precioMayoreo" className={label}>Precio mayoreo</label>
                  <input id="precioMayoreo" name="precioMayoreo" type="number" value={form.precioMayoreo} onChange={cambiar} className={input} />
                </div>
                <div>
                  <label htmlFor="minMayoreo" className={label}>Mínimo mayoreo</label>
                  <input id="minMayoreo" name="minMayoreo" type="number" value={form.minMayoreo} onChange={cambiar} className={input} />
                </div>
                <div>
                  <label htmlFor="stock" className={label}>Existencia</label>
                  <input id="stock" name="stock" type="number" value={form.stock} onChange={cambiar} className={input} />
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button type="submit" className="rounded-sm bg-ink px-6 py-3 font-mono text-xs uppercase tracking-wider text-board hover:bg-ink-soft">
                Guardar
              </button>
              <button type="button" onClick={() => setEditando(null)} className="rounded-sm border border-ink/25 px-6 py-3 font-mono text-xs uppercase tracking-wider hover:border-ink">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Confirmación de borrado */}
      {borrando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-5">
          <div className="w-full max-w-sm rounded-sm bg-board p-6">
            <h2 className="font-display text-xl font-extrabold">¿Seguro?</h2>
            <p className="mt-2 text-sm text-ink/70">
              Se eliminará <span className="font-semibold">{borrando.nombre}</span> del catálogo.
            </p>
            <div className="mt-6 flex gap-3">
              <button onClick={confirmarBorrado} className="rounded-sm bg-band-red px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-board hover:opacity-90">
                Sí, eliminar
              </button>
              <button onClick={() => setBorrando(null)} className="rounded-sm border border-ink/25 px-5 py-2.5 font-mono text-xs uppercase tracking-wider hover:border-ink">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast mensaje={toast} visible={!!toast} onCerrar={() => setToast("")} />
    </section>
  );
}