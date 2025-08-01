import React, { useRef, useEffect } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

const libraries = ['places'];

const LocationSearch = ({ onPlaceSelect }) => {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null); // store autocomplete instance
const API_KEY = import.meta.env.VITE_APP_GOOGLE_PLACE_API_KEY
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: API_KEY, // 🔐 Replace with env variable in prod
    libraries,
  });

  useEffect(() => {
    if (isLoaded && inputRef.current) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current);

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current.getPlace();
        if (place && place.formatted_address) {
          onPlaceSelect("location" , place);
        }
      });
    }
  }, [isLoaded]);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <input
      type="text"
      placeholder="Search location"
      ref={inputRef}
      className="w-full p-2 border rounded"
    />
  );
};

export default LocationSearch;

