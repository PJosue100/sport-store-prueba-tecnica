import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ApiService } from "../repositorio/RepositorioUsuario";
import { useUser } from "../control/SesionUsuario";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login, usuarioActual } = useUser();

  const handleLogin = async () => {
    setError(null);
    try {
      const response = await ApiService.loginUser(email, password);
      if (!response.success) {
        throw new Error("Credenciales incorrectas");
      }
      
      const token = response.token;
      login(token);
      
      const userData = await ApiService.obtenerDatosUsuario(email, token);
      usuarioActual(userData);
      
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-3xl font-extrabold text-white text-center mb-6">Iniciar sesión</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 mb-4 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 mb-4 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
        />
        <button onClick={handleLogin} className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 active:bg-green-700 focus:ring-4 focus:ring-green-400">Acceder</button>
        <Link to="/recovery-pass" className="relative">
          <button className="w-full bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded mt-4">Recuperar Contraseña</button>
        </Link>  
        <p className="mt-4 text-center text-gray-400">
          ¿No tienes cuenta? <a href="/registro" className="text-green-400 hover:text-green-300">Regístrate</a>
        </p>
      </div>
    </div>
  );
}
