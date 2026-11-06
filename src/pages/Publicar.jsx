import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  leerPublicaciones,
  publicar,
  actualizarPublicacion,
  eliminarPublicacion,
} from "../store/publicaciones";
import { leerSesion } from "../store/sesion";
import { categorias } from "../data/productos";
import ImagenProducto from "../components/ImagenProducto";
import Toast from "../components/Toast";

const label = "font-mono text-xs uppercase tracking-widest text-trace";
const input =
  "mt-1 w-full rounded-sm border border-ink/20 bg-white px-3 py-2.5 text-sm outline-none focus:border-ink";

const vacio = {
  nombre: "",
  categoria: "Embebidos",
  precio: 0,
  cantidad: 1,
  condicion: "Nuevo",
  descripcion: "",
};

export default function Publicar() {
  const [form, setForm] = useState(vacio);
  const [lista, setLista] = useState([]);
  const [editando, setEditando] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    setLista(leerPublicaciones());
  }, []);

  function cambiar(e) {
    const { name, value, type } = e.target;
    setForm({ ...form, [name]: type === "number" ? Number(value) : value });
  }

  function enviar(e) {
    e.preventDefault();
    const datos = { ...form, nombre: form.nombre || "Componente sin nombre" };

    if (editando) {
      setLista(actualizarPublicacion(editando, datos));
      setToast("Publicación actualizada (simulado)");
      setEditando(null);
    } else {
      const sesion = leerSesion();
      setLista(publicar(datos, sesion?.nombre));
      setToast("Publicado (simulado)");
    }
    setForm(vacio);
  }

  function editar(p) {
    setForm({
      nombre: p.nombre,
      categoria: p.categoria,
      precio: p.precio,
      cantidad: p.cantidad,
      condicion: p.condicion,
      descripcion: p.descripcion,
    });
    setEditando(p.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function borrar(id) {
    setLista(eliminarPublicacion(id));
    setToast("Publicación eliminada (simulado)");
    if (editando === id) {
      setEditando(null);
      setForm(vacio);
    }
  }

  return (
    <section className="mx-auto max-w-5xl px-5 pt-16 pb-24">
      <p className={label}>Vender en Nexus</p>
      <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
        Publica tu excedente
      </h1>
      <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink/70">
        ¿Te sobraron componentes de un proyecto o tu laboratorio tiene inventario
        parado? Publícalo y otro maker lo aprovecha.
      </p>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        {/* Formulario */}
        <form
          onSubmit={enviar}
          className="h-fit rounded-sm border border-ink/15 bg-white p-6 lg:sticky lg:top-24"
        >
          <h2 className="font-display text-xl font-extrabold">
            {editando ? "Editar publicación" : "Nueva publicación"}
          </h2>

          <div className="mt-5 grid gap-4">
            <div>
              <label htmlFor="nombre" className={label}>Componente</label>
              <input
                id="nombre"
                name="nombre"
                value={form.nombre}
                onChange={cambiar}
                placeholder="Arduino Mega 2560"
                className={input}
              />
            </div>

            <div>
              <label htmlFor="categoria" className={label}>Categoría</label>
              <select
                id="categoria"
                name="categoria"
                value={form.categoria}
                onChange={cambiar}
                className={input}
              >
                {categorias.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="precio" className={label}>Precio por pieza</label>
                <input
                  id="precio"
                  name="precio"
                  type="number"
                  value={form.precio}
                  onChange={cambiar}
                  className={input}
                />
              </div>
              <div>
                <label htmlFor="cantidad" className={label}>Cantidad</label>
                <input
                  id="cantidad"
                  name="cantidad"
                  type="number"
                  value={form.cantidad}
                  onChange={cambiar}
                  className={input}
                />
              </div>
            </div>

            <div>
              <label htmlFor="condicion" className={label}>Condición</label>
              <select
                id="condicion"
                name="condicion"
                value={form.condicion}
                onChange={cambiar}
                className={input}
              >
                <option>Nuevo</option>
                <option>Abierto sin usar</option>
                <option>Usado funcional</option>
                <option>Para refacciones</option>
              </select>
            </div>

            <div>
              <label htmlFor="descripcion" className={label}>Descripción</label>
              <textarea
                id="descripcion"
                name="descripcion"
                rows="3"
                value={form.descripcion}
                onChange={cambiar}
                placeholder="Me sobraron del proyecto final, nunca se soldaron..."
                className={`${input} resize-y`}
              />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              className="rounded-sm bg-ink px-6 py-3 font-mono text-xs uppercase tracking-wider text-board hover:bg-ink-soft"
            >
              {editando ? "Guardar cambios" : "Publicar"}
            </button>
            {editando && (
              <button
                type="button"
                onClick={() => {
                  setEditando(null);
                  setForm(vacio);
                }}
                className="rounded-sm border border-ink/25 px-6 py-3 font-mono text-xs uppercase tracking-wider hover:border-ink"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        {/* Mis publicaciones */}
        <div>
          <p className={label}>Mis publicaciones</p>
          <h2 className="mt-2 font-display text-2xl font-extrabold">
            {lista.length} {lista.length === 1 ? "artículo" : "artículos"}
          </h2>

          {lista.length === 0 ? (
            <div className="mt-6 rounded-sm border border-dashed border-ink/25 bg-white p-10 text-center">
              <p className="font-display text-lg font-bold">Nada publicado todavía</p>
              <p className="mt-1 text-sm text-trace">
                Llena el formulario para poner tu primer componente a la venta.
              </p>
            </div>
          ) : (
            <ul className="mt-6 grid gap-4">
              {lista.map((p) => (
                <li
                  key={p.id}
                  className="flex gap-4 rounded-sm border border-ink/15 bg-white p-4"
                >
                  <ImagenProducto
                    categoria={p.categoria}
                    className="hidden h-24 w-32 shrink-0 rounded-sm sm:block"
                  />

                  <div className="flex flex-1 flex-col">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="font-display text-lg font-bold leading-tight">
                          {p.nombre}
                        </p>
                        <p className="font-mono text-xs text-trace">
                          {p.categoria} · {p.condicion}
                        </p>
                      </div>
                      <span className="rounded-sm bg-band-green/10 px-2 py-1 font-mono text-xs text-band-green">
                        {p.estado}
                      </span>
                    </div>

                    {p.descripcion && (
                      <p className="mt-2 text-sm leading-relaxed text-ink/70">
                        {p.descripcion}
                      </p>
                    )}

                    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
                      <p className="font-mono text-sm text-trace">
                        <span className="font-display text-lg font-bold text-ink tabular-nums">
                          ${p.precio}
                        </span>{" "}
                        × {p.cantidad} pz · {p.fecha}
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => editar(p)}
                          className="font-mono text-xs uppercase tracking-wider text-trace hover:text-ink"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => borrar(p.id)}
                          className="font-mono text-xs uppercase tracking-wider text-trace hover:text-band-red"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <Link
            to="/subastas"
            className="mt-8 block rounded-sm border border-dashed border-ink/25 bg-white p-5 transition-colors hover:border-ink"
          >
            <p className="font-display text-lg font-bold">
              ¿Tienes un lote grande? →
            </p>
            <p className="mt-1 text-sm text-trace">
              Los remates de inventario se mueven mejor por subasta.
            </p>
          </Link>
        </div>
      </div>

      <Toast mensaje={toast} visible={!!toast} onCerrar={() => setToast("")} />
    </section>
  );
}