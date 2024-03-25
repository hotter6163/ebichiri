import type { FC } from "react";
import type { NativeSafeAreaViewProps } from "react-native-safe-area-context";
import { useEffect, useRef, useState } from "react";
import { Button, Image, Linking, Pressable, Text, View } from "react-native";
import { Camera, CameraType, PermissionStatus } from "expo-camera";
import { usePathname } from "expo-router";
import { PageView } from "@/components/layout";
import { PRIMARY_COLOR } from "@/constants/colors";
import { useCameraPermission } from "@/hooks/permission";
import Slider from "@react-native-community/slider";

const SAFE_AREA: NativeSafeAreaViewProps["edges"] = ["top", "right", "left"];

const CameraPage: FC = () => {
  const pathname = usePathname();
  const [permission] = Camera.useCameraPermissions();
  const [capturedUri, setCapturedUri] = useState<string | null>(null);

  useCameraPermission();

  useEffect(() => {
    setCapturedUri(
      "file:///var/mobile/Containers/Data/Application/C7FABAF7-F1B2-49C4-B2D0-922F9AB9D71E/Library/Caches/ExponentExperienceData/@anonymous/expo-c6ed387e-41fa-4c3d-9ce0-ad86f5482e73/Camera/075B2EDB-D9A7-4142-988A-9BEAC165DB58.jpg",
    );
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
        (capturedUri ? (
          <CapturedView uri={capturedUri} clear={() => setCapturedUri(null)} />
        ) : (
          <CameraView onCapture={setCapturedUri} />
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

const CameraView: FC<{ onCapture: (url: string) => void }> = ({
  onCapture,
}) => {
  const cameraRef = useRef<Camera>(null);
  const [zoom, setZoom] = useState(0);

  const capture = async () => {
    if (!cameraRef.current) return;

    const { uri } = await cameraRef.current.takePictureAsync();
    console.log(uri);
    onCapture(uri);
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

const CapturedView: FC<{ uri: string; clear: () => void }> = ({
  uri,
  clear,
}) => {
  const onSave = () => {
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
