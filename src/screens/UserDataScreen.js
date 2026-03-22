import React, { useContext, useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, Image } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../Firebase/firebaseConfig";


const UserDataScreen = ({ setScreen }) => {
    const { user, logout, userToken } = useContext(AuthContext);
    const [foto, setFoto] = useState(null);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const userRef = doc(db, "usuarios", user.uid); // 👈 colección "usuarios"
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    const data = userSnap.data();
                    console.log("DATA FIREBASE:", data);

                    setFoto(data.foto_url.replace(".webp", ".jpg")); // 👈 AQUÍ está tu URL
                } else {
                    console.log("No existe el usuario en Firestore");
                }

            } catch (error) {
                console.log("ERROR FIREBASE:", error);
            }
        };

        if (user?.uid) {
            loadProfile();
        }
    }, [user]);

    const handleLogout = async () => {
        try {
            await signOut(auth); // Firebase
            logout(); // Contexto
        } catch (error) {
            console.log("ERROR LOGOUT:", error);
        }
    };

    console.log("USER EN PANTALLA:", user);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Datos del Usuario</Text>
            {foto ? (
                <Image source={{ uri: foto }} style={styles.avatar} />
            ) : (
                <Text style={{ color: "#fff" }}>Cargando imagen...</Text>
            )}
            <Text style={styles.text}>UID: {user?.uid}</Text>
            <Text style={styles.text}>Email: {user?.email}</Text>
            <Text style={styles.text}>Rol: {user?.rol}</Text>
            <Button title="Volver" onPress={() => setScreen("tasks")} />
            <Button title="Cerrar Sesión" color="red" onPress={handleLogout} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1a1a1a",
        justifyContent: "center",
        alignItems: "center",
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        color: "#fff",
        marginBottom: 20,
        fontWeight: "bold",
    },
    text: {
        color: "#ccc",
        fontSize: 16,
        marginBottom: 10,
    },
});

export default UserDataScreen;