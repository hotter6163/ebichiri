import type { FC } from "react";
import type { ViewProps } from "react-native";
import type { NativeSafeAreaViewProps } from "react-native-safe-area-context";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BASE_COLOR } from "@/constants/colors";

interface PageViewProps extends ViewProps {
  safeArea?: boolean | NativeSafeAreaViewProps["edges"];
}

export const PageView: FC<PageViewProps> = ({
  children,
  style,
  safeArea = false,
  ...props
}) => {
  const allProps: ViewProps = {
    style: [
      {
        flex: 1,
        backgroundColor: BASE_COLOR,
        justifyContent: "center",
        alignItems: "center",
      },
      style,
    ],
    ...props,
  };

  return safeArea !== false ? (
    <SafeAreaView
      {...allProps}
      edges={safeArea === true ? undefined : safeArea}
    >
      {children}
    </SafeAreaView>
  ) : (
    <View {...allProps}>{children}</View>
  );
};
