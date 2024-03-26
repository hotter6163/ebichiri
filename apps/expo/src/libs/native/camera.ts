import { useEffect } from "react";
import { Camera } from "expo-camera";
import { PermissionStatus } from "expo-modules-core";

export const useCameraPermission = () => {
  const [permission, requestPermission] = Camera.useCameraPermissions();

  useEffect(() => {
    if (permission?.status === PermissionStatus.UNDETERMINED)
      void requestPermission();
  }, [permission, requestPermission]);
};
