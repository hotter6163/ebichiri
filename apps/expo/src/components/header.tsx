import type { FC } from "react";
import { Pressable, Text, View } from "react-native";
import { Link, useRouter } from "expo-router";
import { PRIMARY_COLOR } from "@/constants/colors";
import { AntDesign } from "@expo/vector-icons";
import { useUser } from "@supabase/auth-helpers-react";

export const HeaderLogo: FC = () => (
  <View className="pl-4">
    <Text
      className="text-4xl font-extrabold tracking-wider"
      style={{ color: PRIMARY_COLOR }}
    >
      EBICHIRI
    </Text>
  </View>
);

export const SignInLink: FC = () => {
  const user = useUser();

  return !user ? (
    <View className="pr-4">
      <Link href="/signin" style={{ color: "white" }} className="text-white">
        Log In
      </Link>
    </View>
  ) : null;
};

export const BackButton: FC = () => {
  const router = useRouter();
  const onPress = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/");
  };

  return (
    <Pressable onPress={onPress}>
      <AntDesign name="left" size={24} color="white" />
    </Pressable>
  );
};
