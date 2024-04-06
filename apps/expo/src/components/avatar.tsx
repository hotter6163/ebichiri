import type { FC } from "react";
import { Image, View } from "react-native";
import { PRIMARY_COLOR } from "@/constants/colors";
import { Feather } from "@expo/vector-icons";

interface AvatarProps {
  src?: string;
  size?: number;
}

export const Avatar: FC<AvatarProps> = ({ src, size = 80 }) => (
  <View
    className="items-center justify-center overflow-hidden rounded-full bg-white"
    style={{ width: size, height: size }}
  >
    {src ? (
      <Image source={{ uri: src }} className="h-full w-full" />
    ) : (
      <Feather name="user" size={size * 0.9} color={PRIMARY_COLOR} />
    )}
  </View>
);
