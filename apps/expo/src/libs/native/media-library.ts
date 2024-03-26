import { useEffect } from "react";
import { usePermissions } from "expo-media-library";
import { PermissionStatus } from "expo-modules-core";

export const useMediaLibraryPermission = () => {
  const [permission, requestPermission] = usePermissions();

  useEffect(() => {
    if (permission?.status === PermissionStatus.UNDETERMINED)
      void requestPermission();
  }, [permission, requestPermission]);
};
