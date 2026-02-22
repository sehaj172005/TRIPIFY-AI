import React from "react";
import { Hotel as HotelIcon, Star, MapPin, DollarSign, ExternalLink, Wifi, Coffee, Car } from "lucide-react";

// Rotating gradient combos for card accents
const cardGradients = [
  "from-sky-400 to-blue-600",
  "from-teal-400 to-emerald-600",
  "from-violet-400 to-purple-600",
  "from-orange-400 to-rose-500",
  "from-pink-400 to-fuchsia-600",
  "from-amber-400 to-orange-500",
];

const amenityIcons = [
  { icon: <Wifi className="w-3.5 h-3.5" />, label: "Free WiFi" },
  { icon: <Coffee className="w-3.5 h-3.5" />, label: "Breakfast" },
  { icon: <Car className="w-3.5 h-3.5" />, label: "Parking" },
];

function HotelCard({ hotel, index }) {
  const gradient = cardGradients[index % cardGradients.length];

  const openGoogleMaps = () => {
    const query = `${hotel.hotelName} ${hotel.hotelAddress}`;
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
      "_blank"
    );
  };

  return (
    <div
      onClick={openGoogleMaps}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm card-hover cursor-pointer flex flex-col"
    >
      {/* Decorative header band */}
      <div className={`relative bg-gradient-to-br ${gradient} h-36 flex items-center justify-center overflow-hidden`}>
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        {/* Decorative circles */}
        <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10" />
        <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-white/10" />

        {/* Hotel icon */}
        <div className="relative flex flex-col items-center gap-2">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30 shadow-lg">
            <HotelIcon className="w-7 h-7 text-white" />
          </div>
          {/* Rating badge */}
          {hotel?.rating && (
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30">
              <Star className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
              <span className="text-white text-xs font-bold">{hotel.rating}</span>
            </div>
          )}
        </div>

        {/* "Open Maps" hover badge */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
          <span className="flex items-center gap-1 bg-white/90 text-gray-700 text-xs font-medium px-2.5 py-1.5 rounded-full shadow">
            <ExternalLink className="w-3 h-3" />
            Maps
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        {/* Name */}
        <div>
          <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-1">
            {hotel?.hotelName}
          </h3>
          <p className="text-xs text-gray-400 flex items-start gap-1 mt-1 line-clamp-2">
            <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
            {hotel?.hotelAddress}
          </p>
        </div>

        {/* Description */}
        {hotel?.description && (
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
            {hotel.description}
          </p>
        )}

        {/* Amenity pills */}
        <div className="flex flex-wrap gap-1.5">
          {amenityIcons.map((a, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 text-[11px] bg-gray-50 text-gray-500 border border-gray-100 px-2 py-1 rounded-full"
            >
              {a.icon} {a.label}
            </span>
          ))}
        </div>

        {/* Price row */}
        <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
          <div>
            <span className={`text-base font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
              {hotel?.price}
            </span>
            <span className="text-xs text-gray-400 ml-1">/ night</span>
          </div>
          <button className={`text-xs font-semibold bg-gradient-to-r ${gradient} text-white px-3 py-1.5 rounded-lg opacity-80 group-hover:opacity-100 transition-opacity`}>
            View →
          </button>
        </div>
      </div>
    </div>
  );
}

function Hotels({ trip }) {
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
          <HotelCard key={index} hotel={hotel} index={index} />
        ))}
      </div>
    </div>
  );
}

export default Hotels;
