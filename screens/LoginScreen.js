import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { loginUser } from "../api/userApi";

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please enter both username and password.");
      return;
    }

    setLoading(true);

    try {
      const user = await loginUser(username, password);
      setLoading(false);

      if (user) {
        Alert.alert("Success", `Welcome ${user.UserFirstname}!`);
        navigation.navigate("HomeScreen");
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <>
          <Image
            source={require("../Images/StaySafeLogo.png")}
            style={styles.logo}
          />
          <Text style={styles.text}>Logging in...</Text>
          <ActivityIndicator size="large" color="#00AEEF" />
        </>
      ) : (
        <>
          <Image
            source={require("../Images/StaySafeLogo.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>Login</Text>

          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="Username"
              placeholderTextColor="#A9A9A9"
              value={username}
              onChangeText={setUsername}
            />
          </View>

          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              secureTextEntry
              placeholder="Password"
              placeholderTextColor="#A9A9A9"
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={handleLogin}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

/*
          <TouchableOpacity onPress={() => navigation.navigate("SignupScreen")}>
            <Text style={styles.linkText}>First time? Sign up here</Text>
          </TouchableOpacity>
         */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#DCDCDC",
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
    paddingHorizontal: 15,
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
  // linkText: { color: "#00AEEF", fontSize: 16, marginTop: 10 },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    marginBottom: 10,
  },
});

export default LoginScreen;
