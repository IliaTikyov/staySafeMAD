import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import { Text, TouchableOpacity } from "react-native";
import AddTripScreen from "./screens/AddTripScreen";
import ViewTripScreen from "./screens/ViewTripScreen";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={({ navigation }) => ({
            title: "Home",
            headerLeft: () => null,
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.replace("Login")}>
                <Text
                  style={{
                    marginRight: 20,
                    color: "white",
                    fontSize: 18,
                    fontWeight: "bold",
                    backgroundColor: "#FF4C4C",
                    paddingVertical: 6,
                    paddingHorizontal: 12,
                    borderRadius: 10,
                  }}
                >
                  Logout
                </Text>
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen name="Add" component={AddTripScreen} />
        <Stack.Screen name="View" component={ViewTripScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
