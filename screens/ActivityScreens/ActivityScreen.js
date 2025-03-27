import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { getActivities } from "../../api/activityApi";
import Cards from "../../components/UI/Cards";
import Button from "../../components/UI/Button";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

const ActivityScreen = () => {
  const [activities, setActivities] = useState([]);
  const navigation = useNavigation();

  const fetchActivities = async () => {
    try {
      const data = await getActivities();
      setActivities(data);
    } catch (error) {
      console.error("Failed to load activities:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      const fetchData = async () => {
        if (isActive) {
          await fetchActivities();
        }
      };

      fetchData();

      return () => {
        isActive = false;
      };
    }, [])
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Planned":
        return "#3498db";
      case "Started":
        return "#f39c12";
      case "Paused":
        return "#f1c40f";
      case "Cancelled":
        return "#e74c3c";
      case "Completed":
        return "#2ecc71";
      default:
        return "#7f8c8d";
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button onPress={() => navigation.navigate("Add Locations")}>
          <Icon name="plus" size={14} style={styles.plusIcon} />
          <Text> Add Activity (Trips)</Text>
        </Button>
      </View>

      <FlatList
        data={activities}
        keyExtractor={(item) => item.ActivityID.toString()}
        renderItem={({ item }) => (
          <Cards
            onPress={() =>
              navigation.navigate("View", {
                activity: item,
              })
            }
          >
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              {item.ActivityName}
            </Text>
            <Text>{item.ActivityDescription}</Text>
            <Text
              style={{
                fontWeight: "bold",
                color: getStatusColor(item.ActivityStatusName),
              }}
            >
              Status: {item.ActivityStatusName}
            </Text>
          </Cards>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingTop: 16,
    marginBottom: 20,
  },
  buttonContainer: {
    alignItems: "center",
  },
  plusIcon: {
    color: "white",
    marginRight: 6,
  },
  tripText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  status: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
});

export default ActivityScreen;
