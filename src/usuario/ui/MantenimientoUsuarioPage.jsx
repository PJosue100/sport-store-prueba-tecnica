import React, { useEffect, useState } from "react";
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';


import { useUser } from "../control/SesionUsuario";
import { ApiService } from "../repositorio/RepositorioUsuario";
import { FaUserCheck, FaBirthdayCake, FaEdit } from "react-icons/fa";

export default function MantenimientoUsuarioPage() {
  const { token } = useUser();
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    direccionEnvio: "",
    email: "",
    fechaNacimiento: "",
    passwordHash: "",
    rol: "cliente",
  });
  const [editingUser, setEditingUser] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const data = await ApiService.obtenerUsuarios(token);
        setUsuarios(data);
      } catch (err) {
        setError("Error al obtener usuarios");
      }
    };
    fetchUsuarios();

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [token]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      if (editingUser) {
        await ApiService.actualizarUsuario(editingUser.id, formData, token);
        setUsuarios((prev) => prev.map((u) => (u.id === editingUser.id ? formData : u)));
      } else {
        const newUser = await ApiService.crearUsuario(formData, token);
        setUsuarios((prev) => [...prev, newUser]);
      }
      setError("");
      handleCancel();
    } catch {
      setError("Error al procesar la solicitud");
    }
  };

  const handleCancel = () => {
    setFormData({
      nombres: "",
      apellidos: "",
      direccionEnvio: "",
      email: "",
      fechaNacimiento: "",
      passwordHash: "",
      rol: "cliente",
    });
    setEditingUser(null);
  };

  const renderMobileUsuario = (usuario) => (
    <div key={usuario.id} className="bg-gray-700 text-white p-4 m-2 rounded-xl shadow-md">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-left">{usuario.nombres} {usuario.apellidos}</h3>
        <button className="px-2 py-1 rounded hover:bg-blue-600 flex items-center gap-1"
          onClick={() => {
            setEditingUser(usuario);
            setFormData(usuario);
          }}
        >
          <FaEdit />
        </button>
      </div>
      <p className="text-sm text-left">{usuario.email}</p>
      <p className="text-sm  text-left">{usuario.direccionEnvio}</p>
      <div className="flex justify-center items-center gap-4 mt-2 text-sm">
        <span className="flex items-center gap-1">
          <FaUserCheck /> {usuario.rol}
        </span>
        <span className="flex items-center gap-1">
          <FaBirthdayCake /> {format(parseISO(usuario.fechaNacimiento), "d MMM yyyy", { locale: es })}
        </span>
      </div>
    </div>
  );

  const renderPcTabla = () => (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-gray-600 text-white">
          <th className="p-2">Nombres</th>
          <th className="p-2">Apellidos</th>
          <th className="p-2">Dirección</th>
          <th className="p-2">Email</th>
          <th className="p-2">Fecha de Nacimiento</th>
          <th className="p-2">Rol</th>
          <th className="p-2">Modificar</th>
        </tr>
      </thead>
      <tbody>
        {usuarios.map((usuario) => (
          <tr key={usuario.id} className="border-b border-gray-500">
            <td className="p-2">{usuario.nombres}</td>
            <td className="p-2">{usuario.apellidos}</td>
            <td className="p-2">{usuario.direccionEnvio}</td>
            <td className="p-2">{usuario.email}</td>
            <td className="p-2">{usuario.fechaNacimiento}</td>
            <td className="p-2">{usuario.rol}</td>
            <td className="p-2">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-lg flex items-center gap-2"
                onClick={() => {
                  setEditingUser(usuario);
                  setFormData(usuario);
                }}
              >
                <FaEdit /> Modificar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="container grid grid-cols-1 md:grid-cols-4 gap-6 px-0 mt-30">
      
      {/* Lista de usuarios */}
      {/* Lista de usuarios solo visible en escritorio */}
      {!isMobile && (
        <div className="md:col-span-3 bg-gray-800 p-6 rounded-xl shadow-lg text-white">
          <h2 className="text-2xl font-bold mb-4">Usuarios</h2>
          {error && <p className="text-red-500">{error}</p>}
          <div className="overflow-x-auto">
            {renderPcTabla()}
          </div>
        </div>
      )}

      {/* Lista de usuarios solo visible en móvil */}
      {isMobile && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">Usuarios</h2>
          {usuarios.map(renderMobileUsuario)}
        </div>
      )}



      {/* Formulario */}
      <div className="md:col-span-1 bg-gray-800 p-6 rounded-xl shadow-lg text-white">
        <h2 className="text-2xl font-bold mb-4">{editingUser ? "Editar Usuario" : "Crear Usuario"}</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col">
          <input type="text" name="nombres" placeholder="Nombres" value={formData.nombres} onChange={handleChange} required className="input" />
          <input type="text" name="apellidos" placeholder="Apellidos" value={formData.apellidos} onChange={handleChange} required className="input" />
          <textarea name="direccionEnvio" placeholder="Dirección" value={formData.direccionEnvio} onChange={handleChange} required className="input" rows={3} />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="input" />
          <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} required className="input" />
          <select name="rol" value={formData.rol} onChange={handleChange} className="input">
            <option value="cliente">Cliente</option>
            <option value="admin">Administrador</option>
          </select>
          <input type="password" name="passwordHash" value={formData.passwordHash} onChange={handleChange} required className="input" placeholder="Password" />

          <div className="flex gap-4">
            <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg">
              {editingUser ? "Actualizar Usuario" : "Crear Usuario"}
            </button>
            <button type="button" onClick={handleCancel} className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


