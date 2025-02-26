import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import Cards from "../components/UI/Cards";
import Icon from "react-native-vector-icons/FontAwesome";

const HomeScreen = ({ navigation }) => {
  const [trips, setTrips] = useState([]);
  const route = useRoute();

  useEffect(() => {
    if (route.params?.newTrip) {
      setTrips((prevTrips) => [...prevTrips, route.params.newTrip]);
      navigation.setParams({ newTrip: null });
    }
  }, [route.params?.newTrip]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("Add")}
      >
        <Icon name="plus" size={15} color="white" />
        <Text style={styles.buttonText}>Add Trip</Text>
      </TouchableOpacity>

      <FlatList
        data={trips}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Cards style={styles.card}>
            <Text style={styles.tripText}>
              🚀 {item.departure} → {item.destination}
            </Text>
            <Text style={styles.tripText}>⏳ ETA: {item.eta}</Text>
            <Text style={styles.tripText}>🛣 Mode: {item.modeOfTravel}</Text>
            <Text style={styles.tripText}>
              📞 Contact: {item.emergencyContact}
            </Text>
          </Cards>
        )}
      />
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
    marginLeft: 6,
  },
  tripText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
});

export default HomeScreen;
