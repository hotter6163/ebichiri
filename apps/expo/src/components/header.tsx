import type { FC, ReactNode } from "react";
import { Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export const HeaderBackButton = () => {
  const router = useRouter();
  return (
    <TouchableOpacity onPress={() => router.back()}>
      <Ionicons name="arrow-back" size={32} color="#E4E4E7" />
    </TouchableOpacity>
  );
};

export const HeaderTitle: FC<{ children: ReactNode }> = (props) => (
  <Text className="text-3xl font-semibold text-zinc-200">{props.children}</Text>
);
