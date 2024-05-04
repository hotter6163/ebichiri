import type { FC } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { TRPCProvider } from "@/libs/trpc/api";
import { supabase } from "@/utils/supabase";
import { SessionContextProvider } from "@supabase/auth-helpers-react";

import "../styles.css";

import { SafeAreaView } from "react-native-safe-area-context";
import { BackButton } from "@/components/header";
import { BASE_COLOR } from "@/constants/colors";
import { SessionHandler } from "@/libs/auth/session";
import {
  LocationProvider,
  useLocationPermission,
} from "@/libs/native/location";
import { useMediaLibraryPermission } from "@/libs/native/media-library";
import { cssInterop } from "nativewind";

cssInterop(SafeAreaView, { className: "style" });

const RootLayout: FC = () => {
  useLocationPermission();
  useMediaLibraryPermission();

  return (
    <SessionContextProvider supabaseClient={supabase}>
      <TRPCProvider>
        <LocationProvider>
          <Stack
            initialRouteName="(tabs)"
            screenOptions={{
              headerLeft: BackButton,
              headerStyle: {
                backgroundColor: BASE_COLOR,
              },
              headerTitle: () => null,
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="search" />
            <Stack.Screen name="photos/[photoId]" />
            <Stack.Screen name="profile/edit" />
            <Stack.Screen name="users/[userId]" />
          </Stack>
          <StatusBar style="light" />
          <SessionHandler />
        </LocationProvider>
      </TRPCProvider>
    </SessionContextProvider>
  );
};

export default RootLayout;
