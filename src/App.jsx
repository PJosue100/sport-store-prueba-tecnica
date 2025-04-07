import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { UserProvider } from "./usuario/control/SesionUsuario";
import { CartProvider  } from "./pedidos/control/SesionPedido";
import AppRoutes from "./utileria/Routes";
import Header from "./principal/ui/Header";
import './App.css'

function App() {
  return (
    <UserProvider>
      <CartProvider>
      <Router>
        <Header />
        <main className="container mx-auto p-2">
          <AppRoutes />
        </main>
      </Router>
      </CartProvider>
    </UserProvider>
  );
}

export default App
