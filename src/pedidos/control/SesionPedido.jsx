import React, { createContext, useState, useContext } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  const addProduct = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((p) => p.idProducto === product.idProducto);
      let updatedCart;
  
      if (existingProduct) {
        const nuevaCantidad = existingProduct.cantidad + product.cantidad;
        if (nuevaCantidad <= existingProduct.unidadesDisponibles) {
          updatedCart = prevCart.map((p) =>
            p.idProducto === product.idProducto ? { ...p, cantidad: nuevaCantidad } : p
          );
        } else {
          console.warn(`No se pueden agregar ${product.cantidad} unidades. Solo quedan ${existingProduct.unidadesDisponibles - existingProduct.cantidad} disponibles.`);
          updatedCart = prevCart;
        }
      } else {
        if (product.cantidad <= product.unidadesDisponibles) {
          updatedCart = [...prevCart, product];
        } else {
          console.warn(`Cantidad inicial (${product.cantidad}) excede las unidades disponibles (${product.unidadesDisponibles}) para el producto ${product.idProducto}`);
          updatedCart = prevCart;
        }
      }
  
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const removeProduct = (productId) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((p) => p.idProducto !== productId);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const updateQuantity = (productId, quantity) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((p) => {
        if (p.idProducto === productId) {
          if (quantity <= p.unidadesDisponibles) {
            return { ...p, cantidad: quantity };
          } else {
            console.warn(`Cantidad solicitada (${quantity}) excede las unidades disponibles (${p.unidadesDisponibles}) para el producto ${p.idProducto}`);
            return p; // No modifica la cantidad si excede las unidades disponibles
          }
        }
        return p;
      });
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider value={{ cart, addProduct, removeProduct, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}