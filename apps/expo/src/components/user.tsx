import type { RouterOutputs } from "@/utils/api";
import type { FC } from "react";
import { Text, View } from "react-native";

import { Avatar } from "./avatar";

interface Props {
  user?: RouterOutputs["user"]["getOneById"]["user"];
}

export const UserProfile: FC<Props> = ({ user }) => (
  <View className="w-full gap-2 px-12 pt-4">
    <View className="w-full flex-row items-center justify-between gap-2">
      <Avatar src={user?.avatar ?? undefined} />
      <View className="flex-1"></View>
    </View>
    <View className="w-full">
      <UserNameAndSlug user={user} />
    </View>
  </View>
);

export const UserNameAndSlug: FC<Props> = ({ user }) => (
  <>
    <View className="h-7">
      <Text className="text-lg font-bold text-white" adjustsFontSizeToFit>
        {user?.name}
      </Text>
    </View>
    <View className="h-6">
      <Text className="text-white" adjustsFontSizeToFit>
        @{user?.slug}
      </Text>
    </View>
  </>
);
