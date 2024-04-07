import type { FC } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { TRPCProvider } from "@/utils/api";
import { supabase } from "@/utils/supabase";
import { SessionContextProvider } from "@supabase/auth-helpers-react";

import "../styles.css";

import { SafeAreaView } from "react-native-safe-area-context";
import { BackButton } from "@/components/header";
import { BASE_COLOR } from "@/constants/colors";
import { AnonymousSignIn } from "@/libs/auth/anonymous";
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
            <Stack.Screen name="photos/[photoId]/index" />
            <Stack.Screen name="profile/edit" />
          </Stack>
          <StatusBar style="light" />
          <AnonymousSignIn />
        </LocationProvider>
      </TRPCProvider>
    </SessionContextProvider>
  );
};

export default RootLayout;
