import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Button from "../components/UI/Button";

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>StaySafe App</Text>

      <Button onPress={() => navigation.navigate("ActivityScreen")}>
        Activities (Trips)
      </Button>

      <Button onPress={() => navigation.navigate("PositionScreen")}>
        Live Position
      </Button>

      <Button onPress={() => navigation.navigate("ContactsScreen")}>
        Contacts
      </Button>

      <Button onPress={() => navigation.navigate("LocationScreen")}>
        LocationScreen
      </Button>
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
