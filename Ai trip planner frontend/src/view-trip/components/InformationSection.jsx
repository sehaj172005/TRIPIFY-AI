import React, { useEffect, useState } from "react";
import logo from "../images/placeholder.jpg";
import { IoShareSocial } from "react-icons/io5";
import { Button } from "../../components/ui/button";
import { GetPlaceDetails } from "../../services/GloabalApi";

function InformationSection({ trip }) {
  const [photoUrl , setPhotoUrl ] = useState();
  const API_KEY = import.meta.env.VITE_APP_GOOGLE_PLACE_API_KEY
 useEffect(() => {
  if (trip?.userSelection?.location) {
    GetPlacePhoto();
  }
}, [trip]);

const GetPlacePhoto = async () => {
  const data = {
    textQuery: trip.userSelection.location,
  };

  try {
    const result = await GetPlaceDetails(data);
    console.log(result.data);

    const rawPhotoRef = result.data.places?.[0]?.photos?.[0]?.name;
    if (!rawPhotoRef) {
      console.warn("No photo reference available.");
      return;
    }

    const photoReference = rawPhotoRef.split("/").pop(); // Extract last part
    const newPhotoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&maxheight=800&photo_reference=${photoReference}&key=${API_KEY}`;
    setPhotoUrl(newPhotoUrl)

    console.log("Photo URL:", photoUrl);
  } catch (error) {
    console.error(
      "Error fetching place details:",
      error.response?.data || error.message
    );
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
    </div>
  );
}
export default InformationSection;
