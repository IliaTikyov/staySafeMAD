import React from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { deleteActivity } from "../../api/activityApi";
import Button from "../../components/UI/Button";
import Icon from "react-native-vector-icons/FontAwesome";

const ViewTripScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { activity } = route.params;

  const goToModifyScreen = () => {
    navigation.navigate("Modify", { activity: activity });
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
        <Button onPress={goToModifyScreen} style={styles.modifyButton}>
          <Icon name="pencil" size={16} color="white" style={styles.icon} />
          <Text> Modify</Text>
        </Button>

        <Button onPress={handleDelete} style={styles.deleteButton}>
          <Icon name="trash" size={16} color="white" style={styles.icon} />
          <Text> Delete </Text>
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
    justifyContent: "space-between",
    marginTop: 20,
  },
  modifyButton: {
    backgroundColor: "#f97316",
    flex: 1,
    marginRight: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  deleteButton: {
    backgroundColor: "#ef4444",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  icon: {
    marginRight: 6,
  },
});

export default ViewTripScreen;
