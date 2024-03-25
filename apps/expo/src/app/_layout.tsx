import type { FC } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { TRPCProvider } from "@/utils/api";
import { supabase } from "@/utils/supabase";
import { SessionContextProvider } from "@supabase/auth-helpers-react";

import "../styles.css";

import { SafeAreaView } from "react-native-safe-area-context";
import { cssInterop } from "nativewind";

cssInterop(SafeAreaView, { className: "style" });

const RootLayout: FC = () => (
  <SessionContextProvider supabaseClient={supabase}>
    <TRPCProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
      <StatusBar style="light" />
    </TRPCProvider>
  </SessionContextProvider>
);

export default RootLayout;
