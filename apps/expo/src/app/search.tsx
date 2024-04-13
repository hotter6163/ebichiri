import type { FC } from "react";
import { useState } from "react";
import { FlatList, TextInput, View } from "react-native";
import { Link } from "expo-router";
import { Avatar } from "@/components/avatar";
import { Divider } from "@/components/divider";
import { PageView } from "@/components/layout";
import { UserNameAndSlug } from "@/components/user";
import { api } from "@/utils/api";
import { AntDesign } from "@expo/vector-icons";

const SearchPage: FC = () => {
  const [searchText, setSearchText] = useState("");
  const { data } = api.user.search.useQuery({
    searchText,
  });

  return (
    <PageView safeArea={["bottom"]} style={{ justifyContent: "flex-start" }}>
      <View className="w-full flex-row items-center gap-4 px-10 py-4">
        <AntDesign name="search1" size={24} color="white" />
        <TextInput
          autoCapitalize="none"
          className="flex-1 rounded-md bg-white p-3"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      <FlatList
        data={data ?? []}
        className="w-full px-4"
        renderItem={({ item }) => (
          <Link href={`/users/${item.id}`}>
            <View className="w-full flex-row items-center gap-4 p-4">
              <Avatar src={item.avatar ?? undefined} size={60} />
              <View>
                <UserNameAndSlug user={item} />
              </View>
            </View>
          </Link>
        )}
        ItemSeparatorComponent={() => <Divider />}
      />
    </PageView>
  );
};

export default SearchPage;
