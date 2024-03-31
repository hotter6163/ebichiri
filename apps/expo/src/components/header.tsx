import type { FC } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import { BASE_COLOR, PRIMARY_COLOR } from "@/constants/colors";
import { AntDesign, Entypo, Feather } from "@expo/vector-icons";
import { useUser } from "@supabase/auth-helpers-react";

export const Header: FC = () => {
  const { top } = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: top + 8,
        paddingHorizontal: 16,
        paddingBottom: 8,
        backgroundColor: BASE_COLOR,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
      className="border-b border-zinc-200"
    >
      <HeaderLogo />
      <HeaderRight />
    </View>
  );
};

const HeaderLogo: FC = () => (
  <Text
    className="text-4xl font-extrabold tracking-wider"
    style={{ color: PRIMARY_COLOR }}
  >
    EBICHIRI
  </Text>
);

const HeaderRight: FC = () => {
  const user = useUser();

  const href = user ? "/settings" : "/signin";
  const icon = user ? (
    <Feather name="settings" size={24} color="white" />
  ) : (
    <Entypo name="login" size={24} color="white" />
  );

  return (
    <Link
      href={href}
      style={{ color: "white", padding: 8 }}
      className="text-white"
    >
      {icon}
    </Link>
  );
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
