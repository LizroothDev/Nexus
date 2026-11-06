const CLAVE = "nexus_subastas";

// Las subastas cierran a distintas horas desde que se abre la app
const base = [
  {
    id: "lote-ti",
    titulo: "Lote de microcontroladores TI",
    categoria: "Embebidos",
    descripcion:
      "140 piezas MSP430G2553 en encapsulado DIP-20, selladas en tubo antiestático. Remate de inventario de un laboratorio que migró a ARM.",
    piezas: 140,
    valorMercado: 16800,
    inicial: 5400,
    horas: 8,
    vendedor: "Lab. Electrónica · ITA",
  },
  {
    id: "lote-displays",
    titulo: "Displays OLED 0.96\" surtidos",
    categoria: "Pasivos",
    descripcion:
      "60 módulos I2C de 128×64, mezcla de blanco y azul. Todos probados, tres con el pixel de esquina muerto.",
    piezas: 60,
    valorMercado: 7200,
    inicial: 2100,
    horas: 22,
    vendedor: "Taller Bitwise",
  },
  {
    id: "lote-motores",
    titulo: "Excedente de motores a pasos NEMA 17",
    categoria: "Redes",
    descripcion:
      "18 motores de 1.8° con driver A4988 incluido. Sobrantes de una línea de impresoras 3D que se descontinuó.",
    piezas: 18,
    valorMercado: 9400,
    inicial: 3800,
    horas: 49,
    vendedor: "Prototipos del Bajío",
  },
];

function cierres() {
  const ahora = Date.now();
  return base.map((l) => ({
    ...l,
    cierra: ahora + l.horas * 3600000,
  }));
}

export function leerSubastas() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE));
    if (Array.isArray(guardado) && guardado.length > 0) return guardado;
  } catch {
    // dato corrupto
  }

  const nuevas = cierres().map((l) => ({
    ...l,
    ofertas: [
      { autor: "Carlos M.", monto: l.inicial, hace: "hace 2 h" },
      { autor: "Ana R.", monto: Math.round(l.inicial * 1.08), hace: "hace 40 min" },
    ],
  }));

  localStorage.setItem(CLAVE, JSON.stringify(nuevas));
  return nuevas;
}

export function ofertar(loteId, autor, monto) {
  const lista = leerSubastas().map((l) =>
    l.id === loteId
      ? { ...l, ofertas: [{ autor, monto, hace: "ahora" }, ...l.ofertas] }
      : l
  );
  localStorage.setItem(CLAVE, JSON.stringify(lista));
  return lista;
}

export function ofertaMayor(lote) {
  return Math.max(...lote.ofertas.map((o) => o.monto), lote.inicial);
}

export function reiniciarSubastas() {
  localStorage.removeItem(CLAVE);
  return leerSubastas();
}