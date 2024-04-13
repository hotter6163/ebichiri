import type { FC } from "react";
import { useLocalSearchParams } from "expo-router";
import { PageView } from "@/components/layout";
import { PhotoList } from "@/components/photo";
import { UserProfile } from "@/components/user";
import { api } from "@/utils/api";

interface SearchParams extends Record<string, string> {
  userId: string;
}

const UserDetailPage: FC = () => {
  const { userId } = useLocalSearchParams<SearchParams>();
  const { data: userData } = api.user.getOneById.useQuery({ id: userId });
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
      <UserProfile user={userData?.user} />
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
