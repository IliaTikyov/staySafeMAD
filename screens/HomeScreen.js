import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("Add")}
      >
        <Text style={styles.buttonText}>Add Trip ➕</Text>
      </TouchableOpacity>

      <Text style={styles.text}>This is the face of StaySafe app</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingTop: 16,
  },
  addButton: {
    backgroundColor: "#42a5f5",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    alignSelf: "stretch",
    marginHorizontal: 16,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    paddingTop: 20,
    textAlign: "center",
  },
});

export default HomeScreen;
