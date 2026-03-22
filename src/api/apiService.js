import AsyncStorage from "@react-native-async-storage/async-storage";

// AQUI SE COLOCA EL IP IPv4 QUE SE OBTIENE AL INGRESAR EL COMANDO ipconfig en CMD
const BASE_URL = "http://192.168.100.216:8000/api/";

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

export const createTask = async (data, token) => {
    try {
        const response = await fetch(
            `${BASE_URL}tareas/`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Error al crear tarea");
        }

        return result;
    } catch (error) {
        console.log("ERROR CREATE:", error);
        throw error;
    }
};

export const deleteTask = async (taskId, token) => {
    try {
        const response = await fetch(
            `${BASE_URL}tareas/${taskId}/`,
            {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Error al eliminar");
        }

        return true;
    } catch (error) {
        console.log("ERROR DELETE:", error);
        throw error;
    }
};

export const updateTask = async (taskId, data, token) => {
    try {
        const response = await fetch(
            `${BASE_URL}tareas/${taskId}/`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Error al actualizar");
        }

        return result;
    } catch (error) {
        console.log("ERROR UPDATE:", error);
        throw error;
    }
};

export const getUserProfile = async (token) => {
    try {
        const response = await fetch(`${BASE_URL}perfil/foto/`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        const text = await response.text(); // 👈 CAMBIO CLAVE
        console.log("RESPUESTA PERFIL CRUDA:", text);

        const data = JSON.parse(text); // 👈 puede fallar

        if (!response.ok) {
            throw new Error(data.error || "Error al obtener perfil");
        }

        return data;

    } catch (error) {
        console.log("ERROR PERFIL:", error);
        throw error;
    }
};