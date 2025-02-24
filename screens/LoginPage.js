import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <Image
        source={require("../Images/StaySafeLogo.png")}
        style={styles.logo}
      />

      <Text style={styles.title}>Login Page</Text>

      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Enter your email"
          placeholderTextColor="#A9A9A9"
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          secureTextEntry
          placeholder="Enter your password"
          placeholderTextColor="#A9A9A9"
        />
      </View>

      <TouchableOpacity style={styles.buttonContainer}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#DCDCDC",
    marginTop: 0,
  },
  logo: {
    width: 160,
    height: 160,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    marginBottom: 30,
    fontWeight: "bold",
    color: "black",
  },
  inputView: {
    width: "80%",
    backgroundColor: "#D3D3D3",
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 15,
  },
  inputText: {
    height: 50,
    color: "black",
  },
  buttonContainer: {
    width: "40%",
    height: 50,
    backgroundColor: "#00AEEF",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default LoginPage;
