import type { FC } from "react";
import React from "react";
import { Tabs } from "expo-router";
import { HeaderLogo, SignInLink } from "@/components/header";
import { BASE_COLOR, PRIMARY_COLOR, SUB_BASE_COLOR } from "@/constants/colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const TAB_BAR_INACTIVE_COLOR = "white";

const TabLayout: FC = () => (
  <Tabs
    screenOptions={{
      headerStyle: { backgroundColor: BASE_COLOR },
      headerLeft: HeaderLogo,
      headerRight: SignInLink,
      headerTitle: () => null,
      tabBarActiveTintColor: PRIMARY_COLOR,
      tabBarInactiveTintColor: TAB_BAR_INACTIVE_COLOR,
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
    <Tabs.Screen
      name="camera"
      options={{
        title: "Camera",
        tabBarIcon: ({ color }) => (
          <FontAwesome size={28} name="camera" color={color} />
        ),
        headerShown: false,
      }}
    />
  </Tabs>
);

export default TabLayout;
