import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Button, Alert, TextInput } from "react-native";

import { AuthContext } from "../context/AuthContext";

import { getTasks, deleteTask, updateTask, createTask } from "../api/apiService";

const TaskScreen = ({ setScreen }) => {
    const { userToken, logout } = useContext(AuthContext);

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [newTaskDescription, setNewTaskDescription] = useState("");
    const [showForm, setShowForm] = useState(false);

    const [editingTask, setEditingTask] = useState(null);
    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");

    // 🔥 Cargar tareas
    const loadTasks = async () => {
        try {
            console.log("TOKEN:", userToken);

            const data = await getTasks(userToken);

            console.log("RESPUESTA API:", data);

            setTasks(data.datos || []);
        } catch (error) {
            console.log("ERROR:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!newTaskTitle.trim() || !newTaskDescription.trim()) {
            Alert.alert("Error", "Todos los campos son obligatorios");
            return;
        }

        try {
            const data = {
                titulo: newTaskTitle,
                descripcion: newTaskDescription,
            };

            const response = await createTask(data, userToken);

            // 🔥 agregar al inicio de la lista
            setTasks((prev) => [
                {
                    id: response.id,
                    ...data,
                },
                ...prev,
            ]);

            // reset
            setNewTaskTitle("");
            setNewTaskDescription("");
            setShowForm(false);

        } catch (error) {
            console.log("ERROR CREATE:", error);
        }
    };

    const handleDelete = (taskId) => {
        Alert.alert(
            "Eliminar tarea",
            "¿Seguro que quieres eliminar esta tarea?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteTask(taskId, userToken);

                            setTasks((prevTasks) =>
                                prevTasks.filter((task) => task.id !== taskId)
                            );
                        } catch (error) {
                            console.log("ERROR:", error);
                        }
                    },
                },
            ]
        );
    };

    const startEditing = (task) => {
        setEditingTask(task.id);
        setNewTitle(task.titulo);
        setNewDescription(task.descripcion);
    };

    const handleUpdate = async () => {
        try {
            const updatedData = {
                titulo: newTitle,
                descripcion: newDescription,
            };

            await updateTask(editingTask, updatedData, userToken);

            // 🔥 Actualizar estado local
            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task.id === editingTask
                        ? { ...task, ...updatedData }
                        : task
                )
            );

            // Reset
            setEditingTask(null);
            setNewTitle("");
            setNewDescription("");

        } catch (error) {
            console.log("ERROR UPDATE:", error);
        }
    };

    useEffect(() => {
        if (userToken) {
            loadTasks();
        }
    }, [userToken]);

    // ⏳ Loading
    if (loading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    // 📱 UI
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Mis tareas :)</Text>

            <Button style={styles.button} title="Ver Datos del Usuario" onPress={() => setScreen("user")}/>
            <Button style={styles.button} color="purple" title="➕ Añadir tarea" onPress={() => setShowForm(true)}/>

            {showForm && (
                <View style={styles.card}>
                    <TextInput style={styles.input} value={newTaskTitle} onChangeText={setNewTaskTitle} placeholder="Título" placeholderTextColor="#888"/>
                    <TextInput style={styles.input} value={newTaskDescription} onChangeText={setNewTaskDescription} placeholder="Descripción" placeholderTextColor="#888"/>
                    <Button title="Crear" color="green" onPress={handleCreate} />
                    <Button title="Cancelar" color="red" onPress={() => setShowForm(false)} />
                </View>
            )}

            <FlatList data={tasks} keyExtractor={(item) => item.id.toString()}

                ListEmptyComponent={
                    <Text style={styles.empty}>No hay tareas</Text>
                }

                renderItem={({ item }) => (
                    <View style={styles.card}>
                        {editingTask === item.id ? (
                            <>
                                <TextInput style={styles.input} value={newTitle} onChangeText={setNewTitle} placeholder="Título" placeholderTextColor="#888"/>
                                <TextInput style={styles.input} onChangeText={setNewDescription} value={newDescription} placeholder="Descripción" placeholderTextColor="#888"/>
                                <Button style={styles.button} title="Guardar" color="green" onPress={handleUpdate}/>
                                <Button style={styles.button} title="Cancelar" color="red" onPress={() => setEditingTask(null)}/>
                            </>
                        ) : (
                            <>
                                <Text style={styles.title}>{item.titulo}</Text>
                                <Text style={styles.description}>{item.descripcion}</Text>
                                <Button style={styles.button} title="Editar" color="green" onPress={() => startEditing(item)}/>
                                <Button style={styles.button} title="Eliminar" color="red" onPress={() => handleDelete(item.id)}/>
                            </>
                        )}
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1a1a1a",
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1a1a1a",
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#ffffff",
        marginBottom: 20,
        marginTop: 40,
        textAlign: "center",
    },
    card: {
        backgroundColor: "#2a2a2a",
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: "#007AFF",
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
        color: "#ffffff",
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: "#b0b0b0",
        lineHeight: 20,
        marginBottom: 20,
    },
    empty: {
        textAlign: "center",
        color: "#808080",
        fontSize: 16,
        marginTop: 40,
    },
    input: {
        backgroundColor: "#333",
        color: "#fff",
        padding: 10,
        borderRadius: 6,
        marginBottom: 10,
    }
});

export default TaskScreen;