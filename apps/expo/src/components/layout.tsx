import type { FC } from "react";
import type { ViewProps } from "react-native";
import { View } from "react-native";
import { BASE_COLOR } from "@/constants/colors";

export const PageView: FC<ViewProps> = ({ children, style, ...props }) => (
  <View style={[{ flex: 1, backgroundColor: BASE_COLOR }, style]} {...props}>
    {children}
  </View>
);
