import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Text,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapViewDirections from "react-native-maps-directions";
import { apiRequest } from "../../api/apiClient";
import "react-native-get-random-values";
import { createActivity } from "../../api/activityApi";

const GOOGLE_MAPS_API_KEY = "AIzaSyCYqNe56qzLAp9T4zKAgKuEkHHigcNYc3o";

const PositionScreen = () => {
  const [location, setLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [destination, setDestination] = useState(null);

  useEffect(() => {
    let locationSubscription;
    let intervalId;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Allow location access to use the map."
        );
        setLoading(false);
        return;
      }

      const userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation.coords);
      setRouteCoordinates([userLocation.coords]);
      setLoading(false);
      sendLocationToAPI(userLocation.coords);

      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 2000,
          distanceInterval: 10,
        },
        (newLocation) => {
          setLocation(newLocation.coords);
          setRouteCoordinates((prev) => [...prev, newLocation.coords]);
          sendLocationToAPI(newLocation.coords);
          checkRouteDeviation(newLocation.coords);
        }
      );

      intervalId = setInterval(async () => {
        const currentLocation = await Location.getCurrentPositionAsync({});
        sendLocationToAPI(currentLocation.coords);
      }, 300000);
    })();

    return () => {
      locationSubscription?.remove();
      clearInterval(intervalId);
    };
  }, []);

  const sendLocationToAPI = async (coords) => {
    try {
      const body = {
        PositionActivityID: 23,
        PositionLatitude: coords.latitude,
        PositionLongitude: coords.longitude,
        PositionTimestamp: Math.floor(Date.now() / 1000),
      };

      const response = await apiRequest("/positions", "POST", body);
      console.log("Location sent to API successfully:", response);
    } catch (error) {
      console.error("Error sending location:", error);
    }
  };

  const checkRouteDeviation = (currentCoords) => {
    if (!destination || !routeCoordinates.length) return;

    const deviationThreshold = 50; // meters

    const isOnRoute = routeCoordinates.some((waypoint) => {
      return getDistance(currentCoords, waypoint) < deviationThreshold;
    });

    if (!isOnRoute) {
      Alert.alert("Warning!", "You are off your planned route!");
      console.log("Deviation detected! Alert triggered.");
    }
  };

  const getDistance = (point1, point2) => {
    const R = 6371000;
    const lat1 = (point1.latitude * Math.PI) / 180;
    const lat2 = (point2.latitude * Math.PI) / 180;
    const deltaLat = lat2 - lat1;
    const deltaLon = ((point2.longitude - point1.longitude) * Math.PI) / 180;

    const a =
      Math.sin(deltaLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const triggerEmergencyAlert = async () => {
    try {
      const now = new Date().toISOString();

      //This data  needs to be replaced later. Right now it hardcoded for testing purposes.
      //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      const alertActivity = {
        ActivityID: 1,
        ActivityName: "EMERGENCY ALERT",
        ActivityUserID: 1,
        ActivityDescription: "User triggered emergency alert via panic button.",
        ActivityFromID: 10,
        ActivityLeave: now,
        ActivityToID: 8,
        ActivityArrive: now,
        ActivityStatusID: 5,

        ActivityUsername: "aishaahmed",
        ActivityFromName: "Current Location",
        ActivityToName: "Unknown / Emergency",
        ActivityStatusName: "Completed",
      };

      const response = await createActivity(alertActivity);

      console.log("Emergency activity logged:", response);

      Alert.alert(
        "Emergency Alert Sent",
        "An emergency alert has been logged.",
        [{ text: "OK" }]
      );
    } catch (err) {
      console.error("Failed to log alert:", err);
      Alert.alert("Error", "Could not send alert.");
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#42a5f5" style={styles.loader} />
      ) : (
        <>
          <GooglePlacesAutocomplete
            placeholder="Enter Destination"
            minLength={2}
            fetchDetails={true}
            onPress={(data, details = null) => {
              if (details) {
                setDestination({
                  latitude: details.geometry.location.lat,
                  longitude: details.geometry.location.lng,
                });
              }
            }}
            query={{
              key: GOOGLE_MAPS_API_KEY,
              language: "en",
            }}
            styles={{
              container: { flex: 0, zIndex: 1 },
              textInput: {
                height: 44,
                color: "#000",
                fontSize: 16,
                backgroundColor: "#fff",
                borderColor: "#ccc",
                borderWidth: 1,
                paddingHorizontal: 10,
                borderRadius: 8,
                margin: 10,
              },
            }}
          />

          <MapView
            style={styles.map}
            region={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            showsUserLocation={true}
          >
            <Marker coordinate={location} title="Your Location" />
            {destination && (
              <Marker
                coordinate={destination}
                pinColor="blue"
                title="Destination"
              />
            )}

            {location &&
              destination &&
              location.latitude &&
              location.longitude &&
              destination.latitude &&
              destination.longitude && (
                <MapViewDirections
                  origin={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                  }}
                  destination={{
                    latitude: destination.latitude,
                    longitude: destination.longitude,
                  }}
                  apikey={GOOGLE_MAPS_API_KEY}
                  strokeWidth={4}
                  strokeColor="blue"
                  optimizeWaypoints={true}
                  onReady={(result) => {
                    console.log("Route loaded!", result.coordinates);
                    setRouteCoordinates(result.coordinates);
                  }}
                  onError={(error) => {
                    console.warn("Directions API Error:", error);
                  }}
                />
              )}
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
  container: { flex: 1 },
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
    elevation: 5,
  },
  panicText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default PositionScreen;
