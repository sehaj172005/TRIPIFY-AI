import React, { useEffect, useState } from "react";
import { FaClock, FaStar, FaTicketAlt, FaMapMarkerAlt } from "react-icons/fa";
import placeHolder from "../images/placeholder.jpg";
import { getUnsplashImages } from "../../services/UnsplashApi";
import { Compass } from "lucide-react";

function PlacesToVisit({ trip }) {
  const [placePhotos, setPlacePhotos] = useState({});

  useEffect(() => {
    const fetchPhotos = async () => {
      if (!trip?.Tripdata?.itinerary) return;
      const placeNames = [];
      for (const day of trip.Tripdata.itinerary) {
        for (const place of day.plan) {
          placeNames.push(place.placeName);
        }
      }
      try {
        const photoMap = await getUnsplashImages(placeNames, {
          type: "landmark",
          location: trip.userSelection?.location || "",
        });
        setPlacePhotos(photoMap);
      } catch (error) {
        console.error("❌ Error fetching place photos:", error.message);
      }
    };
    fetchPhotos();
  }, [trip]);

  const dayColors = [
    "from-sky-500 to-blue-600",
    "from-teal-500 to-green-600",
    "from-orange-500 to-amber-600",
    "from-purple-500 to-violet-600",
    "from-rose-500 to-pink-600",
    "from-indigo-500 to-blue-700",
    "from-emerald-500 to-teal-700",
  ];

  return (
    <div className="my-10 animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-teal-100 rounded-2xl flex items-center justify-center">
          <Compass className="w-5 h-5 text-teal-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Itinerary</h2>
          <p className="text-sm text-gray-400">Day-by-day places to explore</p>
        </div>
      </div>

      <div className="flex flex-col gap-12">
        {trip?.Tripdata?.itinerary?.map((day, dayIndex) => (
          <div key={dayIndex} className="animate-fade-up">
            {/* Day Header */}
            <div className="flex items-center gap-4 mb-5">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${dayColors[dayIndex % dayColors.length]} flex items-center justify-center shadow-lg shrink-0`}>
                <span className="text-white font-bold text-base">{dayIndex + 1}</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{day.day}</h3>
                <p className="text-sm text-gray-400">{day.plan?.length} places to visit</p>
              </div>
            </div>

            {/* Place Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {day.plan.map((place, placeIndex) => (
                <div
                  key={placeIndex}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm card-hover"
                >
                  <div className="relative overflow-hidden h-44">
                    <img
                      src={placePhotos[place.placeName] || place.placeImageUrl || placeHolder}
                      alt={place.placeName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute top-3 left-3 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-xs font-bold text-gray-700 shadow-md">
                      {placeIndex + 1}
                    </div>
                    {place.rating && (
                      <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold shadow-md">
                        <FaStar className="text-yellow-400 text-xs" />
                        {place.rating}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 text-sm mb-1 leading-snug">{place.placeName}</h4>
                    <p className="text-xs text-gray-400 leading-relaxed mb-3 line-clamp-2">{place.placeDetails}</p>
                    <div className="flex flex-wrap gap-2">
                      {place.bestTimeToVisit && (
                        <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-lg font-medium">
                          <FaClock className="text-[10px]" />{place.bestTimeToVisit}
                        </span>
                      )}
                      {place.ticketPricing && (
                        <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-600 px-2 py-1 rounded-lg font-medium">
                          <FaTicketAlt className="text-[10px]" />{place.ticketPricing}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlacesToVisit;
