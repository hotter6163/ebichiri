import type { api } from "@/utils/api";
import type { FC } from "react";
import { Dimensions, FlatList, Image, Pressable } from "react-native";
import { useRouter } from "expo-router";

type PhotoPaginationQueryResult = ReturnType<
  typeof api.photo.getMineWithPagination.useInfiniteQuery
>;

interface PhotoListProps {
  data: PhotoPaginationQueryResult["data"];
  fetchNextPage: PhotoPaginationQueryResult["fetchNextPage"];
}

export const PhotoList: FC<PhotoListProps> = ({ data }) => {
  const router = useRouter();

  const photos = data?.pages.flatMap((page) => page.items) ?? [];
  const photoSize = Dimensions.get("window").width / 3;

  return (
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
  );
};
