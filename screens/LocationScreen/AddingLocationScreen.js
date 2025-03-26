import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { createLocation } from "../../api/locationApi";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Button from "../../components/UI/Button";

const GOOGLE_MAPS_API_KEY = "AIzaSyCYqNe56qzLAp9T4zKAgKuEkHHigcNYc3o";

const AddingLocationScreen = ({ navigation }) => {
  const [locationDetails, setLocationDetails] = useState(null);

  const extractField = (components, type) =>
    components.find((c) => c.types.includes(type))?.long_name || "";

  const extractAddress = (components) => {
    const route = extractField(components, "route");
    const locality = extractField(components, "locality");
    return [route, locality].filter(Boolean).join(", ");
  };

  const extractPostcode = (components) =>
    extractField(components, "postal_code") || "UNKNOWN";

  const handleSubmit = async () => {
    if (!locationDetails) {
      Alert.alert("Error", "Please select a location.");
      return;
    }

    const ensureAddressLength = (address) => {
      if (!address) return "Unknown Street, Default Road";
      return address.length >= 16 ? address : address + " Extra Details Road";
    };

    const data = {
      LocationName: locationDetails.name,
      LocationDescription: locationDetails.formatted_address,
      LocationAddress: ensureAddressLength(
        extractAddress(locationDetails.address_components)
      ),
      LocationPostcode: extractPostcode(locationDetails.address_components),
      LocationLatitude: locationDetails.geometry.location.lat,
      LocationLongitude: locationDetails.geometry.location.lng,
    };

    try {
      await createLocation(data);
      Alert.alert("Success", "Location added.");
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Could not add location.");
    }
    console.log("Sending location to backend:", locationData);
    console.log("Sending location data:", data);
    console.log(
      "Postcode:",
      extractPostcode(locationDetails.address_components)
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <Text style={styles.label}>Search Location</Text>
      <GooglePlacesAutocomplete
        placeholder="Enter location"
        fetchDetails={true}
        onPress={(data, details = null) => setLocationDetails(details)}
        query={{ key: GOOGLE_MAPS_API_KEY, language: "en" }}
        styles={{ textInput: styles.input }}
      />

      <Button onPress={handleSubmit}>
        <Text style={styles.buttonText}>Add Location</Text>
      </Button>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default AddingLocationScreen;
