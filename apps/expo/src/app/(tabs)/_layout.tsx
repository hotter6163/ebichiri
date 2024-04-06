import type { FC } from "react";
import { Image } from "react-native";
import { Tabs } from "expo-router";
import { Header } from "@/components/header";
import { PRIMARY_COLOR, SUB_BASE_COLOR } from "@/constants/colors";
import { api } from "@/utils/api";
import { Entypo, Feather, FontAwesome, FontAwesome5 } from "@expo/vector-icons";

const TAB_BAR_INACTIVE_COLOR = "white";

const TabLayout: FC = () => {
  const { data } = api.user.getMine.useQuery();

  return (
    <Tabs
      screenOptions={{
        header: () => <Header />,
        tabBarActiveTintColor: PRIMARY_COLOR,
        tabBarInactiveTintColor: TAB_BAR_INACTIVE_COLOR,
        tabBarStyle: { backgroundColor: SUB_BASE_COLOR },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome size={24} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome size={24} name="camera" color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="photo"
        options={{
          tabBarIcon: ({ color }) => (
            <Entypo name="images" size={24} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="map-marked-alt" size={24} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) =>
            data?.avatar ? (
              <Image
                source={{ uri: data.avatar }}
                style={{ width: 24, height: 24 }}
              />
            ) : (
              <Feather name="user" size={24} color={color} />
            ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
