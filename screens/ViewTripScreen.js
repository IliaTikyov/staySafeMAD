import React from "react";
import { StyleSheet, TouchableOpacity, Alert } from "react-native";
import { View } from "react-native";
import { Text } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

const ViewTripScreen = () => {
  const route = useRoute();
  const { trip, onDelete } = route.params;
  const navigation = useNavigation();

  const goToModifyScreen = () => {
    navigation.navigate("Modify", { trip });
  };

  const handleDelete = () => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this trip?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            if (onDelete) {
              onDelete(trip.id);
            }
            navigation.goBack();
          },
        },
      ],
      { cancelable: true }
    );
  };

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
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.modifyButton]}
          activeOpacity={0.8}
          onPress={goToModifyScreen}
        >
          <Text style={styles.buttonText}>Modify</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          activeOpacity={0.8}
          onPress={handleDelete}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    backgroundColor: "#f8f9fa",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    marginTop: 16,
  },
  tripText: {
    fontSize: 18,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginTop: 25,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
  },
  modifyButton: {
    backgroundColor: "#f97316",
  },
  deleteButton: {
    backgroundColor: "#ef4444",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ViewTripScreen;
