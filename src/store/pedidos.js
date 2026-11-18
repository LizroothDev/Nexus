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