const API_URL = "http://192.168.0.74:8086/api/";

export class ApiService {
  static async crearPedido(pedido, token) {
    try {
      const response = await fetch(`${API_URL}pedidos/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify(pedido)
      });
      return response.json();
    } catch (error) {
      console.error("Error al crear pedido:", error);
      throw error;
    }
  }

  static async obtenerPedidosPublicos() {
    try {
      const response = await fetch(`${API_URL}pedidos/publico`, {
        method: "GET"
      });
      return response.json();
    } catch (error) {
      console.error("Error al obtener pedidos públicos:", error);
      throw error;
    }
  }

  static async obtenerPedidoPorID(id, token) {
    try {
      const response = await fetch(`${API_URL}pedidos/pedido/${id}`, {
        method: "GET",
        headers: { "Authorization": token }
      });
      return response.json();
    } catch (error) {
      console.error("Error al obtener pedido por ID:", error);
      throw error;
    }
  }

  static async obtenerPedidosPorUsuario(idUsuario, token) {
    try {
      const response = await fetch(`${API_URL}pedidos/usuario/${idUsuario}`, {
        method: "GET",
        headers: { "Authorization": token }
      });
      return response.json();
    } catch (error) {
      console.error("Error al obtener pedidos por usuario:", error);
      throw error;
    }
  }

  static async actualizarPedido(id, pedido, token) {
    try {
      const response = await fetch(`${API_URL}pedidos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify(pedido)
      });
      return response.json();
    } catch (error) {
      console.error("Error al actualizar pedido:", error);
      throw error;
    }
  }

  static async actualizarEstadoPedido(id, estado, token) {
    try {
      const response = await fetch(`${API_URL}pedidos/estado/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify({ estado })
      });
      return response.json();
    } catch (error) {
      console.error("Error al actualizar estado del pedido:", error);
      throw error;
    }
  }

  static async crearDetallePedido(detalle, token) {
    try {
      const response = await fetch(`${API_URL}detalle_pedidos/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify(detalle)
      });
      return response.json();
    } catch (error) {
      console.error("Error al crear detalle de pedido:", error);
      throw error;
    }
  }

  static async obtenerDetallesPedidoPublicos(token) {
    try {
      const response = await fetch(`${API_URL}detalle_pedidos/publico`, {
        method: "GET",
        headers: { "Authorization": token }
      });
      return response.json();
    } catch (error) {
      console.error("Error al obtener detalles de pedidos públicos:", error);
      throw error;
    }
  }

  static async obtenerDetallePedidoPorID(id, token) {
    try {
      const response = await fetch(`${API_URL}detalle_pedidos/detallePedido/${id}`, {
        method: "GET",
        headers: { "Authorization": token }
      });
      return response.json();
    } catch (error) {
      console.error("Error al obtener detalle de pedido por ID:", error);
      throw error;
    }
  }

  static async obtenerDetallesPorPedido(idPedido, token) {
    try {
      const response = await fetch(`${API_URL}detalle_pedidos/pedido/${idPedido}`, {
        method: "GET",
        headers: { "Authorization": token }
      });
      return response.json();
    } catch (error) {
      console.error("Error al obtener detalles del pedido:", error);
      throw error;
    }
  }

  static async actualizarDetallePedido(id, detalle, token) {
    try {
      const response = await fetch(`${API_URL}detalle_pedidos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify(detalle)
      });
      return response.json();
    } catch (error) {
      console.error("Error al actualizar detalle del pedido:", error);
      throw error;
    }
  }

  static async eliminarDetallePedido(id, token) {
    try {
      const response = await fetch(`${API_URL}detalle_pedidos/${id}`, {
        method: "DELETE",
        headers: { "Authorization": token }
      });
      return response.json();
    } catch (error) {
      console.error("Error al eliminar detalle del pedido:", error);
      throw error;
    }
  }
}
