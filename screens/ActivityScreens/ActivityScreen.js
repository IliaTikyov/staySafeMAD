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
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

const HomeScreen = () => {
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

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("Add")}
      >
        <Icon name="plus" size={16} style={styles.plusIcon} />
        <Text style={styles.buttonText}>Add Trip</Text>
      </TouchableOpacity>

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
                color:
                  item.ActivityStatusName === "Completed" ? "green" : "orange",
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
  },
  addButton: {
    backgroundColor: "#42a5f5",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    alignSelf: "stretch",
    marginHorizontal: 16,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  plusIcon: {
    color: "white",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
    marginLeft: 6,
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

export default HomeScreen;
