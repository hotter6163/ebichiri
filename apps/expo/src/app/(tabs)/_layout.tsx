import type { FC } from "react";
import React from "react";
import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const TabLayout: FC = () => (
  <Tabs screenOptions={{ tabBarActiveTintColor: "blue", headerShown: false }}>
    <Tabs.Screen
      name="index"
      options={{
        title: "Home",
        tabBarIcon: ({ color }) => (
          <FontAwesome size={28} name="home" color={color} />
        ),
      }}
    />
    <Tabs.Screen
      name="settings"
      options={{
        title: "Settings",
        tabBarIcon: ({ color }) => (
          <FontAwesome size={28} name="cog" color={color} />
        ),
      }}
    />
  </Tabs>
);

export default TabLayout;
