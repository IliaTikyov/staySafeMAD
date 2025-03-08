import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation, useRoute } from "@react-navigation/native";

const ModifyTripScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { trip, onModify } = route.params; 

  const [departure, setDeparture] = useState(trip.departure);
  const [destination, setDestination] = useState(trip.destination);
  const [eta, setEta] = useState(trip.eta);
  const [modeOfTravel, setModeOfTravel] = useState(trip.modeOfTravel);
  const [emergencyContact, setEmergencyContact] = useState(
    trip.emergencyContact
  );

  const handleSubmit = () => {
    if (
      !departure.trim() ||
      !destination.trim() ||
      !eta.trim() ||
      !emergencyContact.trim()
    ) {
      Alert.alert("Error", "Please make sure all fields are filled");
      return;
    }

    const updatedTrip = {
      ...trip,
      departure: departure.trim(),
      destination: destination.trim(),
      eta: eta.trim(),
      modeOfTravel,
      emergencyContact: emergencyContact.trim(),
    };

    if (onModify) {
      onModify(updatedTrip);
    }
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modify Trip</Text>

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
        <Text style={styles.buttonText}>Update Trip</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#555",
    marginBottom: 8,
  },
  pickerContainer: {
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: "#42a5f5",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ModifyTripScreen;
