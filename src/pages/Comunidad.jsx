import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  leerPosts,
  publicarPost,
  darLike,
  comentar,
  eliminarPost,
  reiniciarComunidad,
  comprimirImagen,
} from "../store/comunidad";
import { leerProductos } from "../store/catalogo";
import { leerSesion } from "../store/sesion";
import Toast from "../components/Toast";

const label = "font-mono text-xs uppercase tracking-widest text-trace";
const input =
  "mt-1 w-full rounded-sm border border-ink/20 bg-white px-3 py-2.5 text-sm outline-none focus:border-ink";

const tipos = {
  proyecto: { nombre: "Proyecto", clase: "bg-band-violet/10 text-band-violet" },
  recomendacion: { nombre: "Recomendación", clase: "bg-band-green/10 text-band-green" },
  pregunta: { nombre: "Pregunta", clase: "bg-band-gold/15 text-band-gold" },
};

const filtros = [
  ["todos", "Todo"],
  ["proyecto", "Proyectos"],
  ["recomendacion", "Recomendaciones"],
  ["pregunta", "Preguntas"],
];

const vacio = { tipo: "proyecto", titulo: "", texto: "", componentes: [], imagen: null };

export default function Comunidad() {
  const [posts, setPosts] = useState([]);
  const [filtro, setFiltro] = useState("todos");
  const [form, setForm] = useState(vacio);
  const [subiendo, setSubiendo] = useState(false);
  const [abierto, setAbierto] = useState(null);
  const [borradores, setBorradores] = useState({});
  const [toast, setToast] = useState("");

  const catalogo = useMemo(() => leerProductos(), []);

  useEffect(() => {
    setPosts(leerPosts());
  }, []);

  const visibles =
    filtro === "todos" ? posts : posts.filter((p) => p.tipo === filtro);

  function nombreProducto(id) {
    return catalogo.find((p) => p.id === id)?.nombre || id;
  }

  function alternarComponente(id) {
    const ya = form.componentes.includes(id);
    setForm({
      ...form,
      componentes: ya
        ? form.componentes.filter((c) => c !== id)
        : [...form.componentes, id],
    });
  }

  async function elegirImagen(e) {
    const archivo = e.target.files?.[0];
    if (!archivo) return;

    setSubiendo(true);
    try {
      const comprimida = await comprimirImagen(archivo);
      setForm((f) => ({ ...f, imagen: comprimida }));
    } catch {
      setToast("No se pudo leer esa imagen");
    }
    setSubiendo(false);
  }

  function enviar(e) {
    e.preventDefault();
    const sesion = leerSesion();

    setPosts(
      publicarPost({
        ...form,
        titulo: form.titulo || "Sin título",
        autor: sesion?.nombre || "Usuario anónimo",
        rol: sesion?.tipo === "empresa" ? "Cuenta empresarial" : "Maker",
      })
    );

    setForm(vacio);
    setToast("Publicado en la comunidad (simulado)");
  }

  function enviarComentario(e, postId) {
    e.preventDefault();
    const sesion = leerSesion();
    const texto = (borradores[postId] || "").trim();
    if (!texto) return;

    setPosts(comentar(postId, sesion?.nombre || "Usuario anónimo", texto));
    setBorradores({ ...borradores, [postId]: "" });
  }

  return (
    <section className="mx-auto max-w-5xl px-5 pt-16 pb-24">
      <p className={label}>Comunidad</p>
      <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
        Lo que la gente está construyendo
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink/70">
        Comparte tu proyecto, recomienda un componente que te funcionó o pregunta
        antes de comprar. Cada publicación enlaza las claves que se usaron.
      </p>

      {/* Formulario */}
      <form onSubmit={enviar} className="mt-10 rounded-sm border border-ink/15 bg-white p-6">
        <div className="flex flex-wrap gap-2">
          {Object.entries(tipos).map(([id, t]) => (
            <button
              key={id}
              type="button"
              onClick={() => setForm({ ...form, tipo: id })}
              className={`rounded-sm px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors ${
                form.tipo === id
                  ? "bg-ink text-board"
                  : "border border-ink/20 hover:border-ink"
              }`}
            >
              {t.nombre}
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-4">
          <div>
            <label htmlFor="titulo" className={label}>Título</label>
            <input
              id="titulo"
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              placeholder="Brazo robótico de 4 grados de libertad"
              className={input}
            />
          </div>

          <div>
            <label htmlFor="texto" className={label}>
              {form.tipo === "pregunta" ? "Tu duda" : "Cuéntanos cómo lo hiciste"}
            </label>
            <textarea
              id="texto"
              rows="4"
              value={form.texto}
              onChange={(e) => setForm({ ...form, texto: e.target.value })}
              placeholder={
                form.tipo === "pregunta"
                  ? "¿Alguien ha logrado que..."
                  : "Lo armé para la materia de control. Lo más difícil fue..."
              }
              className={`${input} resize-y`}
            />
          </div>

          {/* Componentes usados */}
          <div>
            <p className={label}>Componentes que usaste</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {catalogo.slice(0, 12).map((p) => {
                const activo = form.componentes.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => alternarComponente(p.id)}
                    className={`rounded-sm px-2.5 py-1.5 font-mono text-xs transition-colors ${
                      activo
                        ? "bg-band-violet text-board"
                        : "border border-ink/20 text-trace hover:border-ink hover:text-ink"
                    }`}
                  >
                    {p.nombre}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Imagen */}
          <div>
            <p className={label}>Foto del proyecto</p>
            {form.imagen ? (
              <div className="mt-2 flex items-start gap-4">
                <img
                  src={form.imagen}
                  alt="Vista previa"
                  className="h-28 w-40 rounded-sm object-cover"
                />
                <button
                  type="button"
                  onClick={() => setForm({ ...form, imagen: null })}
                  className="font-mono text-xs uppercase tracking-wider text-trace hover:text-band-red"
                >
                  Quitar foto
                </button>
              </div>
            ) : (
              <label className="mt-2 flex cursor-pointer items-center justify-center rounded-sm border border-dashed border-ink/30 bg-board/50 px-4 py-8 text-center transition-colors hover:border-ink">
                <input
                  type="file"
                  accept="image/*"
                  onChange={elegirImagen}
                  className="hidden"
                />
                <span className="font-mono text-xs uppercase tracking-wider text-trace">
                  {subiendo ? "Procesando..." : "Elegir una imagen"}
                </span>
              </label>
            )}
            <p className="mt-2 font-mono text-xs text-trace">
              La imagen se reduce automáticamente antes de guardarse.
            </p>
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 rounded-sm bg-ink px-6 py-3 font-mono text-xs uppercase tracking-wider text-board hover:bg-ink-soft"
        >
          Publicar
        </button>
      </form>

      {/* Filtros */}
      <div className="mt-14 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {filtros.map(([id, nombre]) => (
            <button
              key={id}
              onClick={() => setFiltro(id)}
              className={`rounded-sm px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors ${
                filtro === id
                  ? "bg-ink text-board"
                  : "border border-ink/20 hover:border-ink"
              }`}
            >
              {nombre}
            </button>
          ))}
        </div>
        <p className="font-mono text-sm text-trace">
          {visibles.length} {visibles.length === 1 ? "publicación" : "publicaciones"}
        </p>
      </div>

      {/* Feed */}
      <div className="mt-6 grid gap-6">
        {visibles.map((post) => (
          <article key={post.id} className="rounded-sm border border-ink/15 bg-white">
            <div className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-lg font-bold">{post.autor}</p>
                  <p className="font-mono text-xs text-trace">
                    {post.rol} · {post.fecha}
                  </p>
                </div>
                <span
                  className={`rounded-sm px-2 py-1 font-mono text-xs uppercase tracking-wider ${tipos[post.tipo].clase}`}
                >
                  {tipos[post.tipo].nombre}
                </span>
              </div>

              <h2 className="mt-4 font-display text-2xl font-extrabold leading-tight">
                {post.titulo}
              </h2>
              <p className="mt-3 leading-relaxed text-ink/75">{post.texto}</p>

              {post.componentes?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.componentes.map((id) => (
                    <Link
                      key={id}
                      to={`/producto/${id}`}
                      className="rounded-sm border border-ink/20 px-2.5 py-1 font-mono text-xs text-trace transition-colors hover:border-ink hover:text-ink"
                    >
                      {nombreProducto(id)} →
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {post.imagen && (
              <img
                src={post.imagen}
                alt={post.titulo}
                className="max-h-96 w-full object-cover"
              />
            )}

            {/* Acciones */}
            <div className="flex flex-wrap items-center gap-5 border-t border-ink/10 px-6 py-3">
              <button
                onClick={() => setPosts(darLike(post.id))}
                className="font-mono text-xs uppercase tracking-wider text-trace transition-colors hover:text-band-red"
              >
                ♥ {post.likes}
              </button>
              <button
                onClick={() => setAbierto(abierto === post.id ? null : post.id)}
                className="font-mono text-xs uppercase tracking-wider text-trace transition-colors hover:text-ink"
              >
                {post.comentarios.length} comentarios
              </button>
              <button
                onClick={() => {
                  setPosts(eliminarPost(post.id));
                  setToast("Publicación eliminada (simulado)");
                }}
                className="ml-auto font-mono text-xs uppercase tracking-wider text-trace transition-colors hover:text-band-red"
              >
                Eliminar
              </button>
            </div>

            {/* Comentarios */}
            {abierto === post.id && (
              <div className="border-t border-ink/10 bg-board/40 px-6 py-5">
                {post.comentarios.length === 0 ? (
                  <p className="font-mono text-xs text-trace">
                    Todavía no hay comentarios.
                  </p>
                ) : (
                  <ul className="grid gap-4">
                    {post.comentarios.map((c, i) => (
                      <li key={`${c.autor}-${i}`} className="border-l-2 border-ink/15 pl-4">
                        <p className="font-mono text-xs text-trace">
                          <span className="font-semibold text-ink">{c.autor}</span>{" "}
                          · {c.fecha}
                        </p>
                        <p className="mt-1 text-sm leading-relaxed">{c.texto}</p>
                      </li>
                    ))}
                  </ul>
                )}

                <form
                  onSubmit={(e) => enviarComentario(e, post.id)}
                  className="mt-5 flex flex-wrap gap-3"
                >
                  <input
                    value={borradores[post.id] || ""}
                    onChange={(e) =>
                      setBorradores({ ...borradores, [post.id]: e.target.value })
                    }
                    placeholder="Escribe un comentario..."
                    className="min-w-48 flex-1 rounded-sm border border-ink/20 bg-white px-3 py-2 text-sm outline-none focus:border-ink"
                  />
                  <button
                    type="submit"
                    className="rounded-sm bg-ink px-5 py-2 font-mono text-xs uppercase tracking-wider text-board hover:bg-ink-soft"
                  >
                    Comentar
                  </button>
                </form>
              </div>
            )}
          </article>
        ))}
      </div>

      <button
        onClick={() => {
          setPosts(reiniciarComunidad());
          setToast("Comunidad reiniciada");
        }}
        className="mt-10 font-mono text-xs uppercase tracking-wider text-trace hover:text-ink"
      >
        Reiniciar comunidad
      </button>

      <Toast mensaje={toast} visible={!!toast} onCerrar={() => setToast("")} />
    </section>
  );
}