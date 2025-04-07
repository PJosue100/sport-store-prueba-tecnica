import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../usuario/control/SesionUsuario";
import { useCart } from "../../pedidos/control/SesionPedido";
import { FaShoppingCart, FaUser } from "react-icons/fa";

function Header() {
  const { cart } = useCart();
  const { user, filtroHeaderActual } = useUser();

  const handleSearchChange = (event) => {
    filtroHeaderActual(event.target.value);
  };

  return (
    <header className="bg-gray-900 text-white fixed top-0 left-0 w-full shadow-md z-50">
      <div className="container mx-auto flex flex-wrap items-center justify-between py-4 px-6">
        
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src="/logo-store.png" alt="Logo de la tienda" className="h-12" />
        </Link>

        {/* Barra de búsqueda (solo escritorio) */}
        <div className="flex-1 mx-6 max-w-lg hidden md:block">
          <input
            type="text"
            placeholder="Buscar productos..."
            className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
            onChange={handleSearchChange}
          />
        </div>

        {/* Sección de usuario y carrito */}
        <div className="flex items-center gap-4">
          
          {/* ===== Usuario - Escritorio ===== */}
          <Link to={user ? "/cuenta" : "/iniciosesion"} className="hidden md:flex">
            <button className="p-2 text-white hover:text-gray-300 transition">
              {user ? `${user.nombres} ${user.apellidos}` : "Mi cuenta"}
            </button>
          </Link>

          {/* ===== Usuario - Móvil ===== */}
          <Link to={user ? "/cuenta" : "/iniciosesion"} className="flex md:hidden">
            <button className="p-2 text-white hover:text-gray-300 transition" aria-label="Cuenta de usuario">
              <FaUser size={20} />
            </button>
          </Link>

          {/* ===== Carrito (sin cambios) ===== */}
          <Link to="/carrito" className="relative">
            <button className="p-2 text-white hover:text-gray-300 transition" aria-label="Carrito de compras">
              <FaShoppingCart size={26} />
            </button>
            {cart.length > 0 && (
              <span className="absolute top-0 right-0 block w-3 h-3 bg-red-600 rounded-full ring-2 ring-gray-900"></span>
            )}
          </Link>
        </div>

        {/* Barra de búsqueda para móviles */}
        <div className="w-full mt-4 md:hidden">
          <input
            type="text"
            placeholder="Buscar productos..."
            className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
            onChange={handleSearchChange}
          />
        </div>
      </div>
    </header>
  );
}

export default Header;
