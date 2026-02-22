import React, { useEffect, useState } from "react";
import placeHolder from "../images/placeholder.jpg";
import { getUnsplashImages } from "../../services/UnsplashApi";
import { Hotel as HotelIcon, Star, MapPin, DollarSign, ExternalLink } from "lucide-react";

function Hotels({ trip }) {
  const [hotelPhotos, setHotelPhotos] = useState({});

  const openGoogleMaps = (hotelName, hotelAddress) => {
    const query = `${hotelName} ${hotelAddress}`;
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    window.open(mapsUrl, "_blank");
  };

  useEffect(() => {
    const fetchAllHotelPhotos = async () => {
      if (!trip?.Tripdata?.hotelOptions) return;
      const hotelNames = trip.Tripdata.hotelOptions.map((h) => h.hotelName);
      try {
        const photoMap = await getUnsplashImages(hotelNames, {
          type: "hotel",
          location: trip.userSelection?.location || "",
        });
        setHotelPhotos(photoMap);
      } catch (error) {
        console.error("❌ Error fetching hotel photos:", error.message);
      }
    };
    fetchAllHotelPhotos();
  }, [trip]);

  return (
    <div className="my-10 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-sky-100 rounded-2xl flex items-center justify-center">
          <HotelIcon className="w-5 h-5 text-sky-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Hotel Recommendations</h2>
          <p className="text-sm text-gray-400">Click any card to view on Google Maps</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {trip?.Tripdata?.hotelOptions?.map((hotel, index) => (
          <div
            key={index}
            onClick={() => openGoogleMaps(hotel.hotelName, hotel.hotelAddress)}
            className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm card-hover cursor-pointer"
          >
            <div className="relative overflow-hidden h-52">
              <img
                src={hotelPhotos[hotel.hotelName] || placeHolder}
                alt={hotel.hotelName}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                <span className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-medium px-3 py-1.5 rounded-full shadow-md">
                  <ExternalLink className="w-3 h-3" />
                  View on Maps
                </span>
              </div>
              {hotel?.rating && (
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1.5 rounded-full flex items-center gap-1 text-xs font-semibold shadow-md">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  {hotel.rating}
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1 line-clamp-1">{hotel?.hotelName}</h3>
              <p className="text-xs text-gray-400 flex items-start gap-1 mb-3 line-clamp-2">
                <MapPin className="w-3 h-3 mt-0.5 shrink-0 text-gray-300" />
                {hotel?.hotelAddress}
              </p>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-sky-600">
                  <DollarSign className="w-4 h-4" />
                  {hotel?.price}
                </span>
                <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">per night</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Hotels;
