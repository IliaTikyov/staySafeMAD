import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>StaySafe App</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("ActivityScreen")}
      >
        <Text style={styles.buttonText}>Activities (Trips)</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("StatusScreen")}
      >
        <Text style={styles.buttonText}>Status</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    marginBottom: 20,
    fontSize: 24,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#42a5f5",
    alignItems: "center",
    width: "80%",
    marginVertical: 10,
    padding: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default HomeScreen;
