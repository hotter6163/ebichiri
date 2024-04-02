import type { FC } from "react";
import type { NativeSafeAreaViewProps } from "react-native-safe-area-context";
import { useEffect } from "react";
import { Dimensions, FlatList, Image, View } from "react-native";
import { PageView } from "@/components/layout";
import { api } from "@/utils/api";

const SAFE_AREA: NativeSafeAreaViewProps["edges"] = ["top", "right", "left"];

const Photo: FC = (props) => {
  const { data, fetchNextPage } =
    api.photo.getMineWithPagination.useInfiniteQuery(
      {
        limit: 3,
      },
      {
        getNextPageParam: (lastPage) => lastPage.pagination.cursor,
      },
    );

  useEffect(() => {
    console.log(props);
  }, [props]);

  useEffect(() => {
    data?.pages.forEach((page) => {
      console.log(
        page.items.length,
        page.items[0]?.createdAt,
        page.pagination.cursor,
      );
    });
    setTimeout(() => {
      void fetchNextPage();
    }, 2000);
  }, [data, fetchNextPage]);

  const photos = data?.pages.flatMap((page) => page.items) ?? [];
  const screenWidth = Dimensions.get("window").width;
  const photoSize = screenWidth / 3;

  return (
    <PageView safeArea={SAFE_AREA}>
      <FlatList
        data={photos}
        renderItem={({ item }) => (
          <View
            style={{ width: photoSize, height: photoSize }}
            className="p-[1px]"
          >
            <Image
              source={{ uri: item.src }}
              className="h-full w-full object-cover"
            />
          </View>
        )}
        numColumns={3}
      />
    </PageView>
  );
};

export default Photo;
