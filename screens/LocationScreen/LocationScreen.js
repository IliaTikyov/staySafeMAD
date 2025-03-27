import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  TextInput,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { getLocations } from "../../api/locationApi";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { deleteLocation } from "../../api/locationApi";
import Icon from "react-native-vector-icons/FontAwesome";
import { Alert } from "react-native";
import Button from "../../components/UI/Button";

const { height } = Dimensions.get("window");

const LocationScreen = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const fetchLocations = async () => {
        try {
          setLoading(true);
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
    }, [])
  );

  const filteredLocations = locations.filter((loc) =>
    loc.LocationName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (locationId) => {
    Alert.alert(
      "Delete Location",
      "Are you sure you want to delete this location?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteLocation(locationId);

              const updated = locations.filter(
                (loc) => loc.LocationID !== locationId
              );
              setLocations(updated);

              if (selectedLocation?.LocationID === locationId) {
                setSelectedLocation(null);
                if (updated.length > 0) {
                  setRegion({
                    latitude: updated[0].LocationLatitude,
                    longitude: updated[0].LocationLongitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                  });
                } else {
                  setRegion(null);
                }
              }
            } catch (err) {
              console.error("Error deleting location:", err);
              alert("Failed to delete location.");
            }
          },
        },
      ]
    );
  };

  const handleCardPress = (location) => {
    setSelectedLocation(location);
    setRegion({
      latitude: location.LocationLatitude,
      longitude: location.LocationLongitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    });
  };

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#42a5f5" style={styles.loader} />
    );
  }

  return (
    <View style={styles.container}>
      {region && (
        <MapView style={styles.map} region={region}>
          {(selectedLocation ? [selectedLocation] : locations).map((loc) => (
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

      <TextInput
        style={styles.searchInput}
        placeholder="Search by location name..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredLocations}
        keyExtractor={(item) => item.LocationID.toString()}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleCardPress(item)}>
            <View
              style={[
                styles.card,
                selectedLocation?.LocationID === item.LocationID && {
                  borderColor: "#007BFF",
                  borderWidth: 3,
                },
              ]}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.title}>{item.LocationName}</Text>
                <TouchableOpacity onPress={() => handleDelete(item.LocationID)}>
                  <Icon name="trash" size={18} color="red" />
                </TouchableOpacity>
              </View>
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
          </TouchableOpacity>
        )}
      />

      <Button
        style={styles.addButton}
        onPress={() => navigation.navigate("AddLocation")}
      >
        <Icon name="plus" size={18} color="#fff" />
      </Button>
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
  searchInput: {
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 15,
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
  },

  addButton: {
    backgroundColor: "#00AEEF",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    position: "absolute",
    bottom: 20,
    right: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
});

export default LocationScreen;
