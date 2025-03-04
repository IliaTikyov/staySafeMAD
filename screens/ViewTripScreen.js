import React from "react";
import { StyleSheet } from "react-native";
import { View } from "react-native";
import { Text } from "react-native";
import { useRoute } from "@react-navigation/native";

const ViewTripScreen = () => {
  const route = useRoute();
  const { trip } = route.params; // ✅ Get trip data from navigation

  if (!trip) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No trip details available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trip Details</Text>
      <Text style={styles.tripText}>🚀 From: {trip.departure}</Text>
      <Text style={styles.tripText}>📍 Destination: {trip.destination}</Text>
      <Text style={styles.tripText}>⏳ ETA: {trip.eta}</Text>
      <Text style={styles.tripText}>🛣 Mode: {trip.modeOfTravel}</Text>
      <Text style={styles.tripText}>
        📞 Emergency Contact: {trip.emergencyContact}
      </Text>
      <Text style={styles.tripText}>🏷 Status: {trip.status}</Text>
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
    marginBottom: 20,
    textAlign: "center",
  },
  tripText: {
    fontSize: 18,
    marginBottom: 10,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
});

export default ViewTripScreen;
