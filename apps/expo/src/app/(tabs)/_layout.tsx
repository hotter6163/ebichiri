import type { FC } from "react";
import React from "react";
import { Tabs } from "expo-router";
import { PRIMARY_COLOR, SUB_BASE_COLOR } from "@/constants/colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const TAB_BAR_INACTIVE_COLOR = "white";

const TabLayout: FC = () => (
  <Tabs
    screenOptions={{
      tabBarActiveTintColor: PRIMARY_COLOR,
      tabBarInactiveTintColor: TAB_BAR_INACTIVE_COLOR,
      headerShown: false,
      tabBarStyle: { backgroundColor: SUB_BASE_COLOR },
    }}
  >
    <Tabs.Screen
      name="index"
      options={{
        title: "Home",
        tabBarIcon: ({ color }) => (
          <FontAwesome size={28} name="home" color={color} />
        ),
      }}
    />
  </Tabs>
);

export default TabLayout;
