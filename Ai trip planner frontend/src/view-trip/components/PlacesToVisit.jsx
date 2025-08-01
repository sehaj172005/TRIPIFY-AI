import React, { useEffect, useState } from "react";
import { FaClock, FaStar, FaTicketAlt, FaMapMarkerAlt } from "react-icons/fa";
import { GetPlaceDetails } from "../../services/GloabalApi";
import placeHolder from "../images/placeholder.jpg";

function PlacesToVisit({ trip }) {
  const [placePhotos, setPlacePhotos] = useState({}); // placeName => photoURL
  const API_KEY = import.meta.env.VITE_APP_GOOGLE_PLACE_API_KEY

  useEffect(() => {
    const fetchPhotos = async () => {
      if (!trip?.Tripdata?.itinerary) return;

      const newPhotos = {};

      for (const day of trip.Tripdata.itinerary) {
        for (const place of day.plan) {
          try {
            const data = { textQuery: place.placeName };
            const result = await GetPlaceDetails(data);
            const rawPhotoRef = result?.data?.places?.[0]?.photos?.[0]?.name;

            if (rawPhotoRef) {
              const photoRef = rawPhotoRef.split("/").pop();
              const photoURL = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoRef}&key=${API_KEY}`;
              newPhotos[place.placeName] = photoURL;
            }
          } catch (err) {
            console.error(
              `Failed to load image for ${place.placeName}`,
              err.message
            );
          }
        }
      }

      setPlacePhotos(newPhotos);
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
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                place.placeName
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline"
                            >
                              View on map
                            </a>
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
