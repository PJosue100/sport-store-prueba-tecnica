import React from "react";
import { useNavigate } from "react-router-dom";
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

import { useUser } from "../control/SesionUsuario";

export default function AccountPage() {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const isAdmin = user?.rol === "admin";

  return (
    <div className="container mx-auto p-6 flex flex-col lg:flex-row bg-gray-800 rounded-lg shadow-lg text-white max-w-4xl mt-32">
      {/* Sección de información del usuario */}
      <section className="w-full lg:w-2/3 order-1 lg:order-2">
        <h2 className="text-4xl font-extrabold text-green-400 mb-6 text-center lg:text-left">Mi Cuenta</h2>
        <div className="space-y-4 text-lg bg-gray-700 p-6 rounded-lg shadow-md">
          <p>
            <strong className="text-green-300">Nombre:</strong> {user?.nombres} {user?.apellidos}
          </p>
          <p>
            <strong className="text-green-300">Email:</strong> {user?.email}
          </p>
          <p>
            <strong className="text-green-300">Fecha de Nacimiento:</strong> {format(parseISO(user?.fechaNacimiento), "d MMM yyyy", { locale: es })}
          </p>
          <p>
            <strong className="text-green-300">Dirección de Envío:</strong> {user?.direccionEnvio}
          </p>
          <p>
            <strong className="text-green-300">Rol:</strong> {user?.rol}
          </p>
        </div>
      </section>

      {/* Barra lateral de opciones */}
      <aside className="w-full lg:w-1/3 order-2 lg:order-1 bg-gray-900 p-4 rounded-lg mt-6 lg:mt-0 lg:mr-6">
        <h2 className="text-2xl font-extrabold text-green-400 mb-4 text-center lg:text-left">Opciones</h2>
        <div className="space-y-4">
          {isAdmin && (
            <button
              onClick={() => navigate("/usuarios")}
              className="w-full bg-green-500 hover:bg-green-600 py-2 px-4 rounded-lg"
            >
              Mantenimiento de Usuarios
            </button>
          )}
          {isAdmin && (
            <button
              onClick={() => navigate("/productos")}
              className="w-full bg-green-500 hover:bg-green-600 py-2 px-4 rounded-lg"
            >
              Mantenimiento de Productos
            </button>
          )}
          <button
            onClick={() => navigate("/pedidos")}
            className="w-full bg-green-500 hover:bg-green-600 py-2 px-4 rounded-lg"
          >
            Mis Pedidos
          </button>
          <button
            onClick={() => navigate("/change-pass")}
            className="w-full bg-green-500 hover:bg-green-600 py-2 px-4 rounded-lg"
          >
            Cambiar Contraseña
          </button>
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="w-full bg-red-500 hover:bg-red-600 py-2 px-4 rounded-lg"
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>
    </div>
  );
}
