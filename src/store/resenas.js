const CLAVE = "nexus_resenas";

const semilla = {
  "esp32-wroom": [
    {
      id: "r1",
      autor: "Diego Ramírez",
      tipo: "resena",
      estrellas: 5,
      texto: "Llegó bien empaquetado y funcionó a la primera con el IDE de Arduino. El alcance del Wi-Fi es mejor que el de la versión anterior.",
      fecha: "2026-09-18",
    },
    {
      id: "r2",
      autor: "Laura Pineda",
      tipo: "pregunta",
      texto: "¿Este módulo acepta alimentación directa de 5V por el pin VIN o necesito regulador externo?",
      respuesta: "Acepta 5V por VIN, trae regulador a bordo. Los pines GPIO sí son de 3.3V.",
      fecha: "2026-09-25",
    },
  ],
  hcsr04: [
    {
      id: "r3",
      autor: "Samuel Ortiz",
      tipo: "resena",
      estrellas: 4,
      texto: "Buen sensor por el precio. Ojo que la lectura se vuelve inestable abajo de 5 cm.",
      fecha: "2026-10-02",
    },
  ],
};

export function leerResenas(productoId) {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE)) || {};
    return guardado[productoId] ?? semilla[productoId] ?? [];
  } catch {
    return semilla[productoId] ?? [];
  }
}

export function agregarResena(productoId, entrada) {
  let todo = {};
  try {
    todo = JSON.parse(localStorage.getItem(CLAVE)) || {};
  } catch {
    todo = {};
  }

  const actuales = todo[productoId] ?? semilla[productoId] ?? [];
  const nueva = {
    ...entrada,
    id: `r-${Date.now()}`,
    fecha: new Date().toISOString().slice(0, 10),
  };

  todo[productoId] = [nueva, ...actuales];
  localStorage.setItem(CLAVE, JSON.stringify(todo));
  return todo[productoId];
}