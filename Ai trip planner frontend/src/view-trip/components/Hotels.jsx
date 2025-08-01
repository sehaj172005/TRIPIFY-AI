import { Hotel as HotelIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import placeHolder from "../images/placeholder.jpg";
import { FaMapPin } from "react-icons/fa";
import { GetPlaceDetails } from "../../services/GloabalApi";

function Hotels({ trip }) {
  const [hotelPhotos, setHotelPhotos] = useState({}); // hotelName => photo URL
  const API_KEY = import.meta.env.VITE_APP_GOOGLE_PLACE_API_KEY

  // Fetch photos when trip data changes
  useEffect(() => {
    const fetchAllHotelPhotos = async () => {
      if (!trip?.Tripdata?.hotelOptions) return;

      const newPhotoMap = {};

      for (const hotel of trip.Tripdata.hotelOptions) {
        try {
          const data = { textQuery: hotel.hotelName };
          const result = await GetPlaceDetails(data);

          const rawPhotoRef = result?.data?.places?.[0]?.photos?.[0]?.name;

          if (rawPhotoRef) {
            const photoRef = rawPhotoRef.split("/").pop();
            const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoRef}&key=${API_KEY}`;
            newPhotoMap[hotel.hotelName] = photoUrl;
          }
        } catch (error) {
          console.error(`Error fetching image for ${hotel.hotelName}`, error.message);
        }
      }

      setHotelPhotos(newPhotoMap);
    };

    fetchAllHotelPhotos();
  }, [trip]);

  return (
    <div>
      <h2 className="font-bold text-2xl mt-5">Hotel Recommendations</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 my-5">
        {trip?.Tripdata?.hotelOptions?.map((hotel, index) => (
          <a
            key={index}
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              hotel.hotelName + "," + hotel.hotelAddress
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-105 transition-all cursor-pointer block"
          >
            <img
              src={hotelPhotos[hotel.hotelName] || placeHolder}
              alt={hotel.hotelName}
              className="w-full h-[200px] object-cover rounded-md"
            />
            <div className="my-2 flex flex-col gap-2">
              <h3 className="font-medium">{hotel?.hotelName}</h3>
              <p className="text-xs text-gray-500">📍 {hotel?.hotelAddress}</p>
              <p className="text-sm">💰 {hotel?.price}</p>
              <p className="text-sm">⭐ {hotel?.rating} Stars</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export default Hotels;
