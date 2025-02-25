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

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const LoginInfo = {
    email: "ilia@gmail.com",
    password: "ilia123",
  };

  const handleSubmit = () => {
    if (
      email.toLowerCase() === LoginInfo.email &&
      password.toLowerCase() === LoginInfo.password
    ) {
      setLoading(true);

      setTimeout(() => {
        setLoading(false);
        navigation.navigate("HomeScreen");
      }, 2000);
    } else {
      Alert.alert("You have entered a wrong email or password");
    }

    setEmail("");
    setPassword("");
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
          <Text style={styles.title}>Login Page</Text>

          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="Enter your email"
              placeholderTextColor="#A9A9A9"
              value={email}
              onChangeText={(text) => setEmail(text)}
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              secureTextEntry
              placeholder="Enter your password"
              placeholderTextColor="#A9A9A9"
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
          </View>

          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={handleSubmit}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

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
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    marginBottom: 10,
  },
});

export default LoginScreen;
