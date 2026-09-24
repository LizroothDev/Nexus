import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Inicio from "./pages/Inicio";
import Nosotros from "./pages/Nosotros";
import Contacto from "./pages/Contacto";
import Catalogo from "./pages/Catalogo";
import DetalleProducto from "./pages/DetalleProducto";
import Registro from "./pages/Registro";
import Login from "./pages/Login";
import Perfil from "./pages/Perfil";
import Campana from "./pages/Campana";
import Carrito from "./pages/Carrito";
import Dashboard from "./pages/admin/Dashboard";

export default function App() {
  return (
    <Routes>
      {/* Landing de campaña: va fuera del Layout, sin navbar ni footer */}
      <Route path="/campana" element={<Campana />} />

      {/* Sitio principal: todas estas heredan navbar y footer */}
      <Route element={<Layout />}>
        <Route path="/" element={<Inicio />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/producto/:id" element={<DetalleProducto />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/admin" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}