import type { RouterOutputs } from "@/libs/trpc/api";
import type { FC } from "react";
import { Text, View } from "react-native";

import { Avatar } from "./avatar";

interface Props {
  user?: NonNullable<RouterOutputs["user"]["getOneById"]>["user"] | null;
}

export const UserProfile: FC<Props> = ({ user }) => (
  <View className="w-full gap-2 pt-4">
    <View className="w-full flex-row items-center justify-between gap-8 pl-12 pr-4">
      <Avatar src={user?.avatar ?? undefined} />
      <View className=", flex-1 flex-row justify-center gap-4">
        <View>
          <Text className="text-white">フォロー数</Text>
          <Text className="text-center text-xl font-bold text-white">
            {user?.followingsCount}
          </Text>
        </View>
        <View>
          <Text className="text-white">フォロワー数</Text>
          <Text className="text-center text-xl font-bold text-white">
            {user?.followersCount}
          </Text>
        </View>
      </View>
    </View>
    <View className="w-full px-12">
      <UserNameAndSlug user={user} />
    </View>
  </View>
);

export const UserNameAndSlug: FC<Props> = ({ user }) => (
  <>
    <View className="h-7">
      <Text className="text-xl font-bold text-white" adjustsFontSizeToFit>
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
