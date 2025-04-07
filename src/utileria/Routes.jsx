import React from "react";
import { Routes, Route } from "react-router-dom"
;
import HomePage from "../productos/ui/HomePage";
import CarritoPage from "../pedidos/ui/CarritoPage";
import PedidosPage from "../pedidos/ui/PedidosPage";
import MantenimientoProductosPage from "../productos/ui/MantenimientoProductosPage";



import AccountPage from "../usuario/ui/AccountPage";
import MantenimientoUsuarioPage from "../usuario/ui/MantenimientoUsuarioPage";
import LoginPage from "../usuario/ui/LoginPage";
import RegistroPage from "../usuario/ui/RegistroPage";
import RecoveryPassPage from "../usuario/ui/RecoveryPassPage";
import ChangePassPage from "../usuario/ui/ChangePassPage";



function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/carrito" element={<CarritoPage />} />
      <Route path="/cuenta" element={<AccountPage />} />
      <Route path="/iniciosesion" element={<LoginPage />} />
      <Route path="/registro" element={<RegistroPage />} />
      <Route path="/usuarios" element={<MantenimientoUsuarioPage />} />
      <Route path="/recovery-pass" element={<RecoveryPassPage />} />
      <Route path="/change-pass" element={<ChangePassPage />} />
      <Route path="/productos" element={<MantenimientoProductosPage />} />
      <Route path="/pedidos" element={<PedidosPage />} />
    </Routes>
  );
}

export default AppRoutes;

