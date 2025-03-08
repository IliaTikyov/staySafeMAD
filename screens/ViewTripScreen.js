import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { deleteActivity } from "../api/activityApi";

const ViewTripScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { activity } = route.params;

  const goToModifyScreen = () => {
    navigation.navigate("ModifyTrip", { activity });
  };

  const handleDelete = async () => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this trip?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteActivity(activity.ActivityID);
              Alert.alert("Success", "Trip deleted successfully!");
              navigation.goBack();
            } catch (error) {
              console.error("Failed to delete trip:", error);
              Alert.alert("Error", "Failed to delete trip.");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{activity.ActivityName}</Text>
      <Text style={styles.description}>{activity.ActivityDescription}</Text>

      <View style={styles.detailRow}>
        <Text style={styles.label}>From:</Text>
        <Text style={styles.valueText}>{activity.ActivityFromName}</Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.label}>To:</Text>
        <Text style={styles.valueText}>{activity.ActivityToName}</Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.label}>Leave Time:</Text>
        <Text style={styles.valueText}>
          {new Date(activity.ActivityLeave).toLocaleString()}
        </Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.label}>Arrival Time:</Text>
        <Text style={styles.valueText}>
          {new Date(activity.ActivityArrive).toLocaleString()}
        </Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.label}>Status:</Text>
        <Text style={styles.valueText}>{activity.ActivityStatusName}</Text>
      </View>

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
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    marginTop: 16,
  },
  description: {
    color: "gray",
    fontSize: 18,
    marginBottom: 12,
    textAlign: "center",
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "center",
  },
  label: {
    fontWeight: "600",
    fontSize: 16,
    marginRight: 4,
  },
  valueText: {
    color: "#1D3557",
    fontWeight: "300",
    fontSize: 16,
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
