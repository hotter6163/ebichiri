import type { FC } from "react";
import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { PageView } from "@/components/layout";
import { PhotoList } from "@/components/photo";
import { UserProfile } from "@/components/user";
import { api } from "@/utils/api";

const ProfilePage: FC = () => {
  const router = useRouter();
  const { data: user } = api.user.getMine.useQuery();
  const { data, fetchNextPage } =
    api.photo.getMineWithPagination.useInfiniteQuery(
      {},
      {
        getNextPageParam: (lastPage) => lastPage.pagination.cursor,
      },
    );

  return (
    <PageView safeArea={["top", "left", "right"]} style={{ gap: 16 }}>
      <UserProfile user={user} />
      <View className="w-full items-center">
        <Pressable
          className="items-center justify-center rounded-xl bg-white px-12 py-3"
          onPress={() => router.push("/profile/edit")}
        >
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
