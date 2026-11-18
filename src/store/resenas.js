const CLAVE = "nexus_resenas";

const semilla = {
  "esp32-wroom": [
    {
      id: "r1",
      autor: "Diego Ramírez",
      tipo: "resena",
      estrellas: 5,
      texto:
        "Llegó bien empaquetado y funcionó a la primera con el IDE de Arduino. El alcance del Wi-Fi es mejor que el de la versión anterior.",
      fecha: "2026-09-18",
    },
    {
      id: "r2",
      autor: "Laura Pineda",
      tipo: "pregunta",
      texto:
        "¿Este módulo acepta alimentación directa de 5V por el pin VIN o necesito regulador externo?",
      respuesta:
        "Acepta 5V por VIN, trae regulador a bordo. Los pines GPIO sí son de 3.3V.",
      fecha: "2026-09-25",
    },
  ],
  hcsr04: [
    {
      id: "r3",
      autor: "Samuel Ortiz",
      tipo: "resena",
      estrellas: 4,
      texto:
        "Buen sensor por el precio. Ojo que la lectura se vuelve inestable abajo de 5 cm.",
      fecha: "2026-10-02",
    },
  ],
};

function leerTodo() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE)) || {};
  } catch {
    return {};
  }
}

function escribir(productoId, lista) {
  const todo = leerTodo();
  todo[productoId] = lista;
  localStorage.setItem(CLAVE, JSON.stringify(todo));
  return lista;
}

export function leerResenas(productoId) {
  const todo = leerTodo();
  return todo[productoId] ?? semilla[productoId] ?? [];
}

export function agregarResena(productoId, entrada) {
  const actuales = leerResenas(productoId);
  const nueva = {
    ...entrada,
    id: `r-${Date.now()}`,
    fecha: new Date().toISOString().slice(0, 10),
    mia: true,
  };
  return escribir(productoId, [nueva, ...actuales]);
}

export function editarResena(productoId, resenaId, cambios) {
  const lista = leerResenas(productoId).map((r) =>
    r.id === resenaId ? { ...r, ...cambios, editado: true } : r
  );
  return escribir(productoId, lista);
}

export function eliminarResena(productoId, resenaId) {
  const lista = leerResenas(productoId).filter((r) => r.id !== resenaId);
  return escribir(productoId, lista);
}