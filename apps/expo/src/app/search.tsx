import type { FC } from "react";
import { useEffect } from "react";
import { api } from "@/utils/api";

const SearchPage: FC = () => {
  const { data } = api.user.search.useQuery({
    searchText: "test",
  });

  useEffect(() => {
    console.log(data);
  }, [data]);

  return null;
};

export default SearchPage;
