import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View } from "react-native";
import { Text, TouchableOpacity } from "react-native";

// Screens
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import ActivityScreen from "./screens/ActivityScreens/ActivityScreen";
import AddTripScreen from "./screens/ActivityScreens/AddTripScreen";
import ModifyTripScreen from "./screens/ActivityScreens/ModifyTripScreen";
import ViewTripScreen from "./screens/ActivityScreens/ViewTripScreen";
import StatusScreen from "./screens/StatusScreen/StatusScreen";
import PositionScreen from "./screens/PositionScreen/PositionScreen";
import AddLocationsScreen from "./screens/ActivityScreens/AddLocationsScreen";
import ContactsScreen from "./screens/ContactScreen/Contacts";
import UserViewScreen from "./screens/ContactScreen/UserViewScreen";
import LocationScreen from "./screens/LocationScreen/LocationScreen";
import AddingLocationScreen from "./screens/LocationScreen/AddingLocationScreen";

const Stack = createStackNavigator();

const App = () => {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkLogin = async () => {
      const loggedIn = await AsyncStorage.getItem("loggedIn");
      setInitialRoute(loggedIn === "true" ? "HomeScreen" : "Login");
    };
    checkLogin();
  }, []);

  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#00AEEF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
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
              <TouchableOpacity
                onPress={async () => {
                  await AsyncStorage.removeItem("loggedIn");
                  navigation.replace("Login");
                }}
              >
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
        <Stack.Screen name="ActivityScreen" component={ActivityScreen} />
        <Stack.Screen name="Add" component={AddTripScreen} />
        <Stack.Screen name="Modify" component={ModifyTripScreen} />
        <Stack.Screen name="View" component={ViewTripScreen} />
        <Stack.Screen name="StatusScreen" component={StatusScreen} />
        <Stack.Screen name="PositionScreen" component={PositionScreen} />
        <Stack.Screen name="AddLocations" component={AddLocationsScreen} />
        <Stack.Screen name="ContactsScreen" component={ContactsScreen} />
        <Stack.Screen name="UserView" component={UserViewScreen} />
        <Stack.Screen name="LocationScreen" component={LocationScreen} />
        <Stack.Screen name="AddLocation" component={AddingLocationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
