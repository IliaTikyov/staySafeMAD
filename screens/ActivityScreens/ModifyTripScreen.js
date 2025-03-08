import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { updateActivity } from "../../api/activityApi";
import Button from "../../components/UI/Button";
import Icon from "react-native-vector-icons/FontAwesome";

const ModifyTripScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { activity } = route.params;

  const [tripName, setTripName] = useState(activity.ActivityName);
  const [description, setDescription] = useState(activity.ActivityDescription);
  const [leaveTime, setLeaveTime] = useState(activity.ActivityLeave);
  const [arriveTime, setArriveTime] = useState(activity.ActivityArrive);

  const handleSubmit = async () => {
    const updateInfo = {
      ActivityID: activity.ActivityID,
      ActivityName: tripName,
      ActivityDescription: description,
      ActivityLeave: leaveTime,
      ActivityArrive: arriveTime,
    };
    await updateActivity(updateInfo);
    console.log("Updated Trip Data:", {
      tripName,
      description,
      leaveTime,
      arriveTime,
    });
    navigation.navigate("View", { activity: updateInfo, refresh: true });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modify Trip</Text>

      <Text style={styles.label}>Trip Name (Activity Name)</Text>
      <TextInput
        style={styles.input}
        value={tripName}
        onChangeText={setTripName}
      />

      <Text style={styles.label}> Description </Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Leave Time (YYYY-MM-DD HH:MM):</Text>
      <TextInput
        style={styles.input}
        value={leaveTime}
        onChangeText={setLeaveTime}
      />
      <Text style={styles.label}>Arrive Time (YYYY-MM-DD HH:MM):</Text>
      <TextInput
        style={styles.input}
        value={arriveTime}
        onChangeText={setArriveTime}
      />

      <View style={styles.buttonContainer}>
        <Button onPress={handleSubmit} style={styles.saveButton}>
          <Icon name="pencil" size={14} style={styles.plusIcon} />
          Update
        </Button>
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
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    alignSelf: "center",
  },
  label: {
    fontSize: 14,
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
  saveButton: {
    backgroundColor: "#f97316",
  },

  buttonContainer: {
    alignItems: "center",
  },
  plusIcon: {
    color: "white",
    marginRight: 6,
  },
});

export default ModifyTripScreen;
