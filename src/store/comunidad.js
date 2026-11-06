const CLAVE = "nexus_comunidad";

const semilla = [
  {
    id: "p1",
    tipo: "proyecto",
    autor: "Diego Ramírez",
    rol: "Mecatrónica · 6to semestre",
    titulo: "Seguidor de línea con corrección PID",
    texto:
      "Después de tres semanas peleándome con las oscilaciones, por fin quedó estable. El truco fue bajar la ganancia derivativa y muestrear los infrarrojos cada 10 ms en lugar de cada vuelta del loop. Completa la pista en 14 segundos.",
    componentes: ["esp32-wroom", "hcsr04"],
    imagen: "/productos/esp32.jpg",
    fecha: "2026-10-28",
    likes: 14,
    comentarios: [
      { autor: "Samuel Ortiz", texto: "¿Qué valores de Kp y Kd acabaste usando?", fecha: "2026-10-29" },
      { autor: "Diego Ramírez", texto: "Kp 0.8 y Kd 0.15, con la pista impresa en vinil mate.", fecha: "2026-10-29" },
    ],
  },
  {
    id: "p2",
    tipo: "recomendacion",
    autor: "Ing. Paola Estrada",
    rol: "Coordinadora de laboratorio",
    titulo: "Para medir distancia corta, el VL53L0X le gana al ultrasónico",
    texto:
      "Llevamos dos semestres comparándolos en el taller. El HC-SR04 sigue siendo imbatible en precio, pero abajo de 10 cm se vuelve impreciso y le afectan las superficies blandas. El láser cuesta tres veces más y resuelve ambos problemas.",
    componentes: ["vl53l0x", "hcsr04"],
    imagen: null,
    fecha: "2026-10-31",
    likes: 23,
    comentarios: [
      { autor: "Laura Pineda", texto: "Confirmo. Con espuma acústica el ultrasónico simplemente no lee.", fecha: "2026-11-01" },
    ],
  },
  {
    id: "p3",
    tipo: "proyecto",
    autor: "Samuel Ortiz",
    rol: "Maker · Aguascalientes",
    titulo: "Estación de clima que reporta por LoRa",
    texto:
      "La puse en el techo de la casa de mi abuela, a 3.2 km de la mía. Manda temperatura y humedad cada 15 minutos con una pila de litio que lleva dos meses sin recargarse. El alcance real superó lo que esperaba.",
    componentes: ["lora-sx1278", "rp2040-pico"],
    imagen: "/productos/lora.jpg",
    fecha: "2026-11-02",
    likes: 31,
    comentarios: [],
  },
  {
    id: "p4",
    tipo: "pregunta",
    autor: "Laura Pineda",
    rol: "Estudiante",
    titulo: "¿Alguien ha usado el W5500 con el Pico?",
    texto:
      "Necesito Ethernet cableado para un proyecto de la escuela y no encuentro librería de MicroPython que funcione bien. ¿Les ha tocado? ¿O mejor me paso a C?",
    componentes: ["w5500", "rp2040-pico"],
    imagen: null,
    fecha: "2026-11-04",
    likes: 5,
    comentarios: [
      { autor: "Diego Ramírez", texto: "En C con el SDK oficial jala sin problema. En MicroPython batallé.", fecha: "2026-11-04" },
    ],
  },
];

export function leerPosts() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE));
    if (Array.isArray(guardado) && guardado.length > 0) return guardado;
  } catch {
    // dato corrupto
  }
  return semilla;
}

function guardar(lista) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(lista));
  } catch {
    // Se llenó el almacenamiento: quita la imagen del post más viejo y reintenta
    const recortada = lista.map((p, i) =>
      i === lista.length - 1 ? { ...p, imagen: null } : p
    );
    try {
      localStorage.setItem(CLAVE, JSON.stringify(recortada));
      return recortada;
    } catch {
      return lista;
    }
  }
  return lista;
}

export function publicarPost(datos) {
  const lista = leerPosts();
  lista.unshift({
    ...datos,
    id: `post-${Date.now()}`,
    fecha: new Date().toISOString().slice(0, 10),
    likes: 0,
    comentarios: [],
  });
  return guardar(lista);
}

export function darLike(id) {
  return guardar(
    leerPosts().map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p))
  );
}

export function comentar(id, autor, texto) {
  const comentario = {
    autor,
    texto,
    fecha: new Date().toISOString().slice(0, 10),
  };
  return guardar(
    leerPosts().map((p) =>
      p.id === id ? { ...p, comentarios: [...p.comentarios, comentario] } : p
    )
  );
}

export function eliminarPost(id) {
  return guardar(leerPosts().filter((p) => p.id !== id));
}

export function reiniciarComunidad() {
  localStorage.removeItem(CLAVE);
  return semilla;
}

// Reduce la foto antes de guardarla: localStorage solo aguanta unos 5 MB
export function comprimirImagen(archivo, maxAncho = 800) {
  return new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.onerror = reject;
    lector.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const escala = Math.min(1, maxAncho / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * escala);
        canvas.height = Math.round(img.height * escala);
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.src = e.target.result;
    };
    lector.readAsDataURL(archivo);
  });
}