import type {
  AddressType,
  GeocodeResult,
} from "@googlemaps/google-maps-services-js";
import { Language, PlaceType2 } from "@googlemaps/google-maps-services-js";

export const getReverseGeocoding = ({
  location: { longitude, latitude },
  result_type = [PlaceType2.administrative_area_level_1, PlaceType2.political],
}: {
  location: {
    longitude: number;
    latitude: number;
  };
  result_type?: AddressType[];
}) => {
  const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
  url.searchParams.append("latlng", `${latitude},${longitude}`);
  url.searchParams.append("key", process.env.GEOCODING_API_KEY!);
  url.searchParams.append("language", Language.ja);
  url.searchParams.append("result_type", result_type.join("|"));
  return fetch(url.toString()).then(
    (res) => res.json() as Promise<{ results: GeocodeResult[] }>,
  );
};
