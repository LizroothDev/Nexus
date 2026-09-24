const CLAVE = "nexus_carrito";

export function leerCarrito() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE)) || [];
  } catch {
    return [];
  }
}

export function guardarCarrito(items) {
  localStorage.setItem(CLAVE, JSON.stringify(items));
  window.dispatchEvent(new Event("carrito-cambio"));
}

export function agregarAlCarrito(producto, cantidad = 1) {
  const items = leerCarrito();
  const existente = items.find((i) => i.id === producto.id);

  if (existente) {
    existente.cantidad += cantidad;
  } else {
    items.push({
      id: producto.id,
      nombre: producto.nombre,
      categoria: producto.categoria,
      precio: producto.precio,
      precioMayoreo: producto.precioMayoreo,
      minMayoreo: producto.minMayoreo,
      cantidad,
    });
  }

  guardarCarrito(items);
  return items;
}

export function cambiarCantidad(id, delta) {
  const items = leerCarrito()
    .map((i) => (i.id === id ? { ...i, cantidad: i.cantidad + delta } : i))
    .filter((i) => i.cantidad > 0);
  guardarCarrito(items);
  return items;
}

export function quitarDelCarrito(id) {
  const items = leerCarrito().filter((i) => i.id !== id);
  guardarCarrito(items);
  return items;
}

export function vaciarCarrito() {
  guardarCarrito([]);
  return [];
}

// Precio unitario según si alcanzó el mínimo de mayoreo
export function precioUnitario(item) {
  return item.cantidad >= item.minMayoreo ? item.precioMayoreo : item.precio;
}

export function calcularTotales(items) {
  const subtotal = items.reduce(
    (suma, i) => suma + precioUnitario(i) * i.cantidad,
    0
  );
  const iva = subtotal * 0.16;
  return { subtotal, iva, total: subtotal + iva };
}

export function contarPiezas(items) {
  return items.reduce((suma, i) => suma + i.cantidad, 0);
}