import type { FC } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { PageView } from "@/components/layout";
import { PhotoList } from "@/components/photo";
import { PRIMARY_COLOR } from "@/constants/colors";
import { api } from "@/utils/api";
import { Feather } from "@expo/vector-icons";

const ProfilePage: FC = () => {
  const { data: user } = api.user.getMine.useQuery();
  const { data, fetchNextPage } =
    api.photo.getMineWithPagination.useInfiniteQuery(
      {
        limit: 30,
      },
      {
        getNextPageParam: (lastPage) => lastPage.pagination.cursor,
      },
    );

  return (
    <PageView safeArea={["top", "left", "right"]} style={{ gap: 16 }}>
      <View className="w-full gap-2 px-12 pt-4">
        <View className="w-full flex-row items-center justify-between gap-2">
          <View
            className="items-center justify-center overflow-hidden rounded-full bg-white"
            style={{ width: 80, height: 80 }}
          >
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} className="h-full w-full" />
            ) : (
              <Feather name="user" size={72} color={PRIMARY_COLOR} />
            )}
          </View>
          <View className="flex-1"></View>
        </View>
        <View className="w-full">
          <View className="h-7">
            <Text className="text-lg font-bold text-white" adjustsFontSizeToFit>
              {user?.name ?? "匿名のユーザー"}
            </Text>
          </View>
          <View className="h-6">
            <Text className="text-white" adjustsFontSizeToFit>
              @{user?.slug}
            </Text>
          </View>
        </View>
      </View>
      <View className="w-full items-center">
        <Pressable className="items-center justify-center rounded-xl bg-white px-12 py-3">
          <Text className="text-lg font-bold text-black">
            プロフィールを編集
          </Text>
        </Pressable>
      </View>
      <PhotoList data={data} fetchNextPage={fetchNextPage} />
    </PageView>
  );
};

export default ProfilePage;
