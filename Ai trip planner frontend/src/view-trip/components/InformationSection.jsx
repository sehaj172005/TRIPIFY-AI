import React, { useEffect, useState } from "react";
import logo from "../images/placeholder.jpg";
import { IoShareSocial } from "react-icons/io5";
import { Button } from "../../components/ui/button";
import MapComponent from "../../components/ui/MapComponent";
import { getUnsplashImage } from "../../services/UnsplashApi";

function InformationSection({ trip }) {
  const [photoUrl, setPhotoUrl] = useState(logo);
  const [locationCoords, setLocationCoords] = useState([51.505, -0.09]);

  // Geocode location to get coordinates
  const geocodeLocation = async (locationName) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationName)}&format=json&limit=1`,
      );
      const data = await response.json();
      if (data.length > 0) {
        const coords = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        setLocationCoords(coords);
      }
    } catch (error) {
      console.error("Error geocoding location:", error);
    }
  };

  useEffect(() => {
    if (trip?.userSelection?.location) {
      GetPlacePhoto();
      geocodeLocation(trip.userSelection.location);
    }
  }, [trip]);

  const GetPlacePhoto = async () => {
    try {
      const imageUrl = await getUnsplashImage(trip.userSelection.location, {
        type: "landmark",
        location: trip.userSelection.location,
      });
      if (imageUrl) {
        setPhotoUrl(imageUrl);
        console.log("✅ Destination image loaded:", imageUrl);
      }
    } catch (error) {
      console.error("Error fetching destination image:", error.message);
    }
  };

  return (
    <div>
      <img
        src={photoUrl}
        alt=""
        className="h-[200px] md:h-[340px] w-full object-cover"
      />

      <div className="flex flex-col md:flex-row justify-between items-start  mt-5 gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="font-bold text-2xl">
            {trip?.userSelection?.location}
          </h2>

          <div className="flex flex-wrap gap-3">
            <h2 className="p-1 px-3 bg-gray-200 rounded-full text-sm md:text-base text-gray-500">
              ⌛ {trip?.userSelection?.NoofDays} Days
            </h2>
            <h2 className="p-1 px-3 bg-gray-200 rounded-full text-sm md:text-base text-gray-500">
              💰 {trip?.userSelection?.Budget} Budget
            </h2>
            <h2 className="p-1 px-3 bg-gray-200 rounded-full text-sm md:text-base text-gray-500">
              🥂 No. of Travelers: {trip?.userSelection?.traveler}
            </h2>
          </div>
        </div>

        <div className="self-end md:self-auto">
          <Button className="flex items-center gap-2">
            <IoShareSocial className="text-lg" />
            <span className="hidden sm:inline">Share</span>
          </Button>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-bold text-2xl mb-4">Location</h2>
        <MapComponent
          center={locationCoords}
          zoom={12}
          markers={[
            {
              position: locationCoords,
              label: trip?.userSelection?.location,
              description: "Your trip destination",
            },
          ]}
          height="350px"
        />
      </div>
    </div>
  );
}
export default InformationSection;
