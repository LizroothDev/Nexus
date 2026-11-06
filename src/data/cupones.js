export const cupones = [
  {
    codigo: "MAKER10",
    descripcion: "10% de descuento en todo el carrito",
    tipo: "porcentaje",
    valor: 10,
    minimo: 0,
    detalle: "Sin compra mínima. Válido para cuentas de menudeo y mayoreo.",
  },
  {
    codigo: "ROBOTICA15",
    descripcion: "15% en pedidos desde $1,500",
    tipo: "porcentaje",
    valor: 15,
    minimo: 1500,
    detalle: "Pensado para equipos que arman más de un prototipo.",
  },
  {
    codigo: "ENVIOGRATIS",
    descripcion: "$150 de descuento por envío",
    tipo: "fijo",
    valor: 150,
    minimo: 800,
    detalle: "Equivalente al costo de envío estándar dentro del Bajío.",
  },
  {
    codigo: "ITA20",
    descripcion: "20% con credencial vigente del ITA",
    tipo: "porcentaje",
    valor: 20,
    minimo: 500,
    detalle: "Exclusivo para estudiantes. Se valida al recoger en sucursal.",
  },
];

export function buscarCupon(codigo) {
  const limpio = codigo.trim().toUpperCase();
  return cupones.find((c) => c.codigo === limpio) || null;
}

export function calcularDescuento(cupon, subtotal) {
  if (!cupon) return 0;
  if (subtotal < cupon.minimo) return 0;
  if (cupon.tipo === "porcentaje") return subtotal * (cupon.valor / 100);
  return Math.min(cupon.valor, subtotal);
}