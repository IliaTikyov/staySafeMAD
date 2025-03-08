import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { createActivity } from "../api/activityApi";

const AddTripScreen = ({ navigation }) => {
  const [tripName, setTripName] = useState("");
  const [description, setDescription] = useState("");
  const [fromID, setFromID] = useState("");
  const [toID, setToID] = useState("");
  const [leaveTime, setLeaveTime] = useState("");
  const [arriveTime, setArriveTime] = useState("");
  const [statusID, setStatusID] = useState("1");

  const handleSave = async () => {
    if (
      !tripName ||
      !description ||
      !fromID ||
      !toID ||
      !leaveTime ||
      !arriveTime
    ) {
      Alert.alert("Missing Information", "Please fill in all fields.");
      return;
    }

    const trimmedTripName = tripName.trim();
    const trimmedDescription = description.trim();

    if (trimmedTripName.length < 8) {
      Alert.alert(
        "Invalid Input",
        "Trip name must be at least 8 characters long."
      );
      return;
    }
    if (trimmedDescription.length < 8) {
      Alert.alert(
        "Invalid Input",
        "Description must be at least 8 characters long."
      );
      return;
    }

    const newTrip = {
      ActivityID: null,
      ActivityName: trimmedTripName,
      ActivityDescription: trimmedDescription,
      ActivityStatusID: parseInt(statusID),
      ActivityUserID: 1,
      ActivityFromID: parseInt(fromID),
      ActivityToID: parseInt(toID),
      ActivityLeave: new Date(leaveTime).toISOString(),
      ActivityArrive: new Date(arriveTime).toISOString(),
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
    <View style={styles.container}>
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

      <Text style={styles.label}>From Location ID:</Text>
      <TextInput
        style={styles.input}
        value={fromID}
        onChangeText={setFromID}
        keyboardType="numeric"
      />

      <Text style={styles.label}>To Location ID:</Text>
      <TextInput
        style={styles.input}
        value={toID}
        onChangeText={setToID}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Leave Time (YYYY-MM-DD HH:MM):</Text>
      <TextInput
        style={styles.input}
        value={leaveTime}
        onChangeText={setLeaveTime}
        placeholder="2025-03-10 12:00"
      />

      <Text style={styles.label}>Arrive Time (YYYY-MM-DD HH:MM):</Text>
      <TextInput
        style={styles.input}
        value={arriveTime}
        onChangeText={setArriveTime}
        placeholder="2025-03-10 14:00"
      />

      <Button title="Save Trip" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default AddTripScreen;
