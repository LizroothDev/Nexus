const CLAVE = "nexus_publicaciones";

export function leerPublicaciones() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE)) || [];
  } catch {
    return [];
  }
}

function guardar(lista) {
  localStorage.setItem(CLAVE, JSON.stringify(lista));
  return lista;
}

export function publicar(datos, autor) {
  const lista = leerPublicaciones();
  lista.unshift({
    ...datos,
    id: `pub-${Date.now()}`,
    autor: autor || "Usuario anónimo",
    fecha: new Date().toISOString().slice(0, 10),
    estado: "Publicado",
  });
  return guardar(lista);
}

export function actualizarPublicacion(id, datos) {
  return guardar(leerPublicaciones().map((p) => (p.id === id ? { ...p, ...datos } : p)));
}

export function eliminarPublicacion(id) {
  return guardar(leerPublicaciones().filter((p) => p.id !== id));
}