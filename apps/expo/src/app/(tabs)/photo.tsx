import type { FC } from "react";
import type { NativeSafeAreaViewProps } from "react-native-safe-area-context";
import { PageView } from "@/components/layout";
import { PhotoList } from "@/components/photo";
import { api } from "@/libs/trpc/api";

const SAFE_AREA: NativeSafeAreaViewProps["edges"] = ["top", "right", "left"];

const PhotoPage: FC = () => {
  const { data, fetchNextPage } =
    api.photo.getMineWithPagination.useInfiniteQuery(
      {},
      {
        getNextPageParam: (lastPage) => lastPage.pagination.cursor,
      },
    );

  return (
    <PageView safeArea={SAFE_AREA}>
      <PhotoList data={data} fetchNextPage={fetchNextPage} />
    </PageView>
  );
};

export default PhotoPage;
