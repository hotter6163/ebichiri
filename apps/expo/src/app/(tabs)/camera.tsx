import type { LocationObject } from "expo-location";
import type { FC } from "react";
import type { NativeSafeAreaViewProps } from "react-native-safe-area-context";
import { useEffect, useRef, useState } from "react";
import { Button, Image, Linking, Pressable, Text, View } from "react-native";
import { Camera, CameraType, PermissionStatus } from "expo-camera";
import { saveToLibraryAsync, usePermissions } from "expo-media-library";
import { usePathname } from "expo-router";
import { PageView } from "@/components/layout";
import { PRIMARY_COLOR } from "@/constants/colors";
import { useCameraPermission } from "@/libs/native/camera";
import { useLocation } from "@/libs/native/location";
import Slider from "@react-native-community/slider";

const SAFE_AREA: NativeSafeAreaViewProps["edges"] = ["top", "right", "left"];

interface CaptureData {
  uri: string;
  location: LocationObject | null;
}

const CameraPage: FC = () => {
  const pathname = usePathname();
  const [permission] = Camera.useCameraPermissions();
  const [captureData, setCaptureData] = useState<CaptureData | null>(null);

  useCameraPermission();

  useEffect(() => {
    setCaptureData(null);
  }, [pathname]);

  if (!permission) {
    return <PageView safeArea={SAFE_AREA} />;
  }

  if (permission.status === PermissionStatus.DENIED) {
    return <DeniedView />;
  }

  return (
    <PageView safeArea={SAFE_AREA}>
      {pathname === "/camera" &&
        (captureData ? (
          <CapturedView data={captureData} clear={() => setCaptureData(null)} />
        ) : (
          <CameraView onCapture={setCaptureData} />
        ))}
    </PageView>
  );
};

export default CameraPage;

const DeniedView: FC = () => (
  <PageView safeArea={SAFE_AREA}>
    <Text className="text-center text-white">カメラの許可が必要です</Text>
    <Text className="text-center text-white">
      設定画面からカメラの許可を行ってください
    </Text>
    <Button title="端末の設定を開く" onPress={() => Linking.openSettings()} />
  </PageView>
);

const CONTROLLER_HEIGHT = 160;

const CameraView: FC<{
  onCapture: (data: CaptureData) => void;
}> = ({ onCapture }) => {
  const cameraRef = useRef<Camera>(null);
  const [zoom, setZoom] = useState(0);
  const { location } = useLocation();

  const capture = async () => {
    if (!cameraRef.current) return;

    const { uri } = await cameraRef.current.takePictureAsync();
    onCapture({ uri, location });
  };

  return (
    <>
      <Camera
        ref={cameraRef}
        style={{ width: "100%", flex: 1 }}
        type={CameraType.back}
        zoom={zoom}
      />
      <View
        className="w-full items-center justify-center gap-4"
        style={{ height: CONTROLLER_HEIGHT }}
      >
        <Slider
          style={{ width: "80%", height: 40 }}
          minimumValue={0}
          maximumValue={0.5}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor={PRIMARY_COLOR}
          onValueChange={setZoom}
        />
        <Pressable
          onPress={capture}
          className="h-20 w-20 rounded-full bg-white p-1"
        >
          <View className="flex-1 rounded-full border-4 border-black bg-white" />
        </Pressable>
      </View>
    </>
  );
};

const CapturedView: FC<{ data: CaptureData; clear: () => void }> = ({
  data: { uri, location },
  clear,
}) => {
  const [permission] = usePermissions();

  const onSave = async () => {
    if (permission?.status === PermissionStatus.GRANTED)
      await saveToLibraryAsync(uri);
    clear();
  };

  return (
    <>
      <Image
        className="w-full flex-1"
        source={{ uri }}
        style={{ resizeMode: "contain" }}
      />
      <View className="w-full flex-row-reverse items-center justify-between px-4 pb-8">
        <Pressable className="px-6 py-3" onPress={onSave}>
          <Text className="text-center text-2xl text-white">保存</Text>
        </Pressable>
        <Pressable className="px-6 py-3" onPress={clear}>
          <Text className="text-center text-2xl text-white">再撮影</Text>
        </Pressable>
      </View>
    </>
  );
};
