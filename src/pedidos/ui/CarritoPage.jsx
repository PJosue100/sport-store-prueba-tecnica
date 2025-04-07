import React, { useState, useEffect } from "react";
import { useCart } from "../control/SesionPedido";
import { useUser } from "../../usuario/control/SesionUsuario";
import { ApiService } from "../repositorio/RepositorioPedidos";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";

import useFetchProductos from "../../productos/repositorio/useFetchProductos";

function CarritoPage() {
  const { cart, removeProduct, updateQuantity, clearCart } = useCart();
  const { user, token } = useUser();
  const { actualizarStockProducto } = useFetchProductos(token);

  const [direccionEnvioFinal, setDireccionEnvioFinal] = useState("");

  useEffect(() => {
    if (user?.direccionEnvio) {
      setDireccionEnvioFinal(user.direccionEnvio);
    }
  }, [user]);

  const total = cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  const handleSaveOrder = async () => {
    if (!user) {
      alert("Debe iniciar sesión para realizar un pedido.");
      return;
    }

    if (!direccionEnvioFinal.trim()) {
      alert("Debe ingresar una dirección de envío.");
      return;
    }

    const pedido = {
      idUsuario: user.id,
      fechaPedido: new Date().toISOString(),
      total,
      estado: "Recibido",
      direccionEnvio: direccionEnvioFinal.trim()
    };

    try {
      const response = await ApiService.crearPedido(pedido, token);

      if (!response || !response.id) {
        throw new Error("No se recibió un ID de pedido válido.");
      }

      for (const item of cart) {
        await ApiService.crearDetallePedido({
          idPedido: response.id,
          idProducto: item.idProducto,
          cantidad: item.cantidad,
          precioUnitario: item.precio,
          subtotal: item.precio * item.cantidad,
        }, token);

        await actualizarStockProducto(item.idProducto, item.cantidad);
      }

      alert(`Pedido creado con éxito. ID: ${response.id}`);
      clearCart();
    } catch (error) {
      console.error("Error al crear el pedido:", error);
      alert("Error al crear el pedido.");
    }
  };

  return (
    <div className="container mx-auto px-0 pt-24 pb-20">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-green-400">Carrito de Compras</h1>

      {/* Tarjetas tipo card para todos los dispositivos */}
      <div className="space-y-6 flex flex-col items-center">
        {cart.map((item) => (
          <div
            key={item.idProducto}
            className="flex w-full max-w-5xl bg-gray-800 rounded-xl p-4 shadow-lg"
          >
            <div className="w-full sm:w-36 max-w-full h-[50vw] sm:h-auto">
              <img
                src={item.imagenUrl}
                alt={item.descripcion}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex flex-col justify-between flex-grow ml-2 relative w-full">
              <div >
                <h3 className="text-base font-bold text-green-400 mb-1">{item.descripcion}</h3>
              </div>

              <div className="flex flex-col items-end mt-auto space-y-2">
                <p className="text-sm">Precio: Q {item.precio.toFixed(2)}</p>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => removeProduct(item.idProducto)}
                    className="text-red-500 hover:text-red-600"
                    aria-label="Eliminar producto"
                  >
                    <FaTrash size={18} />
                  </button>
                  <button
                    className="text-white hover:text-green-400 p-1"
                    onClick={() =>
                      updateQuantity(item.idProducto, Math.max(1, item.cantidad - 1))
                    }
                    aria-label="Disminuir cantidad"
                  >
                    <FaMinus />
                  </button>
                  <span className="px-2">{item.cantidad}</span>
                  <button
                    className="text-white hover:text-green-400 p-1"
                    onClick={() => updateQuantity(item.idProducto, item.cantidad + 1)}
                    aria-label="Aumentar cantidad"
                  >
                    <FaPlus />
                  </button>
                </div>

                <p className="text-sm font-bold">
                  Subtotal: Q {(item.precio * item.cantidad).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dirección de envío editable */}
      {cart.length > 0 && (
        <div className="mt-8 max-w-5xl mx-auto bg-gray-800 p-4 rounded-xl shadow-lg text-white">
          <h2 className="text-lg font-bold mb-2">Dirección de envío</h2>
          <input
            type="text"
            value={direccionEnvioFinal}
            onChange={(e) => setDireccionEnvioFinal(e.target.value)}
            placeholder="Ingrese la dirección de envío"
            className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400"
            required
          />
        </div>
      )}


      {/* Total y botón de guardar */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-6 bg-gray-800 p-4 rounded-xl shadow-lg text-white max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold">Total: Q {total.toFixed(2)}</h2>
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg mt-4 md:mt-0"
          onClick={handleSaveOrder}
        >
          Confirmar Pedido
        </button>
      </div>
    </div>
  );
}

export default CarritoPage;
