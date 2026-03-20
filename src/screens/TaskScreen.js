import React, { useEffect, useState, useContext } from "react";
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    StyleSheet,
    Button
} from "react-native";

import { AuthContext } from "../context/AuthContext";
import { getTasks } from "../api/apiService";

// 🔐 Firebase logout
import { signOut } from "firebase/auth";
import { auth } from "../Firebase/firebaseConfig";

const TaskScreen = () => {
    const { userToken, logout } = useContext(AuthContext);

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

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

    // 🔐 Cerrar sesión
    const handleLogout = async () => {
        try {
            await signOut(auth); // Firebase
            logout(); // Contexto
        } catch (error) {
            console.log("ERROR LOGOUT:", error);
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
            <Button style={styles.cs} title="Cerrar sesión" onPress={handleLogout}/>

            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={
                    <Text style={styles.empty}>No hay tareas</Text>
                }
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.title}>{item.titulo}</Text>
                        <Text style={styles.description}>{item.descripcion}</Text>
                        
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
    },
    empty: {
        textAlign: "center",
        color: "#808080",
        fontSize: 16,
        marginTop: 40,
    },
});

export default TaskScreen;