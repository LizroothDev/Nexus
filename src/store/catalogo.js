import { productos as semilla } from "../data/productos";

const CLAVE = "nexus_catalogo";

export function leerProductos() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE));
    if (Array.isArray(guardado) && guardado.length > 0) return guardado;
  } catch {
    // dato corrupto: se usa la semilla
  }
  return semilla;
}

function guardar(lista) {
  localStorage.setItem(CLAVE, JSON.stringify(lista));
  window.dispatchEvent(new Event("catalogo-cambio"));
  return lista;
}

function generarId(nombre) {
  const base = nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${base || "clave"}-${Date.now().toString().slice(-4)}`;
}

export function crearProducto(datos) {
  const lista = leerProductos();
  lista.unshift({
    ...datos,
    id: generarId(datos.nombre),
    descripcion: datos.resumen,
    ficha: { Categoría: datos.categoria, Existencia: `${datos.stock} pz` },
  });
  return guardar(lista);
}

export function actualizarProducto(id, datos) {
  const lista = leerProductos().map((p) =>
    p.id === id ? { ...p, ...datos } : p
  );
  return guardar(lista);
}

export function eliminarProducto(id) {
  return guardar(leerProductos().filter((p) => p.id !== id));
}

export function restaurarCatalogo() {
  localStorage.removeItem(CLAVE);
  window.dispatchEvent(new Event("catalogo-cambio"));
  return semilla;
}