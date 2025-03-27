import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { createLocation } from "../../api/locationApi";
import Button from "../../components/UI/Button";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const GOOGLE_MAPS_API_KEY = "AIzaSyCYqNe56qzLAp9T4zKAgKuEkHHigcNYc3o";

const AddLocationScreen = ({ navigation }) => {
  const [fromDetails, setFromDetails] = useState(null);
  const [toDetails, setToDetails] = useState(null);

  const extractField = (components, type) =>
    components.find((c) => c.types.includes(type))?.long_name || "";

  const extractAddress = (components) => {
    const route = extractField(components, "route");
    const locality = extractField(components, "locality");
    const street = [route, locality].filter(Boolean).join(", ");
    return street.length >= 16 ? street : street + ", Extra Details Rd";
  };

  const extractPostcode = (components) =>
    extractField(components, "postal_code") || "UNKNOWN";

  const handleSaveLocations = async () => {
    if (!fromDetails || !toDetails) {
      Alert.alert("Error", "Please select both From and To locations.");
      return;
    }

    try {
      const fromLocation = {
        LocationName: fromDetails.name,
        LocationDescription: fromDetails.formatted_address,
        LocationAddress: extractAddress(fromDetails.address_components),
        LocationPostcode: extractPostcode(fromDetails.address_components),
        LocationLatitude: fromDetails.geometry.location.lat,
        LocationLongitude: fromDetails.geometry.location.lng,
      };

      const toLocation = {
        LocationName: toDetails.name,
        LocationDescription: toDetails.formatted_address,
        LocationAddress: extractAddress(toDetails.address_components),
        LocationPostcode: extractPostcode(toDetails.address_components),
        LocationLatitude: toDetails.geometry.location.lat,
        LocationLongitude: toDetails.geometry.location.lng,
      };

      const savedFrom = (await createLocation(fromLocation))[0];
      const savedTo = (await createLocation(toLocation))[0];

      console.log("Saved From Location:", savedFrom);
      console.log("Saved To Location:", savedTo);

      if (savedFrom?.LocationID && savedTo?.LocationID) {
        navigation.navigate("Add", {
          fromLocationId: savedFrom.LocationID,
          toLocationId: savedTo.LocationID,
          fromName: fromLocation.LocationName,
          toName: toLocation.LocationName,
        });
      } else {
        throw new Error("Location saving failed.");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to save locations.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.label}>Pick From Location</Text>
        <GooglePlacesAutocomplete
          placeholder="From location"
          fetchDetails={true}
          onPress={(data, details = null) => setFromDetails(details)}
          query={{ key: GOOGLE_MAPS_API_KEY, language: "en" }}
          styles={{ textInput: styles.input }}
        />

        <Text style={styles.label}>Pick To Location</Text>
        <GooglePlacesAutocomplete
          placeholder="To location"
          fetchDetails={true}
          onPress={(data, details = null) => setToDetails(details)}
          query={{ key: GOOGLE_MAPS_API_KEY, language: "en" }}
          styles={{ textInput: styles.input }}
        />

        <Button onPress={handleSaveLocations} style={styles.button}>
          <Text style={styles.buttonText}>Continue to Trip Info</Text>
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  button: {
    alignSelf: "center",
  },
});

export default AddLocationScreen;
