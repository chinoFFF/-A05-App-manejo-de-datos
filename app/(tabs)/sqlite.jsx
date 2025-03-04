import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('app_data.db');

export default function App() {
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [anios, setAnios] = useState('');
  const [personas, setPersonas] = useState([]);

  useEffect(() => {
    db.execAsync('CREATE TABLE IF NOT EXISTS personas (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre_completo TEXT, anios INTEGER);')
      .then(() => cargarPersonas())
      .catch(console.error);
  }, []);

  const agregarPersona = () => {
    if (!nombreCompleto || !anios) return Alert.alert('⚠️ Error', 'Ingresa todos los datos.');

    db.runAsync('INSERT INTO personas (nombre_completo, anios) VALUES (?, ?)', [nombreCompleto, anios])
      .then(() => {
        setNombreCompleto('');
        setAnios('');
        cargarPersonas();
      })
      .catch(console.error);
  };

  const eliminarPersona = (id) => {
    db.runAsync('DELETE FROM personas WHERE id = ?', [id])
      .then(() => {
        Alert.alert('✅ Eliminado', 'La persona ha sido eliminada.');
        cargarPersonas();
      })
      .catch(console.error);
  };

  const cargarPersonas = () => {
    db.getAllAsync('SELECT * FROM personas')
      .then(setPersonas)
      .catch(console.error);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Agregar Persona</Text>
      <TextInput placeholder="Nombre Completo" value={nombreCompleto} onChangeText={setNombreCompleto} style={{ borderWidth: 1, marginVertical: 5, padding: 5 }} />
      <TextInput placeholder="Años" value={anios} onChangeText={setAnios} keyboardType="numeric" style={{ borderWidth: 1, marginVertical: 5, padding: 5 }} />
      <Button title="Guardar" onPress={agregarPersona} />

      <Text>Lista de Personas:</Text>
      <FlatList
        data={personas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
            <Text>{item.nombre_completo} - {item.anios} años</Text>
            <Button title="❌" onPress={() => eliminarPersona(item.id)} />
          </View>
        )}
      />
    </View>
  );
}

