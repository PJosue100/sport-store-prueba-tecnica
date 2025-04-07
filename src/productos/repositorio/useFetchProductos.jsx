import { useState, useEffect } from "react";

const API_URL = "http://192.168.0.74:8085/api/productos";
//const API_URL = "http://192.168.0.74:8080/api/productos/publico";

function useFetchProductos(token) {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/publico`)
      .then((response) => {
        if (response.status === 403) {
          throw new Error("Acceso denegado");
        }
        return response.json();
      })
      .then((data) => setProductos(data))
      .catch((err) => setError(err.message));
  }, []);

  const crearProducto = async (producto) => {
    const response = await fetch(`${API_URL}/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(producto),
    });

    if (!response.ok) {
      throw new Error("Error al crear el producto");
    }
    const nuevoProducto = await response.json();
    setProductos((prev) => [...prev, nuevoProducto]);
  };

  const actualizarProducto = async (id, producto) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(producto),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar el producto");
    }
    setProductos((prev) => prev.map((p) => (p.id === id ? { ...p, ...producto } : p)));
  };

  const actualizarStockProducto = async (id, cantidadVendida) => {
    const response = await fetch(`${API_URL}/update-stock/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "text/plain",
        Authorization: token,
      },
      body: cantidadVendida,
    });

    if (!response.ok) {
      throw new Error("Error al actualizar stock el producto");
    }

    const productoActualizado = await response.json();

    setProductos((prev) => prev.map((p) => (p.id === id ? { ...p, ...productoActualizado } : p)));
  };

  return { productos, error, crearProducto, actualizarProducto, actualizarStockProducto };
}

export default useFetchProductos;
