import type { FC } from "react";
import { View } from "react-native";

interface DividerProps {
  color?: string;
}

export const Divider: FC<DividerProps> = ({ color = "#dddddd" }) => (
  <View style={{ borderTopColor: color, borderTopWidth: 1, width: "100%" }} />
);
