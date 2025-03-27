import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRoute, useNavigation } from "@react-navigation/native";
import Button from "../../components/UI/Button";
import { SaveIcon } from "../../components/UI/Icons";
import { updateActivity } from "../../api/activityApi";

const ModifyTripScreen = () => {
  const { params } = useRoute();
  const navigation = useNavigation();
  const { activity } = params;

  const [tripName, setTripName] = useState(activity.ActivityName);
  const [description, setDescription] = useState(activity.ActivityDescription);
  const [leaveTime, setLeaveTime] = useState(activity.ActivityLeave);
  const [arriveTime, setArriveTime] = useState(activity.ActivityArrive);
  const [statusID, setStatusID] = useState(
    activity.ActivityStatusID.toString()
  );

  const statusOptions = [
    { id: 1, label: "Planned" },
    { id: 2, label: "Started" },
    { id: 3, label: "Paused" },
    { id: 4, label: "Cancelled" },
    { id: 5, label: "Completed" },
  ];

  const handleSave = async () => {
    if (!tripName || !description || !leaveTime || !arriveTime) {
      Alert.alert("Missing Info", "All fields are required.");
      return;
    }

    const updatedTrip = {
      ...activity,
      ActivityName: tripName.trim(),
      ActivityDescription: description.trim(),
      ActivityLeave: new Date(leaveTime).toISOString(),
      ActivityArrive: new Date(arriveTime).toISOString(),
      ActivityStatusID: parseInt(statusID),
    };

    try {
      await updateActivity(updatedTrip);
      Alert.alert("Success", "Trip updated successfully.");
      navigation.goBack();
    } catch (error) {
      console.error("Update error:", error);
      Alert.alert("Error", "Could not update trip.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Modify Trip</Text>

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

      <Text style={styles.label}>Leave Time:</Text>
      <TextInput
        style={styles.input}
        value={leaveTime}
        onChangeText={setLeaveTime}
        placeholder="YYYY-MM-DDTHH:MM:SSZ"
      />

      <Text style={styles.label}>Arrival Time:</Text>
      <TextInput
        style={styles.input}
        value={arriveTime}
        onChangeText={setArriveTime}
        placeholder="YYYY-MM-DDTHH:MM:SSZ"
      />

      <Text style={styles.label}>Status:</Text>
      <Picker
        selectedValue={statusID}
        onValueChange={(val) => setStatusID(val)}
        style={styles.picker}
      >
        {statusOptions.map((s) => (
          <Picker.Item key={s.id} label={s.label} value={s.id.toString()} />
        ))}
      </Picker>

      <View style={styles.buttonWrap}>
        <Button onPress={handleSave}>
          <SaveIcon size={16} color="white" style={{ marginRight: 6 }} />
          <Text> Save Changes </Text>
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  picker: {
    backgroundColor: "#f0f0f0",
    marginBottom: 20,
  },
  buttonWrap: {
    alignItems: "center",
    marginTop: 10,
  },
});

export default ModifyTripScreen;
