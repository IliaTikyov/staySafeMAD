import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

const UserViewScreen = ({ route }) => {
  const { user } = route.params;

  return (
    <View style={styles.container}>
      {user.userImage && (
        <Image source={{ uri: user.userImage }} style={styles.profileImage} />
      )}
      <Text style={styles.name}>{user.fullName}</Text>
      <Text style={styles.label}>Relationship: {user.ContactLabel}</Text>
      <Text style={styles.date}>Added on: {user.ContactDatecreated}</Text>
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>User Info</Text>
        <Text>Username: {user.UserUsername || "N/A"}</Text>
        <Text>Phone: {user.UserPhone || "N/A"}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  label: {
    fontSize: 18,
    color: "#555",
  },
  date: {
    fontSize: 14,
    color: "#888",
    marginBottom: 20,
  },
  infoBox: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    width: "100%",
  },
  infoTitle: {
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default UserViewScreen;
