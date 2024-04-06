import type { FC } from "react";
import type { NativeSafeAreaViewProps } from "react-native-safe-area-context";
import { Dimensions, FlatList, Image, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { PageView } from "@/components/layout";
import { api } from "@/utils/api";

const SAFE_AREA: NativeSafeAreaViewProps["edges"] = ["top", "right", "left"];

const PhotoPage: FC = () => {
  const router = useRouter();
  const { data } = api.photo.getMineWithPagination.useInfiniteQuery(
    {
      limit: 30,
    },
    {
      getNextPageParam: (lastPage) => lastPage.pagination.cursor,
    },
  );

  const photos = data?.pages.flatMap((page) => page.items) ?? [];
  const photoSize = Dimensions.get("window").width / 3;

  return (
    <PageView safeArea={SAFE_AREA}>
      <FlatList
        data={photos}
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/photos/[photoId]/",
                params: { photoId: item.id },
              })
            }
            style={{ width: photoSize, height: photoSize }}
            className="p-[1px]"
          >
            <Image source={{ uri: item.src }} className="h-full w-full" />
          </Pressable>
        )}
        numColumns={3}
      />
    </PageView>
  );
};

export default PhotoPage;
