import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { createActivity } from "../../api/activityApi";
import Button from "../../components/UI/Button";
import Icon from "react-native-vector-icons/FontAwesome";
import { Picker } from "@react-native-picker/picker";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

const GOOGLE_MAPS_API_KEY = "AIzaSyCYqNe56qzLAp9T4zKAgKuEkHHigcNYc3o";

const AddTripScreen = ({ navigation }) => {
  const [tripName, setTripName] = useState("");
  const [description, setDescription] = useState("");
  const [leaveTime, setLeaveTime] = useState("");
  const [arriveTime, setArriveTime] = useState("");
  const [statusID, setStatusID] = useState("1");

  const [fromCoords, setFromCoords] = useState(null);
  const [toCoords, setToCoords] = useState(null);
  const [fromName, setFromName] = useState("");
  const [toName, setToName] = useState("");

  useEffect(() => {
    const now = new Date();
    const formatted = now.toISOString().slice(0, 16).replace("T", " ");
    setLeaveTime(formatted);
  }, []);

  const statusOptions = [
    { id: "1", label: "Planned", color: "#3498db" },
    { id: "2", label: "Started", color: "#f39c12" },
    { id: "3", label: "Paused", color: "#f1c40f" },
    { id: "4", label: "Cancelled", color: "#e74c3c" },
    { id: "5", label: "Completed", color: "#2ecc71" },
  ];

  const handleSave = async () => {
    if (
      !tripName ||
      !description ||
      !leaveTime ||
      !arriveTime ||
      !fromCoords ||
      !toCoords ||
      !fromName ||
      !toName
    ) {
      Alert.alert(
        "Missing Information",
        "Please fill in all fields and pick both locations."
      );
      return;
    }

    const trimmedTripName = tripName.trim();
    const trimmedDescription = description.trim();
    const leaveDate = new Date(leaveTime);
    const arriveDate = new Date(arriveTime);

    if (trimmedTripName.length < 8) {
      Alert.alert("Trip name must be at least 8 characters long.");
      return;
    }

    if (trimmedDescription.length < 8) {
      Alert.alert("Description must be at least 8 characters long.");
      return;
    }

    if (arriveDate <= leaveDate) {
      Alert.alert("Invalid Time", "Arrival time must be after leave time.");
      return;
    }

    const newTrip = {
      ActivityID: null,
      ActivityName: trimmedTripName,
      ActivityDescription: trimmedDescription,
      ActivityStatusID: parseInt(statusID),
      ActivityUserID: 1,
      ActivityFromID: 1, // can remain placeholder
      ActivityToID: 2, // can remain placeholder
      ActivityFromName: fromName,
      ActivityToName: toName,
      ActivityLeave: leaveDate.toISOString(),
      ActivityArrive: arriveDate.toISOString(),
    };

    try {
      await createActivity(newTrip);
      Alert.alert("Success", "Trip created successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Failed to create trip:", error);
      Alert.alert("Error", "Failed to save trip.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.safeArea}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.label}>Trip Name:</Text>
        <TextInput
          style={styles.input}
          value={tripName}
          onChangeText={setTripName}
        />

        <Text style={styles.label}>Description:</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.label}>From Location:</Text>
        <View style={styles.autocompleteWrapper}>
          <GooglePlacesAutocomplete
            placeholder="Start location"
            fetchDetails={true}
            onPress={(data, details = null) => {
              const loc = details.geometry.location;
              setFromCoords({ latitude: loc.lat, longitude: loc.lng });
              setFromName(data.description);
            }}
            query={{ key: GOOGLE_MAPS_API_KEY, language: "en" }}
            styles={{ textInput: styles.input }}
          />
        </View>

        <Text style={styles.label}>To Location:</Text>
        <View style={styles.autocompleteWrapper}>
          <GooglePlacesAutocomplete
            placeholder="Destination"
            fetchDetails={true}
            onPress={(data, details = null) => {
              const loc = details.geometry.location;
              setToCoords({ latitude: loc.lat, longitude: loc.lng });
              setToName(data.description);
            }}
            query={{ key: GOOGLE_MAPS_API_KEY, language: "en" }}
            styles={{ textInput: styles.input }}
          />
        </View>

        <Text style={styles.label}>Leave Time:</Text>
        <TextInput
          style={styles.input}
          value={leaveTime}
          onChangeText={setLeaveTime}
          placeholder="YYYY-MM-DD HH:MM"
        />

        <Text style={styles.label}>Arrive Time:</Text>
        <TextInput
          style={styles.input}
          value={arriveTime}
          onChangeText={setArriveTime}
          placeholder="YYYY-MM-DD HH:MM"
        />

        <Text style={styles.label}>Status:</Text>
        <Picker
          selectedValue={statusID}
          onValueChange={(itemValue) => setStatusID(itemValue)}
          style={[
            styles.picker,
            {
              color:
                statusOptions.find((s) => s.id === statusID)?.color || "#000",
            },
          ]}
        >
          {statusOptions.map((option) => (
            <Picker.Item
              key={option.id}
              label={option.label}
              value={option.id}
            />
          ))}
        </Picker>

        {fromCoords && toCoords && (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: fromCoords.latitude,
              longitude: fromCoords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker coordinate={fromCoords} title="Start" />
            <Marker coordinate={toCoords} title="Destination" />
            <MapViewDirections
              origin={fromCoords}
              destination={toCoords}
              apikey={GOOGLE_MAPS_API_KEY}
              strokeWidth={4}
              strokeColor="blue"
              onError={(error) => {
                console.warn("Directions Error:", error);
              }}
            />
          </MapView>
        )}

        <View style={styles.buttonContainer}>
          <Button onPress={handleSave}>
            <Icon name="plus" size={14} style={styles.plusIcon} />
            <Text> Add Activity (Trip) </Text>
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#cccccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  picker: {
    backgroundColor: "#f8f9fa",
    marginBottom: 10,
  },
  autocompleteWrapper: {
    marginBottom: 10,
  },
  map: {
    width: "100%",
    height: 300,
    marginVertical: 10,
    borderRadius: 8,
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  plusIcon: {
    color: "white",
    marginRight: 6,
  },
});

export default AddTripScreen;
