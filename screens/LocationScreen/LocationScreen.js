import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { getLocations } from "../../api/locationApi";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";

const { height } = Dimensions.get("window");

const LocationScreen = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await getLocations();
        setLocations(data);

        if (data.length > 0) {
          setRegion({
            latitude: data[0].LocationLatitude,
            longitude: data[0].LocationLongitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          });
        }
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);
  if (loading) {
    return (
      <ActivityIndicator size="large" color="#42a5f5" style={styles.loader} />
    );
  }

  return (
    <View style={styles.container}>
      {region && (
        <MapView style={styles.map} region={region}>
          {locations.map((loc) => (
            <Marker
              key={loc.LocationID}
              coordinate={{
                latitude: loc.LocationLatitude,
                longitude: loc.LocationLongitude,
              }}
              title={loc.LocationName}
              description={loc.LocationDescription}
            />
          ))}
        </MapView>
      )}

      <FlatList
        data={locations}
        keyExtractor={(item) => item.LocationID.toString()}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.LocationName}</Text>
            <Text style={styles.description}>
              <FontAwesome5 name="info-circle" size={14} color="#555" />{" "}
              {item.LocationDescription}
            </Text>
            <Text style={styles.address}>
              <FontAwesome5 name="map-marker-alt" size={14} color="tomato" />{" "}
              {item.LocationAddress}
            </Text>
            <Text style={styles.coords}>
              <FontAwesome5 name="globe" size={14} color="teal" />{" "}
              {item.LocationLatitude}, {item.LocationLongitude}
            </Text>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddLocation")}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: height * 0.35,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
  },
  listContainer: {
    padding: 15,
    backgroundColor: "#f9f9f9",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    marginBottom: 3,
  },
  address: {
    fontSize: 13,
    color: "#555",
  },
  coords: {
    fontSize: 12,
    color: "#888",
  },
  addButton: {
    backgroundColor: "#007BFF",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    position: "absolute",
    bottom: 20,
    right: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 10,
  },
});

export default LocationScreen;
