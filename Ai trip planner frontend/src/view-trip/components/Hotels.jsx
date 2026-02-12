import { Hotel as HotelIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import placeHolder from "../images/placeholder.jpg";
import { FaMapPin } from "react-icons/fa";
import MapComponent from "../../components/ui/MapComponent";
import { getUnsplashImages } from "../../services/UnsplashApi";

function Hotels({ trip }) {
  const [hotelPhotos, setHotelPhotos] = useState({}); // hotelName => photo URL
  const [hotelCoords, setHotelCoords] = useState({}); // hotelName => [lat, lng]

  // Geocode hotel location
  const geocodeHotel = async (hotelName, hotelAddress) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(hotelName + " " + hotelAddress)}&format=json&limit=1`,
      );
      const data = await response.json();
      if (data.length > 0) {
        const coords = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        setHotelCoords((prev) => ({ ...prev, [hotelName]: coords }));
      }
    } catch (error) {
      console.error("Error geocoding hotel:", error);
    }
  };

  // Open Google Maps with hotel location
  const openGoogleMaps = (hotelAddress) => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotelAddress)}`;
    window.open(mapsUrl, "_blank");
  };

  // Fetch photos when trip data changes
  useEffect(() => {
    const fetchAllHotelPhotos = async () => {
      if (!trip?.Tripdata?.hotelOptions) {
        console.log("No hotel options available");
        return;
      }

      const hotelNames = trip.Tripdata.hotelOptions.map((h) => h.hotelName);
      console.log("🏨 Fetching photos for hotels:", hotelNames);

      try {
        const photoMap = await getUnsplashImages(hotelNames, {
          type: "hotel",
          location: trip.userSelection?.location || "",
        });
        console.log("🖼️ Hotel photos map:", photoMap);
        setHotelPhotos(photoMap);
      } catch (error) {
        console.error("❌ Error fetching hotel photos:", error.message);
      }

      // Geocode all hotels
      for (const hotel of trip.Tripdata.hotelOptions) {
        geocodeHotel(hotel.hotelName, hotel.hotelAddress);
      }
    };

    fetchAllHotelPhotos();
  }, [trip]);

  return (
    <div>
      <h2 className="font-bold text-2xl mt-5">Hotel Recommendations</h2>

      {/* Hotel Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 my-5">
        {trip?.Tripdata?.hotelOptions?.map((hotel, index) => (
          <div
            key={index}
            onClick={() => openGoogleMaps(hotel.hotelAddress)}
            className="hover:scale-105 transition-all cursor-pointer block rounded-lg overflow-hidden shadow-md hover:shadow-lg bg-white"
          >
            <img
              src={hotelPhotos[hotel.hotelName] || placeHolder}
              alt={hotel.hotelName}
              className="w-full h-[200px] object-cover"
            />
            <div className="my-2 flex flex-col gap-2 p-2">
              <h3 className="font-medium">{hotel?.hotelName}</h3>
              <p className="text-xs text-gray-500">📍 {hotel?.hotelAddress}</p>
              <p className="text-sm">💰 {hotel?.price}</p>
              <p className="text-sm">⭐ {hotel?.rating} Stars</p>
            </div>
          </div>
        ))}
      </div>

      {/* Hotels Map */}
      {Object.keys(hotelCoords).length > 0 && (
        <div className="mt-8">
          <h3 className="font-bold text-xl mb-4">Hotels on Map</h3>
          <MapComponent
            center={Object.values(hotelCoords)[0] || [51.505, -0.09]}
            zoom={13}
            markers={
              trip?.Tripdata?.hotelOptions?.map((hotel) => ({
                position: hotelCoords[hotel.hotelName] || [0, 0],
                label: hotel.hotelName,
                description: hotel.hotelAddress,
              })) || []
            }
            height="350px"
          />
        </div>
      )}
    </div>
  );
}

export default Hotels;
