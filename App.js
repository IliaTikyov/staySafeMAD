import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/LoginScreen";
import { Text, TouchableOpacity } from "react-native";
import ActivityScreen from "./screens/ActivityScreens/ActivityScreen";
import AddTripScreen from "./screens/ActivityScreens/AddTripScreen";
import ModifyTripScreen from "./screens/ActivityScreens/ModifyTripScreen";
import ViewTripScreen from "./screens/ActivityScreens/ViewTripScreen";
import HomeScreen from "./screens/HomeScreen";
import StatusScreen from "./screens/StatusScreen/StatusScreen";
import PositionScreen from "./screens/PositionScreen/PositionScreen";
import AddLocationsScreen from "./screens/ActivityScreens/AddLocationsScreen";
import ContactsScreen from "./screens/ContactScreen/Contacts";
import UserViewScreen from "./screens/ContactScreen/UserViewScreen";
import LocationScreen from "./screens/LocationScreen/LocationScreen";
import AddingLocationScreen from "./screens/LocationScreen/AddingLocationScreen";

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
          name="ActivityScreen"
          component={ActivityScreen}
          options={{ title: "Activities" }}
        />
        <Stack.Screen
          name="StatusScreen"
          component={StatusScreen}
          options={{ title: "Status" }}
        />
        <Stack.Screen
          name="PositionScreen"
          component={PositionScreen}
          options={{ title: "Live Location" }}
        />
        <Stack.Screen
          name="ContactsScreen"
          component={ContactsScreen}
          options={{ title: "Contacts" }}
        />
        <Stack.Screen
          name="LocationScreen"
          component={LocationScreen}
          options={{ title: "Location" }}
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
        <Stack.Screen name="Modify" component={ModifyTripScreen} />
        <Stack.Screen name="AddLocations" component={AddLocationsScreen} />
        <Stack.Screen name="UserView" component={UserViewScreen} />
        <Stack.Screen name="AddLocation" component={AddingLocationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
