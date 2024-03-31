import type { LocationObject, LocationSubscription } from "expo-location";
import type { FC, ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import {
  Accuracy,
  useForegroundPermissions,
  watchPositionAsync,
} from "expo-location";
import { PermissionStatus } from "expo-modules-core";

interface Context {
  location: LocationObject | null;
}

export const LocationContext = createContext<Context>({ location: null });

export const useLocation = () => useContext(LocationContext);

interface Props {
  children: ReactNode;
}

export const LocationProvider: FC<Props> = ({ children }) => {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [subscriber, setSubscriber] = useState<LocationSubscription | null>(
    null,
  );
  const [permission] = useForegroundPermissions();

  useEffect(() => {
    if (permission?.status !== PermissionStatus.GRANTED) return;

    void watchPositionAsync(
      {
        accuracy: Accuracy.High,
        timeInterval: 1000,
        distanceInterval: 10,
      },
      setLocation,
    ).then(setSubscriber);
  }, [permission]);

  useEffect(() => {
    if (subscriber) return () => subscriber.remove();
  }, [subscriber]);

  return (
    <LocationContext.Provider value={{ location }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationPermission = () => {
  const [permission, requestPermission] = useForegroundPermissions();

  useEffect(() => {
    if (permission?.status === PermissionStatus.UNDETERMINED)
      void requestPermission();
  }, [permission, requestPermission]);
};
