import React, { createContext, useState, useContext } from "react";

const API_URL = "http://192.168.0.74:8084/api/usuarios/";
const UserContext = createContext();

export class ApiService {
  static async loginUser(email, password) {
    try {
      const response = await fetch(`${API_URL}login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, passwordHash: password })
      });
      if (response.status === 200) {
        return { success: true, token: await response.text() };
      }
      return { success: false };
    } catch (error) {
      console.error("Error en la autenticación:", error);
      return { success: false };
    }
  }

  static async recoveryPassUser(email) {
    try {
      const response = await fetch(`${API_URL}recovery-pass`, {
        method: "PUT",
        headers: { "Content-Type": "text/plain" },
        body: email
      });
      if (response.status === 200) {
        return { success: true, mensaje: await response.text() };
      }
      return { success: false };
    } catch (error) {
      console.error("Error en la autenticación:", error);
      return { success: false };
    }
  }

  static async cambiarContraseniaUsuario(id, formulario, token) {
    try {
      const response = await fetch(`${API_URL}change-pass/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": token },
        body: JSON.stringify({contraseniaActual: formulario.contraseniaActual, contraseniaNueva: formulario.contraseniaNueva })
      });
      if (response.status === 200) {
        return { success: true, mensaje: await response.text() };
      }
      return { success: false };
    } catch (error) {
      console.error("Error en la autenticación:", error);
      return { success: false };
    }
  }







  static async obtenerDatosUsuario(email, token) {
    console.log(email);
    console.log(token);
    console.log(`${API_URL}email/${email}`);
    
    try {
      const response = await fetch(`${API_URL}email/${email}`, {
        method: "GET",
        headers: { "Authorization": token }
      });
      if (response.status === 403) throw new Error("Acceso denegado");
      return response.json();
    } catch (error) {
      console.error("Error al obtener datos del usuario:", error);
      throw error;
    }
  }

  static async crearUsuario(usuario) {
    try {
      const response = await fetch(`${API_URL}new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuario)
      });
      return response.json();
    } catch (error) {
      console.error("Error al crear usuario:", error);
      throw error;
    }
  }

  static async actualizarUsuario(id, usuario, token) {
    try {
      const response = await fetch(`${API_URL}${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": token },
        body: JSON.stringify(usuario)
      });
      return response.json();
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      throw error;
    }
  }

  static async obtenerUsuarios(token) {
    try {
      const response = await fetch(`${API_URL}all`, {
        method: "GET",
        headers: { "Authorization": token }
      });
      return response.json();
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      throw error;
    }
  }

  static async obtenerUsuarioPorId(id, token) {
    try {
      const response = await fetch(`${API_URL}${id}`, {
        method: "GET",
        headers: { "Authorization": token }
      });
      return response.json();
    } catch (error) {
      console.error("Error al obtener usuario por ID:", error);
      throw error;
    }
  }
}

/*import { useState, useEffect } from "react";

const API_URL = "http://192.168.0.74:8080/api/usuarios/";
//const API_URL = "http://10.1.0.86:8082/api/usuarios/";

export async function loginUser(email, password) {
  
  console.log(email);
  console.log(password);

  const raw = JSON.stringify({
    "email": email,
    "passwordHash": password
  });

  try {
    const response = await fetch(API_URL+"login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: raw,
    });

    if (response.status === 200) {
      const token = await response.text(); // Extrae el token de la respuesta
      return { success: true, token };
    }
    return { success: false };
  } catch (error) {
    console.error("Error en la autenticación:", error);
    return { success: false };
  }
}



export async function datosusuario(email, token) {
  if (!token) {
    throw new Error("Token de autenticación no disponible");
  }

  try {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", token);
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    const url = API_URL + "email/" + String(email);
    const response = await fetch(url, requestOptions);

    if (response.status === 403) {
      throw new Error("Acceso denegado. Token inválido o expirado.");
    }

    var  a = await response.json();
    console.log(a);
    return a;
  } catch (error) {
    console.error("Error al obtener datos del usuario:", error);
    throw error;
  }
}


export async function crearUsuario(usuario, token) {
  token = "Bearer "+token;
  try {
    const response = await fetch(`${API_URL}new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify(usuario)
    });
    return response.json();
  } catch (error) {
    console.error("Error al crear usuario:", error);
    throw error;
  }
}

export async function actualizarUsuario(id, usuario, token) {
  token = "Bearer "+token;
  try {
    const response = await fetch(`${API_URL}${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify(usuario)
    });
    return response.json();
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    throw error;
  }
}

export async function obtenerUsuarios(token) {
  token = "Bearer "+token;
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Authorization": token
      }
    });
    return response.json();
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    throw error;
  }
}

export async function obtenerUsuarioPorId(id, token) {
  token = "Bearer "+token;
  try {
    const response = await fetch(`${API_URL}${id}`, {
      method: "GET",
      headers: {
        "Authorization": token
      }
    });
    return response.json();
  } catch (error) {
    console.error("Error al obtener usuario por ID:", error);
    throw error;
  }
}
*/