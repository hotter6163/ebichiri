import type { FC } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { PageView } from "@/components/layout";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const Settings: FC = () => {
  const supabase = useSupabaseClient();
  const router = useRouter();

  return (
    <PageView className="" safeArea>
      <View className="-mt-32 w-9/12 space-y-4">
        <Text className="mb-4 text-2xl font-bold text-zinc-200">設定</Text>
        <Pressable
          onPress={() =>
            supabase.auth.signOut().then(({ error }) => {
              if (error) return Alert.alert("エラー", error.message);
              router.push("/");
            })
          }
          className="flex-row items-center justify-center gap-2 rounded-lg bg-zinc-200 p-2"
        >
          <Text className="text-xl font-semibold text-zinc-900">Sign out</Text>
        </Pressable>
      </View>
    </PageView>
  );
};

export default Settings;
