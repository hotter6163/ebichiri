import { useEffect } from "react";
import { Camera, PermissionStatus } from "expo-camera";

export const useCameraPermission = () => {
  const [permission, requestPermission] = Camera.useCameraPermissions();

  useEffect(() => {
    if (permission?.status === PermissionStatus.UNDETERMINED)
      void requestPermission();
  }, [permission, requestPermission]);
};
