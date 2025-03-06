import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AddTripScreen = () => {
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [eta, setEta] = useState("");
  const [modeOfTravel, setModeOfTravel] = useState("walking");
  const [emergencyContact, setEmergencyContact] = useState("");

  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (
      !departure.trim() ||
      !destination.trim() ||
      !eta.trim() ||
      !emergencyContact.trim()
    ) {
      Alert.alert("Error", "Please fill in all fields before saving the trip.");
      return;
    }

    const newTrip = {
      id: Date.now().toString(),
      departure,
      destination,
      eta,
      modeOfTravel,
      emergencyContact,
      status: "Started",
    };
    const storedTrips = await AsyncStorage.getItem("trips");
    const tripsArray = storedTrips ? JSON.parse(storedTrips) : [];
    tripsArray.push(newTrip);
    await AsyncStorage.setItem("trips", JSON.stringify(tripsArray));
    navigation.navigate("HomeScreen", { newTrip });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add a New Trip</Text>

      <TextInput
        style={styles.input}
        placeholder="Departure Location"
        placeholderTextColor="#888"
        value={departure}
        onChangeText={setDeparture}
      />

      <TextInput
        style={styles.input}
        placeholder="Destination"
        placeholderTextColor="#888"
        value={destination}
        onChangeText={setDestination}
      />

      <TextInput
        style={styles.input}
        placeholder="ETA (e.g., 12:30 PM)"
        placeholderTextColor="#888"
        value={eta}
        onChangeText={setEta}
        keyboardType="default"
      />

      <Text style={styles.label}>Mode of Travel:</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={modeOfTravel} onValueChange={setModeOfTravel}>
          <Picker.Item label="Walking" value="walking" />
          <Picker.Item label="Jogging" value="jogging" />
          <Picker.Item label="Cycling" value="cycling" />
          <Picker.Item label="Taxi Trip" value="taxi" />
        </Picker>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Emergency Contact (Phone Number)"
        placeholderTextColor="#888"
        value={emergencyContact}
        onChangeText={setEmergencyContact}
        keyboardType="phone-pad"
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Save Trip</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    fontSize: 16,
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    color: "#333",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  pickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: "#42a5f5",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default AddTripScreen;
