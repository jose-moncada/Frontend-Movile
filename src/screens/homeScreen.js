import React, {useContext} from "react";
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import { AuthContext } from "../context/AuthContext";

const homeScreen = ({navegation}) => {
    const {logout} = useContext(AuthContext);

    return (
        <View>
            <View>
                <Text style={StyleSheet.welcome}>Hola, desarrollador</Text>
                <Text style={StyleSheet.sub}>Bienvenido al panel principal</Text>
            </View>
            
            <View style={style.menuGrid}>
                <TouchableOpacity style={styles.card} onPress={() => navegation.navegate('Tasks')}>
                    <Text style={styles.cardText}>⚜</Text>
                    <Text style={styles.cardText}>Gestionar Tareas</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.card} onPress={'logout'}>
                    <Text style={styles.cardText}>🚪</Text>
                    <Text style={styles.cardText}>Cerrar Sesión</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    welcome: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    sub: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
    },
    menuGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    card: {
        width: '45%',
        padding: 20,
        borderRadius: 10,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        marginBottom: 15,
        elevation: 4,
    },
    cardText: {
        fontSize: 16,
        marginVertical: 5,
    }
})

export default homeScreen;