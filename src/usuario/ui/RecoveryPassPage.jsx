import React, { useState } from "react";
import { ApiService } from "../repositorio/RepositorioUsuario";

export default function RecoveryPassPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);


  const handleLogin = async () => {
    setError(null);
    try {
      const response = await ApiService.recoveryPassUser(email);
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
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <input
          type="email"
          placeholder="Correo electrónico asociado"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 mb-4 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
        />
        <button onClick={handleLogin} className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 active:bg-green-700 focus:ring-4 focus:ring-green-400">Recuperar</button>
        <p className="mt-4 text-center text-gray-400">
          <a href="/iniciosesion" className="text-green-400 hover:text-green-300">Inicia sesión</a>
        </p>
      </div>
    </div>
  );
}
