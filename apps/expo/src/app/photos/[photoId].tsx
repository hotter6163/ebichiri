import type { FC } from "react";
import { Dimensions, Image, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Link, useLocalSearchParams } from "expo-router";
import { PageView } from "@/components/layout";
import { api } from "@/utils/api";
import dayjs from "dayjs";

interface SearchParams extends Record<string, string> {
  photoId: string;
}

const LONGITUDE_DELTA = 0.0421;

const PhotoDetailPage: FC = () => {
  const { photoId } = useLocalSearchParams<SearchParams>();
  const { data } = api.photo.getOne.useQuery({ id: photoId });

  if (!data) {
    return <PageView />;
  }

  const latitudeDelta =
    ((Dimensions.get("window").height / Dimensions.get("window").width) *
      LONGITUDE_DELTA *
      0.3) /
    0.8;

  return (
    <PageView safeArea={["bottom"]} style={{ justifyContent: "flex-start" }}>
      <Image
        source={{ uri: data.photos.src }}
        className="w-full flex-1"
        style={{ resizeMode: "contain" }}
      />
      <View className="p-4">
        <Link href={`/users/${data.users.id}`}>
          <Text className="text-left text-white">{data.users.name}</Text>
        </Link>
        <Text className="text-left text-white">
          {dayjs(data.photos.createdAt).format("YYYY/MM/DD HH:mm")}
        </Text>
        <Text className="text-left text-white">{data.photos.area}</Text>
      </View>
      <View className="w-full flex-1 items-center justify-center">
        <MapView
          provider={PROVIDER_GOOGLE}
          style={{ width: "80%", height: "60%" }}
          initialRegion={{
            latitude: data.photos.location!.latitude,
            longitude: data.photos.location!.longitude,
            latitudeDelta,
            longitudeDelta: LONGITUDE_DELTA,
          }}
        >
          <Marker
            coordinate={{
              latitude: data.photos.location!.latitude,
              longitude: data.photos.location!.longitude,
            }}
          />
        </MapView>
      </View>
    </PageView>
  );
};

export default PhotoDetailPage;
