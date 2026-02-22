import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/ui/Header";
import { getUnsplashImage } from "../../services/UnsplashApi";
import { MapPin, Calendar, Wallet, Users, Plane, ArrowRight } from "lucide-react";

function MyTrips() {
  const { email } = useParams();
  const [tripData, setTripData] = useState([]);
  const navigate = useNavigate();
  const [tripPhotos, setTripPhotos] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://tripify-ai-backend.onrender.com/trip/my-trips/${email}`,
        );
        setTripData(response.data);

        if (response.data.length === 0) { setLoading(false); return; }

        // Use Unsplash instead of Google Places
        const photoMap = {};
        await Promise.all(
          response.data.map(async (trip) => {
            try {
              const url = await getUnsplashImage(trip.userSelection?.location, {
                type: "landmark",
                location: trip.userSelection?.location,
              });
              if (url) photoMap[trip.userSelection.location] = url;
            } catch (e) {
              console.error("Error fetching photo:", e);
            }
          })
        );
        setTripPhotos(photoMap);
      } catch (e) {
        console.error("Can't fetch trip details.", e);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, [email]);

  // Skeleton loader
  const Skeleton = () => (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
      <div className="shimmer-skeleton h-52 w-full" />
      <div className="p-5 space-y-3">
        <div className="shimmer-skeleton h-5 w-3/4 rounded-lg" />
        <div className="shimmer-skeleton h-3.5 w-1/2 rounded-lg" />
        <div className="flex gap-2 pt-1">
          <div className="shimmer-skeleton h-7 w-20 rounded-full" />
          <div className="shimmer-skeleton h-7 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50/30 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">

          {/* Page Header */}
          <div className="mb-10 animate-fade-up">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 gradient-bg rounded-2xl flex items-center justify-center shadow-lg">
                <Plane className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">My Trips</h1>
            </div>
            <p className="text-gray-400 ml-13 pl-1">
              {loading ? "Loading your adventures..." : `${tripData.length} trip${tripData.length !== 1 ? "s" : ""} planned`}
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} />)}
            </div>
          )}

          {/* Empty State */}
          {!loading && tripData.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 gradient-bg rounded-3xl flex items-center justify-center shadow-xl mb-6 animate-float">
                <Plane className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No trips yet!</h3>
              <p className="text-gray-400 mb-8 max-w-sm">Start planning your first AI-powered adventure and it will appear here.</p>
              <button
                onClick={() => navigate("/create-trip")}
                className="gradient-bg text-white px-8 py-3 rounded-2xl font-semibold shadow-lg hover:opacity-90 hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                Plan your first trip
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Trip Cards Grid */}
          {!loading && tripData.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-up">
              {tripData.map((trip) => (
                <div
                  key={trip._id}
                  onClick={() => navigate(`/view-trip/${trip._id}`)}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm card-hover cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={tripPhotos[trip.userSelection?.location] || ""}
                      alt={trip.userSelection?.location}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.classList.add('gradient-bg');
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-bold text-lg leading-tight drop-shadow-md">
                        {trip.userSelection?.location || "Unknown Location"}
                      </h3>
                    </div>
                    {/* Arrow reveal on hover */}
                    <div className="absolute top-4 right-4 w-8 h-8 bg-white/0 group-hover:bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <ArrowRight className="w-4 h-4 text-gray-700" />
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4">
                    <div className="flex flex-wrap gap-2">
                      {trip.userSelection?.NoofDays && (
                        <span className="inline-flex items-center gap-1.5 text-xs bg-sky-50 text-sky-600 px-3 py-1.5 rounded-full font-medium">
                          <Calendar className="w-3 h-3" />
                          {trip.userSelection.NoofDays} days
                        </span>
                      )}
                      {trip.userSelection?.Budget && (
                        <span className="inline-flex items-center gap-1.5 text-xs bg-orange-50 text-orange-500 px-3 py-1.5 rounded-full font-medium">
                          <Wallet className="w-3 h-3" />
                          {trip.userSelection.Budget}
                        </span>
                      )}
                      {trip.userSelection?.traveler && (
                        <span className="inline-flex items-center gap-1.5 text-xs bg-purple-50 text-purple-500 px-3 py-1.5 rounded-full font-medium">
                          <Users className="w-3 h-3" />
                          {trip.userSelection.traveler}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default MyTrips;
