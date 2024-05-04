import type { FC } from "react";
import { Pressable, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { PageView } from "@/components/layout";
import { PhotoList } from "@/components/photo";
import { UserProfile } from "@/components/user";
import { api } from "@/libs/trpc/api";
import { useAsyncCallback } from "react-async-hook";

const UserDetailPage: FC = () => {
  const { userId } = useLocalSearchParams<"/users/[userId]">();
  const { data: userData, refetch: refetchUserData } =
    api.user.getOneById.useQuery({ id: userId });
  const { data, fetchNextPage } =
    api.photo.getManyWithPaginationByUserId.useInfiniteQuery(
      {
        userId,
      },
      {
        getNextPageParam: (lastPage) => lastPage.pagination.cursor,
      },
    );
  const { data: isFollowing, refetch: refetchIsFollowing } =
    api.follow.isFollowing.useQuery({
      userId,
    });
  const { mutateAsync: follow } = api.follow.follow.useMutation();
  const { mutateAsync: unfollow } = api.follow.unfollow.useMutation();
  const { user } = api.useUtils();

  const { execute, loading } = useAsyncCallback(async () => {
    if (isFollowing) await unfollow({ userId });
    else await follow({ userId });
    await Promise.all([
      refetchIsFollowing(),
      refetchUserData(),
      user.getMine.refetch(),
    ]);
  });

  return (
    <PageView style={{ gap: 16 }}>
      <UserProfile user={userData?.user} />
      <View className="w-full items-center">
        <Pressable
          className="w-2/3 items-center justify-center rounded-xl bg-white py-3"
          onPress={execute}
          disabled={loading}
        >
          <Text className="text-lg font-bold text-black">
            {isFollowing ? "フォロー解除" : "フォロー"}
          </Text>
        </Pressable>
      </View>
      <PhotoList data={data} fetchNextPage={fetchNextPage} />
    </PageView>
  );
};

export default UserDetailPage;
