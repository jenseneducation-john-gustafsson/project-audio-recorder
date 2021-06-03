import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import PlayerScreen from "./screens/PlayerScreen";
import RecorderScreen from "./screens/RecorderScreen";

const Tab = createBottomTabNavigator();
export default function App() {
  return (
    <React.Fragment>
      <NavigationContainer>
        <Tab.Navigator initialRouteName="Record">
          <Tab.Screen name="Inspelaren" component={RecorderScreen} />
          <Tab.Screen name="Inspelade ljud" component={PlayerScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </React.Fragment>
  );
}
