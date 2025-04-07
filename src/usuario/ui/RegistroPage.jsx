import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiService } from "../repositorio/RepositorioUsuario";

export default function RegistroPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    direccionEnvio: "",
    email: "",
    fechaNacimiento: "",
    passwordHash: "",
    rol: "cliente", // Fijo
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calcularEdad = (fechaNacimiento) => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  const esCorreoValido = (correo) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
  };

  const handleRegister = async () => {
    setError(null);
    setSuccess(null);


    if(formData.nombres=="" || formData.apellidos == "" || formData.direccionEnvio == "" || formData.email == "" || formData.fechaNacimiento == "" || formData.passwordHash == ""){
      setError("Agregar los campos faltantes.");
      return;
    }

    const edad = calcularEdad(formData.fechaNacimiento);
    if (edad < 18) {
      setError("Solo se permite el registro de usuarios mayores de edad.");
      return;
    }

    if (!esCorreoValido(formData.email)) {
      setError("El correo electrónico ingresado no tiene un formato válido.");
      return;
    }

    try {
      const nuevoUsuario = await ApiService.crearUsuario(formData);
      setSuccess("Cuenta creada con éxito. Ahora puede iniciar sesión.");
      setTimeout(() => {
        navigate("/iniciosesion");
      }, 1500);
    } catch (err) {
      setError("Error al crear la cuenta. Verifique los datos ingresados.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-0 mt-20">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-3xl font-extrabold text-white text-center mb-6">Crear cuenta</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-400 text-center mb-4">{success}</p>}

        <div className="flex flex-col space-y-4">
          <input type="text" name="nombres" placeholder="Nombres" value={formData.nombres} onChange={handleChange} className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-green-400 outline-none" required />
          <input type="text" name="apellidos" placeholder="Apellidos" value={formData.apellidos} onChange={handleChange} className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-green-400 outline-none" required />
          <textarea name="direccionEnvio" placeholder="Dirección de envío" value={formData.direccionEnvio} onChange={handleChange} rows={3} className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-green-400 outline-none resize-none" required />
          <input type="email" name="email" placeholder="Correo electrónico" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-green-400 outline-none" required />
          <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-green-400 outline-none" required />
          <input type="password" name="passwordHash" placeholder="Contraseña" value={formData.passwordHash} onChange={handleChange} className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-green-400 outline-none" required />
        </div>

        <button onClick={handleRegister} className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 active:bg-green-700 focus:ring-4 focus:ring-green-400 mt-6">Registrarse</button>

        <p className="mt-4 text-center text-gray-400">
          ¿Ya tienes cuenta? <a href="/iniciosesion" className="text-green-400 hover:text-green-300">Inicia sesión</a>
        </p>
      </div>
    </div>
  );
}
