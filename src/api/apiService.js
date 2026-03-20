import AsyncStorage from "@react-native-async-storage/async-storage";

// AQUI SE COLOCA EL IP IPv4 QUE SE OBTIENE AL INGRESAR EL COMANDO ipconfig en CMD
const BASE_URL = "http://10.3.146.10:8000/api/";

// ========================
//  LOGIN 
// ========================
export const loginService = async (email, password) => {
    try {
        const response = await fetch(`${BASE_URL}auth/login/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Error al iniciar sesión");
        }

        return data;
    } catch (error) {
        throw error;
    }
};

// ========================
//  OBTENER TAREAS
// ========================
export const getTasks = async (token) => {
    try {
        const response = await fetch(`${BASE_URL}tareas/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        const text = await response.text(); // Para depuración
        console.log("RESPUESTA CRUDA:", text);

        const data = JSON.parse(text);

        if (!response.ok) {
            throw new Error(data.error || "Error al obtener tareas");
        }

        return data;
    } catch (error) {
        console.log("ERROR EN API:", error);
        throw error;
    }
};

// ========================
//  CRUD DE TAREAS
// ========================
export const taskService = {
    getAll: (token) =>
        fetch(`${BASE_URL}tareas/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((res) => res.json()),

    create: (token, data) =>
        fetch(`${BASE_URL}tareas/`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }).then((res) => res.json()),

    update: (token, id, data) =>
        fetch(`${BASE_URL}tareas/${id}/`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }).then((res) => res.json()),

    delete: (token, id) =>
        fetch(`${BASE_URL}tareas/${id}/`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }),
};