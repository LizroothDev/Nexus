const CLAVE = "nexus_pedidos";

export function leerPedidos() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE)) || [];
  } catch {
    return [];
  }
}

function generarFolio() {
  const n = leerPedidos().length + 2042;
  return `NX-${n}`;
}

export function crearPedido(datos) {
  const lista = leerPedidos();
  const pedido = {
    ...datos,
    folio: generarFolio(),
    fecha: new Date().toISOString(),
    estado: "Confirmado",
  };
  lista.unshift(pedido);
  localStorage.setItem(CLAVE, JSON.stringify(lista));
  return pedido;
}

export function buscarPedido(folio) {
  return leerPedidos().find((p) => p.folio === folio) || null;
}

export function borrarHistorial() {
  localStorage.removeItem(CLAVE);
  return [];
}

export const etapas = [
  { id: "confirmado", nombre: "Pedido confirmado", detalle: "Recibimos tu pago" },
  { id: "preparando", nombre: "En preparación", detalle: "Surtiendo en almacén" },
  { id: "paqueteria", nombre: "Entregado a paquetería", detalle: "Salió de Aguascalientes" },
  { id: "transito", nombre: "En camino", detalle: "En ruta a tu dirección" },
  { id: "entregado", nombre: "Entregado", detalle: "Paquete recibido" },
];

// El pedido avanza una etapa cada 20 segundos desde que se creó
export function etapaActual(pedido) {
  const transcurrido = Date.now() - new Date(pedido.fecha).getTime();
  const avance = Math.floor(transcurrido / 20000);
  return Math.min(avance, etapas.length - 1);
}

export function estadoTexto(pedido) {
  return etapas[etapaActual(pedido)].nombre;
}
