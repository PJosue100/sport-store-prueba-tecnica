import React, { useState } from "react";
import { useUser } from "../../usuario/control/SesionUsuario";
import useFetchProductos from "../repositorio/useFetchProductos";
import { FaEdit } from "react-icons/fa";

export default function MantenimientoProductosPage() {
  const { token } = useUser();
  const { productos, error, crearProducto, actualizarProducto } = useFetchProductos(token);
  const [formData, setFormData] = useState({
    imagenUrl: "",
    descripcion: "",
    descripcionExtensa: "",
    precio: "",
    unidadesDisponibles: "",
    creadoEn: new Date().toISOString(),
  });
  const [editingProducto, setEditingProducto] = useState(null);
  const [mensaje, setMensaje] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProducto) {
        await actualizarProducto(editingProducto.id, formData);
        setMensaje("Producto actualizado correctamente.");
      } else {
        await crearProducto(formData);
        setMensaje("Producto creado correctamente.");
      }
      setFormData({
        imagenUrl: "",
        descripcion: "",
        descripcionExtensa: "",
        precio: "",
        unidadesDisponibles: "",
        creadoEn: new Date().toISOString(),
      });
      setEditingProducto(null);
    } catch {
      setMensaje("Error al procesar la solicitud.");
    }
  };


  const handleCancel = () => {
    setFormData({
      imagenUrl: "",
      descripcion: "",
      descripcionExtensa: "",
      precio: "",
      unidadesDisponibles: "",
      creadoEn: new Date().toISOString(),
    });
    setEditingProducto(null);
  };

  return (
    <div className="container grid grid-cols-1 md:grid-cols-4 gap-6 px-0 mt-30">
      {/* Lista de productos */}
      <div className="md:col-span-3">
        <h2 className="text-2xl font-bold text-white mb-4">Productos</h2>
        {mensaje && <p className={mensaje.includes("Error") ? "text-red-500" : "text-green-400"}>{mensaje}</p>}
        {error && <p className="text-red-500">{error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-4">
          {productos.map((producto) => (
            <div key={producto.id} className="bg-gray-700 p-4 rounded-lg shadow-md text-white">
              {/* PC: fila | Móvil: columna */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                {/* Imagen (fila única en móvil, columna en PC) */}
                <div className="sm:w-20 sm:h-20 flex justify-center">
                  <img
                    src={producto.imagenUrl}
                    alt={producto.descripcion}
                    className="w-full h-40 sm:w-20 sm:h-20 object-cover rounded"
                  />
                </div>

                {/* Contenido en columna en móvil */}
                <div className="flex flex-col flex-1 justify-between gap-2">
                  {/* Descripción */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                    <p className="text-lg font-semibold">{producto.descripcion}</p>
                  </div>

                  {/* Stock y Precio */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 text-sm text-gray-200">
                    <span>{producto.unidadesDisponibles} en stock | Q{producto.precio} c/u</span>
                  </div>

                  {/* Descripción detallada */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                    <p className="text-sm text-gray-300 line-clamp-2 sm:text-left">{producto.descripcionExtensa}</p>
                  </div>
                </div>

                {/* Botón editar */}
                <div className="sm:ml-4 sm:mt-0 mt-2 flex justify-center">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-lg flex items-center gap-2 "
                    onClick={() => {
                      setEditingProducto(producto);
                      setFormData(producto);
                    }}
                  >
                    <FaEdit size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>

      {/* Formulario */}
      <div className="md:col-span-1 bg-gray-800 p-6 rounded-xl shadow-lg text-white">
        <h2 className="text-2xl font-bold mb-4">{editingProducto ? "Editar Producto" : "Crear Producto"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col">
          <input type="text" name="imagenUrl" placeholder="URL de la Imagen" value={formData.imagenUrl} onChange={handleChange} required className="input" />
          {formData.imagenUrl && (
            <div className="w-full h-64 flex justify-center items-center bg-gray-700 rounded-lg overflow-hidden">
              <img src={formData.imagenUrl} alt="Vista previa" className="h-full object-cover" />
            </div>
          )}
          <input type="text" name="descripcion" placeholder="Descripción" value={formData.descripcion} onChange={handleChange} required className="input" />
          <textarea name="descripcionExtensa" placeholder="Detalles" value={formData.descripcionExtensa} onChange={handleChange} required className="input" maxLength={2000} rows={10}/>
          <input type="number" name="precio" placeholder="Precio" value={formData.precio} onChange={handleChange} required className="input" />
          <input type="number" name="unidadesDisponibles" placeholder="Unidades Disponibles" value={formData.unidadesDisponibles} onChange={handleChange} required className="input" />

          <div className="flex gap-4">
            <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg">
              {editingProducto ? "Actualizar Producto" : "Crear Producto"}
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
