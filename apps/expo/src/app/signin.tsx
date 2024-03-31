import type { FC } from "react";
import { Platform, Text, View } from "react-native";
import { PageView } from "@/components/layout";
import { AppleSignInButton } from "@/libs/auth/apple";

const SignIn: FC = () => (
  <PageView className="" safeArea>
    <View className="-mt-32 w-9/12 space-y-4">
      <Text className="mb-4 text-2xl font-bold text-zinc-200">Sign In</Text>
      {Platform.OS === "ios" && <AppleSignInButton />}
    </View>
  </PageView>
);

export default SignIn;
