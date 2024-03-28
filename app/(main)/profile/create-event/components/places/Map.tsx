"use client";
import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";

export default function Map({ lat, lng }: { lat: number; lng: number }) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
  });

  const containerStyle = {
    width: "300px",
    height: "300px",
    borderRadius: "1rem",
    margin: "1rem auto",
  };

  return (
    <div className="w-full">
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={{ lat, lng }}
          zoom={13}
        >
          <MarkerF position={{ lat, lng }} />
        </GoogleMap>
      )}
    </div>
  );
}
