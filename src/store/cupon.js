const CLAVE = "nexus_cupon";

export function leerCuponActivo() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE));
  } catch {
    return null;
  }
}

export function activarCupon(cupon) {
  localStorage.setItem(CLAVE, JSON.stringify(cupon));
  window.dispatchEvent(new Event("cupon-cambio"));
}

export function quitarCupon() {
  localStorage.removeItem(CLAVE);
  window.dispatchEvent(new Event("cupon-cambio"));
}