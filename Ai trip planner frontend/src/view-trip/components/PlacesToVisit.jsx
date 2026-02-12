import React, { useEffect, useState } from "react";
import { FaClock, FaStar, FaTicketAlt, FaMapMarkerAlt } from "react-icons/fa";
import placeHolder from "../images/placeholder.jpg";
import MapComponent from "../../components/ui/MapComponent";
import { getUnsplashImages } from "../../services/UnsplashApi";

function PlacesToVisit({ trip }) {
  const [placePhotos, setPlacePhotos] = useState({}); // placeName => photoURL
  const [placeCoords, setPlaceCoords] = useState({}); // placeName => [lat, lng]

  // Geocode place to get coordinates
  const geocodePlace = async (placeName) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(placeName)}&format=json&limit=1`,
      );
      const data = await response.json();
      if (data.length > 0) {
        const coords = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        setPlaceCoords((prev) => ({ ...prev, [placeName]: coords }));
      }
    } catch (error) {
      console.error("Error geocoding place:", error);
    }
  };

  useEffect(() => {
    const fetchPhotos = async () => {
      if (!trip?.Tripdata?.itinerary) {
        console.log("No itinerary available");
        return;
      }

      const placeNames = [];
      for (const day of trip.Tripdata.itinerary) {
        for (const place of day.plan) {
          placeNames.push(place.placeName);
          geocodePlace(place.placeName);
        }
      }

      console.log("🎯 Fetching photos for places:", placeNames);

      try {
        const photoMap = await getUnsplashImages(placeNames, {
          type: "landmark",
          location: trip.userSelection?.location || "",
        });
        console.log("🖼️ Place photos map:", photoMap);
        setPlacePhotos(photoMap);
      } catch (error) {
        console.error("❌ Error fetching place photos:", error.message);
      }
    };

    fetchPhotos();
  }, [trip]);

  return (
    <div className="my-8">
      <h2 className="font-bold text-2xl">Places to Visit</h2>

      <div className="flex flex-col gap-8 mt-6">
        {trip?.Tripdata?.itinerary?.map((day, dayIndex) => (
          <div key={dayIndex}>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              {day.day}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {day.plan.map((place, placeIndex) => (
                <div
                  key={placeIndex}
                  className="rounded-xl overflow-hidden border shadow hover:scale-105 transition-all bg-white"
                >
                  <img
                    src={
                      placePhotos[place.placeName] ||
                      place.placeImageUrl ||
                      placeHolder
                    }
                    alt={place.placeName}
                    className="w-full h-48 object-cover"
                  />

                  <div className="p-4 flex flex-col gap-2">
                    <h4 className="font-bold text-lg">{place.placeName}</h4>
                    <p className="text-sm text-gray-600">
                      {place.placeDetails}
                    </p>

                    <div className="flex flex-col gap-x-4 gap-y-1 text-sm text-gray-600 mt-2">
                      {place.bestTimeToVisit && (
                        <span className="flex items-center gap-1">
                          <FaClock className="text-gray-400" />
                          {place.bestTimeToVisit}
                        </span>
                      )}

                      {place.ticketPricing && (
                        <span className="flex items-center gap-1">
                          <FaTicketAlt className="text-gray-400" />
                          {place.ticketPricing}
                        </span>
                      )}

                      {place.rating && (
                        <span className="flex items-center gap-1">
                          <FaStar className="text-yellow-500" />
                          {place.rating}
                        </span>
                      )}

                      {place.geoCoordinates?.latitude &&
                        place.geoCoordinates?.longitude && (
                          <span className="flex items-center gap-1">
                            <FaMapMarkerAlt className="text-red-500" />
                            <span className="text-xs">
                              {place.geoCoordinates.latitude.toFixed(4)},{" "}
                              {place.geoCoordinates.longitude.toFixed(4)}
                            </span>
                          </span>
                        )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Map for this day's places */}
              {day.plan.some((place) => placeCoords[place.placeName]) && (
                <div className="col-span-1 sm:col-span-2 lg:col-span-3 mt-4">
                  <MapComponent
                    center={
                      placeCoords[day.plan[0]?.placeName] || [51.505, -0.09]
                    }
                    zoom={13}
                    markers={day.plan.map((place) => ({
                      position: placeCoords[place.placeName] || [0, 0],
                      label: place.placeName,
                      description: place.placeDetails,
                    }))}
                    height="300px"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlacesToVisit;
