import type { FC } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import { BASE_COLOR, PRIMARY_COLOR } from "@/constants/colors";
import { AntDesign } from "@expo/vector-icons";

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
      <SearchLink />
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

const SearchLink: FC = () => (
  <Link href="/search" className="p-2">
    <AntDesign name="search1" size={24} color="white" />
  </Link>
);

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
