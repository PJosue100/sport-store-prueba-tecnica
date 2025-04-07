import React, { useEffect, useState } from "react";
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

import { useUser } from "../../usuario/control/SesionUsuario";
import { ApiService } from "../repositorio/RepositorioPedidos";
import useFetchProductos from "../../productos/repositorio/useFetchProductos";

function PedidosPage() {
  const { user, token } = useUser();
  const [pedidos, setPedidos] = useState([]);
  const [detalles, setDetalles] = useState({});
  const [productosInfo, setProductosInfo] = useState({});
  const { error } = useFetchProductos(token);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (user) obtenerPedidos();

    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize(); // inicial
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [user]);

  const obtenerPedidos = async () => {
    try {
      const pedidosUsuario = await ApiService.obtenerPedidosPorUsuario(user.id, token);
      setPedidos(pedidosUsuario);
      pedidosUsuario.forEach(async (pedido) => {
        const detallesPedido = await ApiService.obtenerDetallesPorPedido(pedido.id, token);
        setDetalles(prev => ({ ...prev, [pedido.id]: detallesPedido }));
        detallesPedido.forEach(async (detalle) => {
          const producto = await obtenerProductoPorId(detalle.idProducto);
          setProductosInfo(prev => ({ ...prev, [detalle.idProducto]: producto }));
        });
      });
    } catch (error) {
      console.error("Error al obtener pedidos:", error);
    }
  };

  const obtenerProductoPorId = async (idProducto) => {
    try {
      const response = await fetch(`http://192.168.0.74:8085/api/productos/${idProducto}`, {
        method: "GET",
        headers: { Authorization: token },
      });
      if (!response.ok) throw new Error("Error al obtener producto");
      return await response.json();
    } catch (error) {
      console.error("Error al obtener producto:", error);
      return null;
    }
  };

  const renderStatusBadge = (status) => {
    let colorClasses = '';
    let text = status;
    switch (status.toLowerCase()) {
      case 'recibido': colorClasses = 'bg-blue-100 text-blue-800'; break;
      case 'en preparación': colorClasses = 'bg-yellow-100 text-yellow-800'; break;
      case 'en tránsito': colorClasses = 'bg-purple-100 text-purple-800'; break;
      case 'entregado': colorClasses = 'bg-green-100 text-green-800'; break;
      case 'reprogramado para entrega': colorClasses = 'bg-orange-100 text-orange-800'; break;
      case 'cancelado': colorClasses = 'bg-red-100 text-red-800'; break;
      default: colorClasses = 'bg-gray-200 text-gray-800'; break;
    }
    return <span className={`px-3 py-1 rounded-full text-sm font-semibold ${colorClasses}`}>{text}</span>;
  };

  const renderMobilePedido = (pedido) => (
    <div key={pedido.id} className="bg-gray-800 p-4 mb-6 rounded-lg shadow-md">
      <div className="flex justify-between mb-2">
        <div className="text-left">
          <h2 className="text-xl text-green-400">Pedido No. {pedido.id}</h2>
          <p className="text-gray-300 text-sm">{format(parseISO(pedido.fechaPedido), "d MMM yyyy, HH:mm", { locale: es })}</p>
        </div>
        <div>{renderStatusBadge(pedido.estado)}</div>
      </div>
      <div>
        {detalles[pedido.id]?.map((detalle) => {
          const producto = productosInfo[detalle.idProducto];
          return (
            <div key={detalle.id} className="flex items-start justify-between mb-4">
              {producto?.imagenUrl ? (
                <img src={producto.imagenUrl} alt={producto.descripcion} className="w-16 h-16 object-cover rounded" />
              ) : (
                <div className="w-16 h-16 bg-gray-600 rounded" />
              )}
              <div className="flex-1 ml-3 text-left">
                <p className="text-white font-medium">{producto?.descripcion || "Cargando..."}</p>
                <p className="text-gray-400 text-sm">
                  Q {producto?.precio}.00 × {detalle.cantidad}
                </p>
              </div>
              <p className="text-green-400 font-semibold">
                Q {detalle.cantidad * (producto?.precio || 0)}.00
              </p>
            </div>
          );
        })}
      </div>
      <p className="text-right text-green-400 text-lg font-bold mt-2">
        Total: Q {detalles[pedido.id]?.reduce((total, d) => total + (d.cantidad * (productosInfo[d.idProducto]?.precio || 0)), 0)}.00
      </p>
    </div>
  );

  const renderPcPedido = (pedido) => (
    <div key={pedido.id} className="bg-gray-800 p-6 mb-6 rounded-lg shadow-md">
      <h2 className="text-2xl text-green-400">Pedido No. {pedido.id}</h2>
      <p className="text-gray-300">Fecha: {format(parseISO(pedido.fechaPedido), "d MMM yyyy, HH:mm", { locale: es })}</p>
      {renderStatusBadge(pedido.estado)}
      <table className="w-full mt-4 border-collapse">
        <thead>
          <tr className="bg-gray-700 text-left text-white">
            <th className="p-3">Imagen</th>
            <th className="p-3">Producto</th>
            <th className="p-3">Cantidad</th>
            <th className="p-3">Precio</th>
            <th className="p-3">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {detalles[pedido.id]?.map((detalle) => {
            const producto = productosInfo[detalle.idProducto];
            return (
              <tr key={detalle.id} className="border-b border-gray-600">
                <td className="p-3">
                  {producto?.imagenUrl ? (
                    <img src={producto.imagenUrl} alt={producto.descripcion} className="w-16 h-16 object-cover rounded" />
                  ) : "Cargando..."}
                </td>
                <td className="p-3 text-white">{producto?.descripcion || "Cargando..."}</td>
                <td className="p-3 text-green-400">{detalle.cantidad}</td>
                <td className="p-3 text-green-400">Q {producto?.precio}.00</td>
                <td className="p-3 text-green-400">Q {detalle.cantidad * (producto?.precio || 0)}.00</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="text-right text-green-400 text-lg font-bold mt-4">
        Total: Q {detalles[pedido.id]?.reduce((total, d) => total + (d.cantidad * (productosInfo[d.idProducto]?.precio || 0)), 0)}.00
      </p>
    </div>
  );

  return (
    <div className="container mx-auto px-0 pt-24 pb-20">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-green-400">Mis Pedidos</h1>
      {pedidos.length === 0 ? (
        <p className="text-center text-lg text-gray-300">No hay pedidos disponibles.</p>
      ) : (
        <div className={isMobile ? "" : "overflow-x-auto"}>
          {pedidos.map(pedido => isMobile ? renderMobilePedido(pedido) : renderPcPedido(pedido))}
        </div>
      )}
      {error && <p className="text-red-500 text-center">Error al cargar productos: {error}</p>}
    </div>
  );
}

export default PedidosPage;
