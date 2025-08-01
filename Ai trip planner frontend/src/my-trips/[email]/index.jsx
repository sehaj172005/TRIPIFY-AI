import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { GetPlaceDetails } from "../../services/GloabalApi";

function MyTrips() {
  const { email } = useParams();
  const [tripData, setTripData] = useState([]);
  const navigate = useNavigate();
  const [tripPhotos, setTripPhotos] = useState({});
  const API_KEY = import.meta.env.VITE_APP_GOOGLE_PLACE_API_KEY

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/trip/my-trips/${email}`
        );
        setTripData(response.data); // Set the trips
        console.log("Fetched Trips:", response.data);

        // If no trips, exit early
        if (response.data.length === 0) return;

        const newPhotoMap = {};

        for (const tripDetail of response.data) {
          try {
            const data = { textQuery: tripDetail.userSelection.location };
            const result = await GetPlaceDetails(data);

            const rawPhotoRef = result?.data?.places?.[0]?.photos?.[0]?.name;

            if (rawPhotoRef) {
              const photoRef = rawPhotoRef.split("/").pop();
              const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoRef}&key=${API_KEY}`;
              newPhotoMap[tripDetail.userSelection.location] = photoUrl;
              console.log("Fetched photo URL:", photoUrl);
            }
          } catch (error) {
            console.error("Error fetching photo for trip:", error);
          }
        }

        setTripPhotos(newPhotoMap); // Set all photos after loop finishes
      } catch (e) {
        console.error("Can't fetch trip details.", e);
      }
    };

    fetchTrips();
  }, [email]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Trips</h2>

      {tripData.length === 0 ? (
        <p className="text-gray-600">No trips found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tripData.map((trip) => (
            <div
              key={trip._id}
              onClick={() => navigate(`/view-trip/${trip._id}`)}
              className="cursor-pointer rounded-lg shadow-md hover:shadow-xl transition duration-300 bg-white"
            >
              <img
                src={tripPhotos[trip.userSelection.location]}
                alt="Trip"
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">
                  {trip.userSelection?.location || "Unknown Location"}
                </h3>
                <p>Budget: {trip.userSelection?.Budget}</p>
                <p>Travelers: {trip.userSelection?.traveler}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyTrips;
