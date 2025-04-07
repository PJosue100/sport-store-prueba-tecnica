import React, { useEffect, useState } from "react";



import { useUser } from "../control/SesionUsuario";
import { ApiService } from "../repositorio/RepositorioUsuario";

export default function MantenimientoUsuarioPage() {
  const { user } = useUser();
  const { token } = useUser();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    contraseniaActual: "",
    contraseniaNueva: ""
  });
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {      
      const response = await ApiService.cambiarContraseniaUsuario(user.id, formData, token);
      if (!response.success) {
        throw new Error("Correo incorrecto");
      }else{
        setError(response.mensaje);
      }
    } catch (err) {
      setError(err.message);
    }
  };



  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-3xl font-extrabold text-white text-center mb-6">Recuperar Contraseña</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col">
          <input type="password" name="contraseniaActual" value={formData.passwordHash} onChange={handleChange} required className="w-full px-4 py-3 mb-4 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-green-400 outline-none" placeholder="Contraseña Actual" />
          <input type="password" name="contraseniaNueva" value={formData.passwordHash} onChange={handleChange} required className="w-full px-4 py-3 mb-4 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-green-400 outline-none" placeholder="Nueva Contraseña" />

          <button type="submit" className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 active:bg-green-700 focus:ring-4 focus:ring-green-400">Cambiar</button>
        </form>
      </div>
    </div>
  );
}


