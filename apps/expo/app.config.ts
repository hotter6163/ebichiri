import type { ExpoConfig } from "@expo/config";

if (
  !process.env.EXPO_PUBLIC_SUPABASE_URL ||
  !process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
) {
  throw new Error(
    "Please provide SUPABASE_URL and SUPABASE_ANON_KEY in your .env file",
  );
}

const defineConfig = (): ExpoConfig => ({
  name: "えびちり",
  slug: "ebichiri",
  scheme: "ebichiri",
  version: "2.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "dark",
  splash: {
    image: "./assets/icon.png",
    resizeMode: "contain",
    backgroundColor: "#18181A",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    bundleIdentifier: "app.ebichiri",
    supportsTablet: true,
    usesAppleSignIn: true,
  },
  android: {
    package: "your.bundle.identifier",
    adaptiveIcon: {
      foregroundImage: "./assets/icon.png",
      backgroundColor: "#18181A",
    },
  },
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
  },
  extra: {
    eas: {
      projectId: "a9f4c075-d48c-40d6-9dfd-c5e254db0ed4",
    },
  },
  plugins: [
    "./expo-plugins/with-modify-gradle.js",
    "expo-apple-authentication",
    "expo-secure-store",
    [
      "expo-camera",
      {
        cameraPermission: "Allow ebichiri to access your camera",
        microphonePermission: "Allow ebichiri to access your microphone",
        recordAudioAndroid: true,
      },
    ],
    [
      "expo-location",
      {
        locationAlwaysAndWhenInUsePermission:
          "Allow ebichiri to use your location.",
      },
    ],
    [
      "expo-media-library",
      {
        photosPermission: "Allow ebichiri to access your photos.",
        savePhotosPermission: "Allow ebichiri to save photos.",
        isAccessMediaLocationEnabled: true,
      },
    ],
  ],
});

export default defineConfig;
