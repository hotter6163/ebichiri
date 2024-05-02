import type { FC } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { Avatar } from "@/components/avatar";
import { Divider } from "@/components/divider";
import { PageView } from "@/components/layout";
import { PRIMARY_COLOR } from "@/constants/colors";
import { api } from "@/libs/trpc/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAsyncCallback } from "react-async-hook";
import { Controller, useForm } from "react-hook-form";

import type { ProfileEditData } from "@ebichiri/schema";
import { ProfileEditSchema } from "@ebichiri/schema";

const ProfileEditPage: FC = () => {
  const router = useRouter();
  const { data } = api.user.getMine.useQuery();
  const form = useForm<ProfileEditData>({
    resolver: zodResolver(ProfileEditSchema),
    defaultValues: {
      name: data?.name,
      slug: data?.slug,
      avatar: data?.avatar,
      avatarBase64: undefined,
    },
  });
  const avatar = form.watch("avatar");
  const { mutateAsync } = api.user.update.useMutation();
  const { user } = api.useUtils();

  const { execute, loading } = useAsyncCallback(
    form.handleSubmit(async (values: ProfileEditData) => {
      await mutateAsync(values);
      await user.getMine.refetch();
      if (router.canGoBack()) router.back();
      else router.push("/(tabs)/profile");
    }),
  );

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });
    const asset = result.assets?.[0];
    if (!asset) return;

    form.setValue("avatar", asset.uri);
    form.setValue("avatarBase64", asset.base64 ?? undefined);
  };

  return (
    <PageView
      style={{ justifyContent: "flex-start" }}
      className="justify-start gap-6 px-4"
    >
      <View className="flex-row items-center gap-8">
        <Avatar src={avatar ?? undefined} size={80} />
        <Pressable
          className="rounded-lg px-6 py-3"
          style={{
            backgroundColor: PRIMARY_COLOR,
          }}
          onPress={pickAvatar}
        >
          <Text className="text-lg font-bold text-white">画像を選択</Text>
        </Pressable>
      </View>
      <Divider />
      <View className="flex-row items-center px-4">
        <View className="w-1/3">
          <Text className="text-lg font-bold text-white">ユーザーID</Text>
        </View>
        <Controller
          control={form.control}
          name="slug"
          render={({ field }) => (
            <TextInput
              autoCapitalize="none"
              {...field}
              onChangeText={(text) => field.onChange(text)}
              className="flex-1 rounded-md bg-white p-3"
            />
          )}
        />
      </View>
      <Divider />
      <View className="flex-row items-center px-4">
        <View className="w-1/3">
          <Text className="text-lg font-bold text-white">名前</Text>
        </View>
        <Controller
          control={form.control}
          name="name"
          render={({ field }) => (
            <TextInput
              autoCapitalize="none"
              {...field}
              onChangeText={(text) => field.onChange(text)}
              className="flex-1 rounded-md bg-white p-3"
            />
          )}
        />
      </View>
      <View className="w-full items-center">
        <Pressable
          className="w-2/3 rounded-lg py-3"
          style={{
            backgroundColor: PRIMARY_COLOR,
          }}
          onPress={execute}
          disabled={loading}
        >
          <Text className="text-center text-lg font-bold text-white">保存</Text>
        </Pressable>
      </View>
    </PageView>
  );
};

export default ProfileEditPage;
