import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import * as SecureStore from "expo-secure-store";

const SecureStorageExample = () => {
  const [inputValue, setInputValue] = useState("");
  const [retrievedValue, setRetrievedValue] = useState("");

  // Guardar dato en SecureStore
  const storeValue = async () => {
    try {
      await SecureStore.setItemAsync("secureKey", inputValue);
      Alert.alert("✅ Éxito", "El dato ha sido almacenado de manera segura.");
    } catch (error) {
      Alert.alert("⚠️ Error", "No se pudo guardar el dato.");
    }
  };

  // Recuperar dato de SecureStore
  const retrieveValue = async () => {
    try {
      const value = await SecureStore.getItemAsync("secureKey");
      if (value) {
        setRetrievedValue(value);
      } else {
        Alert.alert("ℹ️ Aviso", "No hay datos almacenados.");
      }
    } catch (error) {
      Alert.alert("⚠️ Error", "No se pudo recuperar el dato.");
    }
  };

  // Eliminar dato de SecureStore
  const removeValue = async () => {
    try {
      await SecureStore.deleteItemAsync("secureKey");
      setRetrievedValue("");
      Alert.alert("✅ Eliminado", "El dato ha sido eliminado.");
    } catch (error) {
      Alert.alert("⚠️ Error", "No se pudo eliminar el dato.");
    }
  };

  // Cargar dato almacenado al iniciar
  useEffect(() => {
    retrieveValue();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text>Introduce un dato seguro:</Text>
      <TextInput
        value={inputValue}
        onChangeText={setInputValue}
        style={{ borderWidth: 1, marginVertical: 10, padding: 5 }}
      />
      <Button title="Guardar" onPress={storeValue} />
      <Button title="Cargar" onPress={retrieveValue} />
      <Button title="Eliminar" onPress={removeValue} />
      {retrievedValue ? <Text>Dato almacenado: {retrievedValue}</Text> : null}
    </View>
  );
};

export default SecureStorageExample;
