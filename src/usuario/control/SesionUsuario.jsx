import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserContext = createContext();
//const navigate = useNavigate(); ---Hacer despues

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("userToken") || null;
  });

  const [filtroHeader, setFiltroHeader] = useState(() => {
    return localStorage.getItem("filtroHeader") || null;
  });


  const usuarioActual = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const login = (tokenData) => {
    setToken(tokenData);
    localStorage.setItem("userToken", tokenData);
  };

  const filtroHeaderActual = (filtro) => {
    setFiltroHeader(filtro);
    localStorage.setItem("filtroHeader", filtro);
  };


  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("userToken");
  };

  return (
    <UserContext.Provider value={{ user, token, filtroHeader, usuarioActual, filtroHeaderActual, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}


/*import React, { createContext, useState, useContext, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  
  // Estado para almacenar el usuario
  const [user, setUser] = useState(() => {
    // Cargar el usuario desde localStorage si existe
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Función para iniciar sesión y guardar usuario en localStorage

  const usuarioActual = (user) => {
    setUser({ user });
    localStorage.setItem("user", user); // Guarda en localStorage
  };


  // Función para iniciar sesión y guardar usuario en localStorage
  const [token, setToken] = useState(null);

  const login = (token) => {
    setToken({ token });
    localStorage.setItem("userToken", token); // Guarda en localStorage
  };




  // Función para cerrar sesión y limpiar localStorage
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user"); // Elimina la sesión
  };

  return (
    <UserContext.Provider value={{ user,usuarioActual, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

// Hook personalizado para acceder al contexto
export function useUser() {
  return useContext(UserContext);
}*/



/*import React, { createContext, useState, useContext } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (token) => {
    setUser({ token });
    localStorage.setItem("userToken", token); // Guarda en localStorage
  };

  return (
    <UserContext.Provider value={{ user, login }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}*/






