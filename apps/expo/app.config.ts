import type { ExpoConfig } from "@expo/config";

if (
  !process.env.EXPO_PUBLIC_SUPABASE_URL ||
  !process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
) {
  throw new Error(
    "Please provide SUPABASE_URL and SUPABASE_ANON_KEY in your .env file",
  );
}

const VERSION = "1.0.0";
const BUILD_NUMBER = "2";
const APPLE_STORE_URL = "https://apps.apple.com/jp/app/id6484062256";

const defineConfig = (): ExpoConfig => ({
  name: "えびちり",
  slug: "ebichiri",
  scheme: "ebichiri",
  version: VERSION,
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
    bundleIdentifier: "com.ebichiri",
    buildNumber: BUILD_NUMBER,
    appStoreUrl: APPLE_STORE_URL,
    supportsTablet: true,
    usesAppleSignIn: true,
    config: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    },
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
      projectId: process.env.EXPO_PROJECT_ID,
    },
  },
  plugins: [
    "./expo-plugins/with-modify-gradle.js",
    "expo-apple-authentication",
    "expo-secure-store",
    "expo-router",
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
    [
      "expo-image-picker",
      {
        photosPermission:
          "The app accesses your photos to let you share them with your friends.",
      },
    ],
  ],
});

export default defineConfig;
