import React, { useEffect, useState } from "react";
import logo from "../images/placeholder.jpg";
import { getUnsplashImage } from "../../services/UnsplashApi";
import { Calendar, Wallet, Users, MapPin } from "lucide-react";

function InformationSection({ trip }) {
  const [photoUrl, setPhotoUrl] = useState(logo);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (trip?.userSelection?.location) {
      GetPlacePhoto();
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
      }
    } catch (error) {
      console.error("Error fetching destination image:", error.message);
    }
  };

  const badges = [
    { icon: <Calendar className="w-3.5 h-3.5" />, label: `${trip?.userSelection?.NoofDays} Days` },
    { icon: <Wallet className="w-3.5 h-3.5" />, label: `${trip?.userSelection?.Budget} Budget` },
    { icon: <Users className="w-3.5 h-3.5" />, label: trip?.userSelection?.traveler },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Image */}
      <div className="relative w-full h-[260px] md:h-[420px] rounded-3xl overflow-hidden shadow-2xl mb-8">
        <img
          src={photoUrl}
          alt={trip?.userSelection?.location}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-700 ${imageLoaded ? "scale-100 opacity-100" : "scale-105 opacity-0"}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
            <MapPin className="w-4 h-4" />
            Your destination
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg">
            {trip?.userSelection?.location}
          </h1>
        </div>
      </div>

      {/* Trip badges */}
      <div className="flex flex-wrap gap-3 mb-10">
        {badges.map((b, i) => (
          <span key={i} className="inline-flex items-center gap-2 bg-white border border-gray-100 shadow-sm px-4 py-2 rounded-full text-sm font-medium text-gray-700">
            <span className="text-sky-500">{b.icon}</span>
            {b.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default InformationSection;
