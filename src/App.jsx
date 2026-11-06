import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import LayoutAdmin from "./components/LayoutAdmin";
import Inicio from "./pages/Inicio";
import Nosotros from "./pages/Nosotros";
import Contacto from "./pages/Contacto";
import Catalogo from "./pages/Catalogo";
import DetalleProducto from "./pages/DetalleProducto";
import Carrito from "./pages/Carrito";
import Promociones from "./pages/Promociones";
import Registro from "./pages/Registro";
import Login from "./pages/Login";
import Perfil from "./pages/Perfil";
import Legal from "./pages/Legal";
import Campana from "./pages/Campana";
import Dashboard from "./pages/admin/Dashboard";
import ProductosAdmin from "./pages/admin/Productos";
import Publicar from "./pages/Publicar";

export default function App() {
  return (
    <Routes>
      <Route path="/campana" element={<Campana />} />

      <Route element={<Layout />}>
        <Route path="/" element={<Inicio />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/producto/:id" element={<DetalleProducto />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/promociones" element={<Promociones />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/legal" element={<Legal />} />

        <Route path="/promociones" element={<Promociones />} />
        <Route path="/publicar" element={<Publicar />} />

        <Route path="/admin" element={<LayoutAdmin />}>
          <Route index element={<Dashboard />} />
          <Route path="productos" element={<ProductosAdmin />} />
        </Route>
      </Route>
    </Routes>
  );
}