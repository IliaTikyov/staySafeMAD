/* import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { deleteActivity, updateActivity } from "../../api/activityApi";
import { getLocationById } from "../../api/locationApi";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import * as Location from "expo-location";
import Button from "../../components/UI/Button";
import Icon from "react-native-vector-icons/FontAwesome";

const GOOGLE_MAPS_API_KEY = "AIzaSyCYqNe56qzLAp9T4zKAgKuEkHHigcNYc3o";

const ViewTripScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { activity } = route.params;

  const [fromCoords, setFromCoords] = useState(null);
  const [toCoords, setToCoords] = useState(null);
  const [userCoords, setUserCoords] = useState(null);
  const [eta, setEta] = useState(null);

  useEffect(() => {
    const fetchLocationsAndCoords = async () => {
      try {
        const fromLoc = await getLocationById(activity.ActivityFromID);
        const toLoc = await getLocationById(activity.ActivityToID);
        setFromCoords({
          latitude: fromLoc.LocationLatitude,
          longitude: fromLoc.LocationLongitude,
        });
        setToCoords({
          latitude: toLoc.LocationLatitude,
          longitude: toLoc.LocationLongitude,
        });

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const loc = await Location.getCurrentPositionAsync({});
          setUserCoords({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          });
        }
      } catch (error) {
        console.error("Failed to load coordinates:", error);
      }
    };

    fetchLocationsAndCoords();
  }, []);

  const changeStatus = async (newStatusID) => {
    try {
      const updated = { ...activity, ActivityStatusID: newStatusID };
      await updateActivity(updated);
      Alert.alert("Status Updated!");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Failed to update status.");
    }
  };

  const handleDelete = async () => {
    Alert.alert("Confirm Deletion", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteActivity(activity.ActivityID);
            Alert.alert("Deleted");
            navigation.goBack();
          } catch (error) {
            console.error("Delete error:", error);
            Alert.alert("Failed to delete trip.");
          }
        },
      },
    ]);
  };

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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{activity.ActivityName}</Text>
        <Text style={styles.subtitle}>{activity.ActivityDescription}</Text>

        <View style={styles.card}>
          <Text style={styles.label}>From:</Text>
          <Text style={styles.value}>{activity.ActivityFromName}</Text>

          <Text style={styles.label}>To:</Text>
          <Text style={styles.value}>{activity.ActivityToName}</Text>

          <Text style={styles.label}>Leave:</Text>
          <Text style={styles.value}>
            {new Date(activity.ActivityLeave).toLocaleString()}
          </Text>

          <Text style={styles.label}>Arrive:</Text>
          <Text style={styles.value}>
            {new Date(activity.ActivityArrive).toLocaleString()}
          </Text>

          <Text
            style={[
              styles.status,
              { color: getStatusColor(activity.ActivityStatusName) },
            ]}
          >
            {activity.ActivityStatusName}
          </Text>
        </View>

        {fromCoords && toCoords && (
          <>
            <MapView
              style={styles.map}
              region={{
                latitude: fromCoords.latitude,
                longitude: fromCoords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker coordinate={fromCoords} title="Start" />
              <Marker coordinate={toCoords} title="Destination" />
              {userCoords && activity.ActivityStatusName === "Started" && (
                <Marker coordinate={userCoords} title="You" pinColor="blue" />
              )}
              {userCoords &&
                toCoords &&
                userCoords.latitude &&
                userCoords.longitude &&
                toCoords.latitude &&
                toCoords.longitude && (
                  <MapViewDirections
                    origin={{
                      latitude: userCoords.latitude,
                      longitude: userCoords.longitude,
                    }}
                    destination={{
                      latitude: toCoords.latitude,
                      longitude: toCoords.longitude,
                    }}
                    apikey={GOOGLE_MAPS_API_KEY}
                    strokeWidth={4}
                    strokeColor="blue"
                    onReady={(result) => {
                      const minutes = Math.ceil(result.duration);
                      setEta(`${minutes} min`);
                    }}
                    onError={(error) => {
                      console.warn("MapViewDirections Error:", error);
                    }}
                  />
                )}
            </MapView>
            {eta && (
              <View style={styles.etaContainer}>
                <Text style={styles.etaText}>ETA: {eta}</Text>
              </View>
            )}
          </>
        )}

        <View style={styles.buttonContainer}>
          <Button onPress={() => changeStatus(2)} style={styles.actionButton}>
            <Icon name="play" size={16} color="white" style={styles.icon} />
            <Text> Start </Text>
          </Button>
          <Button onPress={() => changeStatus(5)} style={styles.actionButton}>
            <Icon name="check" size={16} color="white" style={styles.icon} />
            <Text> Complete </Text>
          </Button>
          <Button
            onPress={() => navigation.navigate("Modify", { activity })}
            style={styles.actionButton}
          >
            <Icon name="pencil" size={16} color="white" style={styles.icon} />
            <Text> Modify </Text>
          </Button>
          <Button onPress={handleDelete} style={styles.deleteButton}>
            <Icon name="trash" size={16} color="white" style={styles.icon} />
            <Text> Delete </Text>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#f1f1f1",
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
    elevation: 1,
  },
  label: {
    fontWeight: "600",
    marginTop: 6,
  },
  value: {
    marginBottom: 4,
    color: "#333",
  },
  status: {
    marginTop: 10,
    fontWeight: "bold",
    textAlign: "right",
  },
  map: {
    width: "100%",
    height: 300,
    borderRadius: 10,
    marginVertical: 12,
  },
  etaContainer: {
    backgroundColor: "#e0f7fa",
    padding: 8,
    marginBottom: 10,
    borderRadius: 8,
    alignSelf: "center",
  },
  etaText: {
    color: "#00796b",
    fontWeight: "bold",
  },
  buttonContainer: {
    marginTop: 16,
    gap: 10,
  },
  actionButton: {
    backgroundColor: "#00AEEF",
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  deleteButton: {
    backgroundColor: "#e53935",
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
  },
  icon: {
    marginRight: 6,
  },
});

export default ViewTripScreen;
*/
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import Icon from "react-native-vector-icons/FontAwesome";
import Button from "../../components/UI/Button";

const GOOGLE_MAPS_API_KEY = "AIzaSyCYqNe56qzLAp9T4zKAgKuEkHHigcNYc3o"; // Replace with your key

const ViewTripScreen = () => {
  const [fromCoords, setFromCoords] = useState(null);
  const [toCoords, setToCoords] = useState(null);
  const [eta, setEta] = useState(null);

  useEffect(() => {
    // Hardcoded: London Eye to Big Ben
    // TEST PURPOSES ONLY - WILL BE REPLACED WITH THE ACTUAL DATA FROM THE API LATER (hopefully :<   )
    const hardcodedFrom = {
      latitude: 51.5033,
      longitude: -0.1195,
    };

    const hardcodedTo = {
      latitude: 51.5007,
      longitude: -0.1246,
    };

    setFromCoords(hardcodedFrom);
    setToCoords(hardcodedTo);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Test Trip: London Eye ➜ Big Ben</Text>

        {fromCoords && toCoords && (
          <>
            <MapView
              style={styles.map}
              region={{
                latitude: fromCoords.latitude,
                longitude: fromCoords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker coordinate={fromCoords} title="From: London Eye" />
              <Marker coordinate={toCoords} title="To: Big Ben" />

              <MapViewDirections
                origin={fromCoords}
                destination={toCoords}
                apikey={GOOGLE_MAPS_API_KEY}
                strokeWidth={4}
                strokeColor="blue"
                onReady={(result) => {
                  const minutes = Math.ceil(result.duration);
                  setEta(`${minutes} min`);
                }}
                onError={(error) => {
                  console.warn("MapViewDirections Error:", error);
                }}
              />
            </MapView>

            {eta && (
              <View style={styles.etaContainer}>
                <Text style={styles.etaText}>Estimated Time: {eta}</Text>
              </View>
            )}
          </>
        )}

        <View style={styles.buttonContainer}>
          <Button
            onPress={() => Alert.alert("Panic Alert", "This is a test button")}
            style={styles.actionButton}
          >
            <Icon
              name="exclamation-triangle"
              size={16}
              color="white"
              style={styles.icon}
            />
            <Text style={styles.buttonText}> Panic </Text>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  map: {
    width: "100%",
    height: 300,
    borderRadius: 10,
    marginBottom: 16,
  },
  etaContainer: {
    backgroundColor: "#e0f7fa",
    padding: 8,
    borderRadius: 8,
    alignSelf: "center",
    marginBottom: 16,
  },
  etaText: {
    color: "#00796b",
    fontWeight: "bold",
  },
  buttonContainer: {
    marginTop: 16,
    gap: 10,
  },
  actionButton: {
    backgroundColor: "#ff5252",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 6,
  },
  icon: {
    marginRight: 6,
  },
});

export default ViewTripScreen;
