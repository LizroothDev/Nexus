const DIRECCIONES = "nexus_direcciones";
const TARJETAS = "nexus_tarjetas";
const MAX = 5;

function leer(clave) {
  try {
    return JSON.parse(localStorage.getItem(clave)) || [];
  } catch {
    return [];
  }
}

function guardar(clave, lista) {
  localStorage.setItem(clave, JSON.stringify(lista));
  return lista;
}

// Si la lista queda sin predeterminado, el primero lo toma
function normalizar(lista) {
  if (lista.length === 0) return lista;
  if (lista.some((x) => x.predeterminado)) return lista;
  return lista.map((x, i) => (i === 0 ? { ...x, predeterminado: true } : x));
}

/* ---------- Direcciones ---------- */

export function leerDirecciones() {
  return leer(DIRECCIONES);
}

export function direccionPredeterminada() {
  return leerDirecciones().find((d) => d.predeterminado) || null;
}

export function guardarDireccion(datos, id = null) {
  const lista = leerDirecciones();

  if (id) {
    return guardar(
      DIRECCIONES,
      lista.map((d) => (d.id === id ? { ...d, ...datos } : d))
    );
  }

  if (lista.length >= MAX) return lista;

  lista.push({
    ...datos,
    id: `dir-${Date.now()}`,
    predeterminado: lista.length === 0,
  });
  return guardar(DIRECCIONES, lista);
}

export function eliminarDireccion(id) {
  const lista = normalizar(leerDirecciones().filter((d) => d.id !== id));
  return guardar(DIRECCIONES, lista);
}

export function fijarDireccion(id) {
  return guardar(
    DIRECCIONES,
    leerDirecciones().map((d) => ({ ...d, predeterminado: d.id === id }))
  );
}

/* ---------- Tarjetas ---------- */

// Detecta la marca por el primer dígito, como hacen las pasarelas reales
export function detectarMarca(numero) {
  const limpio = numero.replace(/\D/g, "");
  if (limpio.startsWith("4")) return "Visa";
  if (/^5[1-5]/.test(limpio)) return "Mastercard";
  if (/^3[47]/.test(limpio)) return "American Express";
  if (limpio.startsWith("6")) return "Discover";
  return "Tarjeta";
}

export function leerTarjetas() {
  return leer(TARJETAS);
}

export function tarjetaPredeterminada() {
  return leerTarjetas().find((t) => t.predeterminado) || null;
}

export function guardarTarjeta(datos) {
  const lista = leerTarjetas();
  if (lista.length >= MAX) return lista;

  const digitos = (datos.numero || "").replace(/\D/g, "");

  lista.push({
    id: `tar-${Date.now()}`,
    titular: datos.titular || "Sin titular",
    ultimos4: digitos.slice(-4) || "0000",
    marca: detectarMarca(digitos),
    vence: datos.vence || "—",
    alias: datos.alias || "",
    predeterminado: lista.length === 0,
  });
  return guardar(TARJETAS, lista);
}

export function eliminarTarjeta(id) {
  const lista = normalizar(leerTarjetas().filter((t) => t.id !== id));
  return guardar(TARJETAS, lista);
}

export function fijarTarjeta(id) {
  return guardar(
    TARJETAS,
    leerTarjetas().map((t) => ({ ...t, predeterminado: t.id === id }))
  );
}