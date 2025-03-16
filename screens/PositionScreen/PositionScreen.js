import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Text,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { apiRequest } from "../../api/apiClient";

const PositionScreen = () => {
  const [location, setLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startLocation, setStartLocation] = useState(null);
  const [destination, setDestination] = useState({
    latitude: 51.3714386, // This value is a dummy data replace to observe the alert message if the user is off road
    longitude: -0.109984, // This value is a dummy data replace to observe the alert message if the user is off road
  });

  useEffect(() => {
    let locationSubscription;

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Allow location access to use the map."
        );
        setLoading(false);
        return;
      }

      let userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation.coords);
      setStartLocation(userLocation.coords);
      setRouteCoordinates([userLocation.coords]);
      setLoading(false);

      sendLocationToAPI(userLocation.coords);

      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 2000,
          distanceInterval: 5,
        },
        (newLocation) => {
          console.log("Updated Location:", newLocation.coords);
          setLocation(newLocation.coords);

          setRouteCoordinates((prevCoords) => [
            ...prevCoords,
            newLocation.coords,
          ]);

          sendLocationToAPI(newLocation.coords);

          checkRouteDeviation(newLocation.coords);
        }
      );
    })();

    return () => {
      if (locationSubscription) {
        console.log("Stopped tracking location.");
        locationSubscription.remove();
      }
    };
  }, []);

  let lastSavedLocation = null;
  let lastSavedTime = 0;

  const sendLocationToAPI = async (coords) => {
    try {
      const currentTime = Date.now() / 1000; // Current timestamp in seconds

      // 1️⃣ Only store location if the user moved at least 50 meters
      if (
        lastSavedLocation &&
        getDistance(lastSavedLocation, coords) < 50 // 50 meters
      ) {
        return; // Skip saving to database
      }

      // 2️⃣ Only store location if at least 2 minutes have passed
      if (currentTime - lastSavedTime < 120) {
        return;
      }

      const body = {
        PositionActivityID: 23, // Replace with actual activity ID
        PositionLatitude: coords.latitude,
        PositionLongitude: coords.longitude,
        PositionTimestamp: Math.floor(currentTime), // Unix timestamp
      };

      const response = await apiRequest("/positions", "POST", body);

      console.log("Location sent to API successfully:", response);

      // Update last saved values
      lastSavedLocation = coords;
      lastSavedTime = currentTime;
    } catch (error) {
      console.error("Error sending location:", error);
    }
  };

  const getDistance = (location1, location2) => {
    const R = 6371000; // Radius of the Earth in meters
    const lat1 = (location1.latitude * Math.PI) / 180;
    const lat2 = (location2.latitude * Math.PI) / 180;
    const deltaLat = lat2 - lat1;
    const deltaLon =
      ((location2.longitude - location1.longitude) * Math.PI) / 180;

    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(deltaLon / 2) *
        Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in meters
  };

  const checkRouteDeviation = (currentCoords) => {
    const deviationThreshold = 0.005;

    const distance = Math.sqrt(
      Math.pow(currentCoords.latitude - destination.latitude, 2) +
        Math.pow(currentCoords.longitude - destination.longitude, 2)
    );

    if (distance > deviationThreshold) {
      Alert.alert("Warning!", "You are off your planned route!");
    }
  };

  const triggerEmergencyAlert = () => {
    Alert.alert(
      "Emergency Alert!",
      "Your emergency contacts have been notified with your location.",
      [{ text: "OK" }]
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#42a5f5" style={styles.loader} />
      ) : (
        <>
          <MapView
            style={styles.map}
            region={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            {location && (
              <Marker
                coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                }}
                title="Your Location"
                description="You are moving!"
              />
            )}

            {startLocation && (
              <Marker
                coordinate={{
                  latitude: startLocation.latitude,
                  longitude: startLocation.longitude,
                }}
                pinColor="green"
                title="Start Point"
              />
            )}

            {destination && (
              <Marker
                coordinate={{
                  latitude: destination.latitude,
                  longitude: destination.longitude,
                }}
                pinColor="red"
                title="Destination"
              />
            )}

            <Polyline
              coordinates={routeCoordinates}
              strokeWidth={5}
              strokeColor="#42a5f5"
            />
          </MapView>

          <TouchableOpacity
            style={styles.panicButton}
            onPress={triggerEmergencyAlert}
          >
            <Text style={styles.panicText}>PANIC</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  panicButton: {
    backgroundColor: "red",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 50,
    position: "absolute",
    bottom: 50,
    right: 20,
    backgroundColor: "red",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 50,
    elevation: 5,
  },
  panicText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default PositionScreen;
