import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";

const Cards = ({ children, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.card]}>
        <View style={styles.content} />
        {children}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 6,
    elevation: 3,
    backgroundColor: "#fff",
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    padding: 10,
    alignSelf: "center",
    width: "90%",
    maxWidth: 400,
    marginTop: 12,
  },
  content: {
    padding: 10,
  },
});

export default Cards;
