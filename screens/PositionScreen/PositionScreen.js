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

const GOOGLE_MAPS_API_KEY = "AIzaSyBuXLenUPKx4dA9Ohw6uuM98CUMc1Z3R6s";

const PositionScreen = () => {
  const [location, setLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startLocation, setStartLocation] = useState(null);
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
          setRouteCoordinates((prevCoords) => [
            ...prevCoords,
            newLocation.coords,
          ]);
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

    const deviationThreshold = 50;

    let isOnRoute = routeCoordinates.some((waypoint) => {
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
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(deltaLon / 2) *
        Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
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
          <GooglePlacesAutocomplete
            placeholder="Enter Destination"
            minLength={2}
            fetchDetails={true}
            onPress={(data, details = null) => {
              if (details) {
                console.log("Selected Destination:", details.geometry.location);
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
              container: { flex: 0 },
              textInput: { height: 40, color: "#000", fontSize: 16 },
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
            {location && <Marker coordinate={location} title="Your Location" />}
            {destination && (
              <Marker
                coordinate={destination}
                pinColor="blue"
                title="Destination"
              />
            )}
            {destination && (
              <MapViewDirections
                origin={location}
                destination={destination}
                apikey={GOOGLE_MAPS_API_KEY}
                strokeWidth={5}
                strokeColor="blue"
                optimizeWaypoints={true}
                onReady={(result) => {
                  console.log("Route loaded!", result.coordinates);
                  setRouteCoordinates(result.coordinates);
                }}
                onError={(error) => console.log("Directions API Error:", error)}
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
    elevation: 5,
  },
  panicText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default PositionScreen;
