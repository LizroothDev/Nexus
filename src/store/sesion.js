const CLAVE_USUARIOS = "nexus_usuarios";
const CLAVE_SESION = "nexus_sesion";

export function leerUsuarios() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_USUARIOS)) || [];
  } catch {
    return [];
  }
}

export function guardarUsuario(usuario) {
  const usuarios = leerUsuarios();
  usuarios.push({ ...usuario, registrado: new Date().toISOString() });
  localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
}

export function iniciarSesion(usuario) {
  localStorage.setItem(CLAVE_SESION, JSON.stringify(usuario));
}

export function leerSesion() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_SESION));
  } catch {
    return null;
  }
}

export function cerrarSesion() {
  localStorage.removeItem(CLAVE_SESION);
}