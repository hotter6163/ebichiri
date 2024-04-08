import type { FC } from "react";
import { Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Avatar } from "@/components/avatar";
import { PageView } from "@/components/layout";
import { PhotoList } from "@/components/photo";
import { api } from "@/utils/api";

interface SearchParams extends Record<string, string> {
  userId: string;
}

const UserDetailPage: FC = () => {
  const { userId } = useLocalSearchParams<SearchParams>();
  const { data: user } = api.user.getOneById.useQuery({ id: userId });
  const { data, fetchNextPage } =
    api.photo.getManyWithPaginationByUserId.useInfiniteQuery(
      {
        userId,
      },
      {
        getNextPageParam: (lastPage) => lastPage.pagination.cursor,
      },
    );

  return (
    <PageView style={{ gap: 16 }}>
      <View className="w-full gap-2 px-12 pt-4">
        <View className="w-full flex-row items-center justify-between gap-2">
          <Avatar src={user?.avatar ?? undefined} />
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
      {/* <View className="w-full items-center">
        <Pressable
          className="items-center justify-center rounded-xl bg-white px-12 py-3"
          onPress={() => router.push("/profile/edit")}
        >
          <Text className="text-lg font-bold text-black">
            プロフィールを編集
          </Text>
        </Pressable>
      </View> */}
      <PhotoList data={data} fetchNextPage={fetchNextPage} />
    </PageView>
  );
};

export default UserDetailPage;
