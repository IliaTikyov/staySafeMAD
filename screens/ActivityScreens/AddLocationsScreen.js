import React, { useState } from "react";
import {
  View,
  Text,
  LogBox,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { createLocation } from "../../api/locationApi";
import Button from "../../components/UI/Button";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { FromIcon, ToIcon } from "../../components/UI/Icons";

const GOOGLE_MAPS_API_KEY = "AIzaSyCYqNe56qzLAp9T4zKAgKuEkHHigcNYc3o";
LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);

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
        <Text style={styles.stepIndicator}>Step 1 of 2</Text>
        <Text style={styles.header}>Plan Your Trip</Text>
        <Text style={styles.description}>
          Pick a location to start your trip{" "}
          <Text style={{ fontWeight: "bold" }}>from</Text> and your destination{" "}
          <Text style={{ fontWeight: "bold" }}>to</Text>.
        </Text>

        <View style={[styles.section, { zIndex: 2 }]}>
          <Text style={styles.label}>
            <FromIcon /> From Location
          </Text>
          <GooglePlacesAutocomplete
            placeholder="Enter starting point"
            fetchDetails={true}
            onPress={(data, details = null) => setFromDetails(details)}
            query={{ key: GOOGLE_MAPS_API_KEY, language: "en" }}
            styles={{
              textInput: styles.input,
              container: styles.autocompleteContainer,
              listView: { zIndex: 999 },
            }}
          />
        </View>

        <View style={[styles.section, { zIndex: 1 }]}>
          <Text style={styles.label}>
            <ToIcon /> To Location
          </Text>
          <GooglePlacesAutocomplete
            placeholder="Enter destination"
            fetchDetails={true}
            onPress={(data, details = null) => setToDetails(details)}
            query={{ key: GOOGLE_MAPS_API_KEY, language: "en" }}
            styles={{
              textInput: styles.input,
              container: styles.autocompleteContainer,
              listView: { zIndex: 998 },
            }}
          />
        </View>

        <View style={styles.buttonWrapper}>
          <Button onPress={handleSaveLocations}>
            <Text style={styles.buttonText}>Continue to Trip Info</Text>
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f7f9fb",
    flexGrow: 1,
  },
  stepIndicator: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
    textAlign: "center",
    marginBottom: 5,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00AEEF",
    textAlign: "center",
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: "#444",
    textAlign: "center",
    marginBottom: 20,
  },
  section: {
    marginBottom: 30,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 6,
    fontSize: 16,
    color: "#333",
  },
  input: {
    borderColor: "#00AEEF",
    borderWidth: 1.2,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    fontSize: 15,
  },
  autocompleteContainer: {
    flex: 1,
  },
  buttonWrapper: {
    marginTop: 30,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default AddLocationScreen;
