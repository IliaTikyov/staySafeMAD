import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { deleteActivity, updateActivity } from "../../api/activityApi";
import { getLocationById } from "../../api/locationApi";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import Button from "../../components/UI/Button";
import Icon from "react-native-vector-icons/FontAwesome";

const GOOGLE_MAPS_API_KEY = "AIzaSyCYqNe56qzLAp9T4zKAgKuEkHHigcNYc3o";

const ViewTripScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { activity } = route.params;

  const [fromCoords, setFromCoords] = useState(null);
  const [toCoords, setToCoords] = useState(null);
  const [eta, setEta] = useState(null);
  const [arriveTime, setArriveTime] = useState(null);
  const [leaveTime, setLeaveTime] = useState(new Date(activity.ActivityLeave));
  const [travelMode, setTravelMode] = useState("WALKING");

  useEffect(() => {
    const fetchCoords = async () => {
      try {
        const from = await getLocationById(activity.ActivityFromID);
        const to = await getLocationById(activity.ActivityToID);

        if (
          from?.LocationLatitude &&
          from?.LocationLongitude &&
          to?.LocationLatitude &&
          to?.LocationLongitude
        ) {
          const fromLat = parseFloat(from.LocationLatitude);
          const fromLng = parseFloat(from.LocationLongitude);
          const toLat = parseFloat(to.LocationLatitude);
          const toLng = parseFloat(to.LocationLongitude);

          if (
            !isNaN(fromLat) &&
            !isNaN(fromLng) &&
            !isNaN(toLat) &&
            !isNaN(toLng)
          ) {
            setFromCoords({ latitude: fromLat, longitude: fromLng });
            setToCoords({ latitude: toLat, longitude: toLng });
          } else {
            console.warn("Invalid coordinates received from API");
          }
        }
      } catch (err) {
        console.error("Failed to load locations:", err);
      }
    };

    fetchCoords();
  }, []);

  const toggleTravelMode = () => {
    setEta(null);
    setTravelMode((prev) => (prev === "WALKING" ? "DRIVING" : "WALKING"));
  };

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

  return (
    <SafeAreaView style={styles.safeArea}>
      {fromCoords && toCoords ? (
        <>
          <View style={styles.mapWrapper}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: fromCoords.latitude,
                longitude: fromCoords.longitude,
                latitudeDelta: 0.03,
                longitudeDelta: 0.03,
              }}
            >
              <Marker coordinate={fromCoords} title="From" />
              <Marker coordinate={toCoords} title="To" />
              <MapViewDirections
                origin={fromCoords}
                destination={toCoords}
                apikey={GOOGLE_MAPS_API_KEY}
                strokeWidth={4}
                strokeColor="blue"
                mode={travelMode}
                onReady={(result) => {
                  const minutes = Math.ceil(result.duration);
                  setEta(`${minutes} min`);

                  const calculatedArrive = new Date(
                    leaveTime.getTime() + minutes * 60000
                  );
                  setArriveTime(calculatedArrive);
                }}
                onError={(err) => {
                  console.warn("MapViewDirections Error:", err);
                }}
              />
            </MapView>
            <View style={styles.etaContainer}>
              <Text style={styles.etaText}>ETA: {eta || "..."}</Text>
              <TouchableOpacity onPress={toggleTravelMode}>
                <Text style={styles.switchText}>
                  Mode: {travelMode === "WALKING" ? "🚶 Walking" : "🚗 Driving"}{" "}
                  (Tap to switch)
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.details}>
            <Text style={styles.title}>{activity.ActivityName}</Text>
            <Text style={styles.subtitle}>{activity.ActivityDescription}</Text>

            <View style={styles.card}>
              <Text style={styles.label}>From:</Text>
              <Text style={styles.value}>{activity.ActivityFromName}</Text>

              <Text style={styles.label}>To:</Text>
              <Text style={styles.value}>{activity.ActivityToName}</Text>

              <Text style={styles.label}>Leave:</Text>
              <Text style={styles.value}>{leaveTime.toLocaleString()}</Text>

              <Text style={styles.label}>Arrive:</Text>
              <Text style={styles.value}>
                {arriveTime
                  ? arriveTime.toLocaleString()
                  : "Calculating ETA..."}
              </Text>

              <Text style={styles.status}>{activity.ActivityStatusName}</Text>
            </View>

            <View style={styles.buttonContainer}>
              <Button
                onPress={() => changeStatus(2)}
                style={styles.actionButton}
              >
                <Icon name="play" size={16} color="white" style={styles.icon} />
                <Text> Start </Text>
              </Button>
              <Button
                onPress={() => changeStatus(5)}
                style={styles.actionButton}
              >
                <Icon
                  name="check"
                  size={16}
                  color="white"
                  style={styles.icon}
                />
                <Text> Complete </Text>
              </Button>
              <Button
                onPress={() => navigation.navigate("Modify", { activity })}
                style={styles.actionButton}
              >
                <Icon
                  name="pencil"
                  size={16}
                  color="white"
                  style={styles.icon}
                />
                <Text> Modify </Text>
              </Button>
              <Button onPress={handleDelete} style={styles.deleteButton}>
                <Icon
                  name="trash"
                  size={16}
                  color="white"
                  style={styles.icon}
                />
                <Text> Delete </Text>
              </Button>
            </View>
          </ScrollView>
        </>
      ) : (
        <ActivityIndicator
          style={{ flex: 1, justifyContent: "center" }}
          size="large"
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  mapWrapper: { height: 300, width: "100%" },
  map: { flex: 1 },
  etaContainer: {
    padding: 10,
    alignItems: "center",
    backgroundColor: "#f0f8ff",
  },
  etaText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#00796b",
    marginBottom: 4,
  },
  switchText: {
    color: "#007AFF",
    textDecorationLine: "underline",
  },
  details: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
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
    color: "#00AEEF",
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

/* import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { deleteActivity, updateActivity } from "../../api/activityApi";
import { getLocationById } from "../../api/locationApi";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import Button from "../../components/UI/Button";
import Icon from "react-native-vector-icons/FontAwesome";

const GOOGLE_MAPS_API_KEY = "AIzaSyCYqNe56qzLAp9T4zKAgKuEkHHigcNYc3o";

const ViewTripScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { activity } = route.params;

  const [fromCoords, setFromCoords] = useState(null);
  const [toCoords, setToCoords] = useState(null);
  const [eta, setEta] = useState(null);
  const [travelMode, setTravelMode] = useState("WALKING");

  useEffect(() => {
    const fetchCoords = async () => {
      try {
        const from = await getLocationById(activity.ActivityFromID);
        const to = await getLocationById(activity.ActivityToID);
        if (from && to) {
          setFromCoords({
            latitude: from.LocationLatitude,
            longitude: from.LocationLongitude,
          });
          setToCoords({
            latitude: to.LocationLatitude,
            longitude: to.LocationLongitude,
          });
        }
      } catch (err) {
        console.error("Failed to load locations:", err);
      }
    };
    fetchCoords();
  }, []);

  const toggleTravelMode = () => {
    setEta(null);
    setTravelMode((prev) => (prev === "WALKING" ? "DRIVING" : "WALKING"));
  };

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

  return (
    <SafeAreaView style={styles.safeArea}>
      {fromCoords && toCoords ? (
        <>
          <View style={styles.mapWrapper}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: fromCoords.latitude,
                longitude: fromCoords.longitude,
                latitudeDelta: 0.03,
                longitudeDelta: 0.03,
              }}
            >
              <Marker coordinate={fromCoords} title="From" />
              <Marker coordinate={toCoords} title="To" />
              <MapViewDirections
                origin={fromCoords}
                destination={toCoords}
                apikey={GOOGLE_MAPS_API_KEY}
                strokeWidth={4}
                strokeColor="blue"
                mode={travelMode}
                onReady={(result) => {
                  setEta(`${Math.ceil(result.duration)} min`);
                }}
                onError={(err) => {
                  console.warn("MapViewDirections Error:", err);
                }}
              />
            </MapView>
            <View style={styles.etaContainer}>
              <Text style={styles.etaText}>ETA: {eta || "..."}</Text>
              <TouchableOpacity onPress={toggleTravelMode}>
                <Text style={styles.switchText}>
                  Mode: {travelMode === "WALKING" ? "🚶 Walking" : "🚗 Driving"}{" "}
                  (Tap to switch)
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.details}>
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

              <Text style={styles.status}>{activity.ActivityStatusName}</Text>
            </View>

            <View style={styles.buttonContainer}>
              <Button onPress={() => changeStatus(2)}>
                <Icon name="play" size={16} style={styles.icon} />
                <Text> Start </Text>
              </Button>
              <Button onPress={() => changeStatus(5)}>
                <Icon name="check" size={16} style={styles.icon} />
                <Text> Complete </Text>
              </Button>
              <Button
                onPress={() => navigation.navigate("Modify", { activity })}
              >
                <Icon name="pencil" size={16} style={styles.icon} />
                <Text> Modify </Text>
              </Button>
              <Button onPress={handleDelete} style={styles.deleteButton}>
                <Icon name="trash" size={16} style={styles.icon} />
                <Text> Delete </Text>
              </Button>
            </View>
          </ScrollView>
        </>
      ) : (
        <ActivityIndicator
          style={{ flex: 1, justifyContent: "center" }}
          size="large"
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  mapWrapper: {
    height: 300,
    width: "100%",
  },
  map: {
    flex: 1,
  },
  etaContainer: {
    padding: 10,
    alignItems: "center",
    backgroundColor: "#f0f8ff",
  },
  etaText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#00796b",
    marginBottom: 4,
  },
  switchText: {
    color: "#007AFF",
    textDecorationLine: "underline",
  },
  details: {
    flex: 1,
    padding: 20,
  },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center" },
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
  },
  label: { fontWeight: "600", marginTop: 6 },
  value: { marginBottom: 4, color: "#333" },
  status: {
    marginTop: 10,
    fontWeight: "bold",
    textAlign: "right",
    color: "#00AEEF",
  },
  buttonContainer: {
    marginTop: 10,
    gap: 10,
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
    color: "white",
  },
});

export default ViewTripScreen; 
*/

/*
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
 */
