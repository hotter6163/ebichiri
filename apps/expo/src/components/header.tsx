import type { FC } from "react";
import { Text, View } from "react-native";
import { PRIMARY_COLOR } from "@/constants/colors";

export const StackHeader: FC = () => (
  <View className="pl-4">
    <Text
      className="text-4xl font-extrabold tracking-wider"
      style={{ color: PRIMARY_COLOR }}
    >
      EBICHIRI
    </Text>
  </View>
);
