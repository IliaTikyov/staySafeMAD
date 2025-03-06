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
import { Picker } from "@react-native-picker/picker";

const HomeScreen = ({ navigation }) => {
  const [trips, setTrips] = useState([]);
  const route = useRoute();

  useEffect(() => {
    if (route.params?.newTrip) {
      setTrips((prevTrips) => [...prevTrips, route.params.newTrip]);
      navigation.setParams({ newTrip: null });
    }
  }, [route.params?.newTrip]);

  const changeStatus = (status) => {
    if (status === "Started") {
      return { color: "orange" };
    } else if (status === "Completed") {
      return { color: "green" };
    } else if (status == "Paused") {
      return { color: "gray" };
    } else {
      return { color: "red" };
    }
  };

  const updateTripStatus = (index, newStatus) => {
    setTrips((prevTrips) =>
      prevTrips.map((trip, i) =>
        i === index ? { ...trip, status: newStatus } : trip
      )
    );
  };

  const deleteTrip = (tripId) => {
    setTrips((prevTrips) => prevTrips.filter((t) => t.id !== tripId));
  };

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
        renderItem={({ item, index }) => (
          <Cards
            style={styles.card}
            onPress={() =>
              navigation.navigate("View", {
                trip: item,
                onDelete: deleteTrip,
              })
            }
          >
            <Text style={styles.tripText}>
              🚀 Destination: {item.departure} → {item.destination}
            </Text>
            <Text style={styles.tripText}>⏳ ETA: {item.eta}</Text>
            <Text style={styles.tripText}>🛣 Mode: {item.modeOfTravel}</Text>
            <Text style={styles.tripText}>
              📞 Contact: {item.emergencyContact}
            </Text>

            <Text style={[styles.status, changeStatus(item.status)]}>
              🏷 Status: {item.status}
            </Text>

            <Picker
              selectedValue={item.status}
              onValueChange={(newStatus) => updateTripStatus(index, newStatus)}
              style={{ marginTop: 10 }}
            >
              <Picker.Item label="Started" value="Started" />
              <Picker.Item label="Paused" value="Paused" />
              <Picker.Item label="Completed" value="Completed" />
              <Picker.Item label="Cancelled" value="Cancelled" />
            </Picker>
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
  status: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
});

export default HomeScreen;
