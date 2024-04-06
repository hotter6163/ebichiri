import type { FC } from "react";
import { useState } from "react";
import { Dimensions } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { useForegroundPermissions } from "expo-location";
import { PermissionStatus } from "expo-modules-core";
import { useRouter } from "expo-router";
import { PageView } from "@/components/layout";
import { useLocation } from "@/libs/native/location";
import { api } from "@/utils/api";

const LONGITUDE_DELTA = 0.0421;

const DEFAULT_REGION = {
  latitude: 35.659800337727,
  longitude: 139.70238937731,
};

const MapPage: FC = () => {
  const { location } = useLocation();
  const [permission] = useForegroundPermissions();
  const router = useRouter();

  const latitudeDelta =
    (Dimensions.get("window").height / Dimensions.get("window").width) *
    LONGITUDE_DELTA *
    0.3;

  const initialRegion = {
    latitude: location?.coords.latitude ?? DEFAULT_REGION.latitude,
    longitude: location?.coords.longitude ?? DEFAULT_REGION.longitude,
    latitudeDelta,
    longitudeDelta: LONGITUDE_DELTA,
  };

  const [region, setRegion] = useState<Region>(initialRegion);
  const { data } = api.photo.getManyInRegion.useQuery({ region });

  return (
    <PageView>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ width: "100%", height: "100%" }}
        showsUserLocation={permission?.status === PermissionStatus.GRANTED}
        showsMyLocationButton={permission?.status === PermissionStatus.GRANTED}
        initialRegion={initialRegion}
        onRegionChangeComplete={setRegion}
      >
        {data?.map((photo) => (
          <Marker
            key={photo.id}
            coordinate={{
              latitude: photo.latitude,
              longitude: photo.longitude,
            }}
            onPress={() =>
              router.push({
                pathname: "/photos/[photoId]/",
                params: { photoId: photo.id },
              })
            }
          />
        ))}
      </MapView>
    </PageView>
  );
};

export default MapPage;
