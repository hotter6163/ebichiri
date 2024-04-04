import type { FC } from "react";
import { Dimensions } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { useForegroundPermissions } from "expo-location";
import { PermissionStatus } from "expo-modules-core";
import { PageView } from "@/components/layout";
import { useLocation } from "@/libs/native/location";

const LONGITUDE_DELTA = 0.0421;

const DEFAULT_REGION = {
  latitude: 35.659800337727,
  longitude: 139.70238937731,
};

const Map: FC = () => {
  const { location } = useLocation();
  const [permission] = useForegroundPermissions();

  const latitudeDelta =
    (Dimensions.get("window").height / Dimensions.get("window").width) *
    LONGITUDE_DELTA *
    0.3;

  return (
    <PageView>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ width: "100%", height: "100%" }}
        showsUserLocation={permission?.status === PermissionStatus.GRANTED}
        showsMyLocationButton={permission?.status === PermissionStatus.GRANTED}
        initialRegion={{
          latitude: location?.coords.latitude ?? DEFAULT_REGION.latitude,
          longitude: location?.coords.longitude ?? DEFAULT_REGION.longitude,
          latitudeDelta,
          longitudeDelta: LONGITUDE_DELTA,
        }}
        onRegionChangeComplete={console.log}
      ></MapView>
    </PageView>
  );
};

export default Map;
