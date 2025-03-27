import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Button from "../../components/UI/Button";
import Icon from "react-native-vector-icons/FontAwesome";
import { Picker } from "@react-native-picker/picker";
import { createActivity } from "../../api/activityApi";

const statusOptions = [
  { id: "1", label: "Planned", color: "#3498db" },
  { id: "2", label: "Started", color: "#f39c12" },
  { id: "3", label: "Paused", color: "#f1c40f" },
  { id: "4", label: "Cancelled", color: "#e74c3c" },
  { id: "5", label: "Completed", color: "#2ecc71" },
];

const AddTripScreen = ({ route, navigation }) => {
  const { fromLocationId, toLocationId, fromName, toName } = route.params;

  const [tripName, setTripName] = useState("");
  const [description, setDescription] = useState("");
  const [leaveTime, setLeaveTime] = useState("");
  const [arriveTime, setArriveTime] = useState("");
  const [statusID, setStatusID] = useState("1");

  useEffect(() => {
    const now = new Date();
    setLeaveTime(now.toISOString().slice(0, 16).replace("T", " "));
  }, []);

  const handleSubmit = async () => {
    const leaveDate = new Date(leaveTime);
    const arriveDate = new Date(arriveTime);

    if (
      !tripName ||
      !description ||
      !leaveTime ||
      !arriveTime ||
      !fromLocationId ||
      !toLocationId
    ) {
      Alert.alert("Missing Information", "Please complete all fields.");
      return;
    }

    if (tripName.trim().length < 8 || description.trim().length < 8) {
      Alert.alert(
        "Validation Error",
        "Trip name and description must be at least 8 characters."
      );
      return;
    }

    if (arriveDate <= leaveDate) {
      Alert.alert("Validation Error", "Arrival time must be after leave time.");
      return;
    }

    const newTrip = {
      ActivityID: null,
      ActivityName: tripName.trim(),
      ActivityUserID: 1,
      ActivityDescription: description.trim(),
      ActivityFromID: fromLocationId,
      ActivityToID: toLocationId,
      ActivityFromName: fromName,
      ActivityToName: toName,
      ActivityLeave: leaveDate.toISOString(),
      ActivityArrive: arriveDate.toISOString(),
      ActivityStatusID: parseInt(statusID),
    };

    try {
      await createActivity(newTrip);
      Alert.alert("Success", "Trip created successfully!");
      navigation.navigate("Activity");
    } catch (err) {
      console.error("Error creating activity:", err);
      Alert.alert("Error", "Failed to create activity. Try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.safeArea}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.stepIndicator}>Step 2 of 2</Text>
        <Text style={styles.label}>Trip Name</Text>
        <TextInput
          style={styles.input}
          value={tripName}
          onChangeText={setTripName}
          placeholder="e.g., Walk to Station"
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          placeholder="Trip details"
        />

        <Text style={styles.label}>Leave Time</Text>
        <TextInput
          style={styles.input}
          value={leaveTime}
          onChangeText={setLeaveTime}
          placeholder="YYYY-MM-DD HH:MM"
        />

        <Text style={styles.label}>Arrive Time</Text>
        <TextInput
          style={styles.input}
          value={arriveTime}
          onChangeText={setArriveTime}
          placeholder="YYYY-MM-DD HH:MM"
        />

        <Text style={styles.label}>Status</Text>
        <Picker
          selectedValue={statusID}
          onValueChange={setStatusID}
          style={styles.picker}
        >
          {statusOptions.map((option) => (
            <Picker.Item
              key={option.id}
              label={option.label}
              value={option.id}
            />
          ))}
        </Picker>

        <View style={styles.buttonContainer}>
          <Button onPress={handleSubmit}>
            <Icon name="check" size={14} style={styles.plusIcon} />
            <Text> Submit Activity </Text>
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  stepIndicator: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
    textAlign: "center",
    marginBottom: 10,
  },
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
