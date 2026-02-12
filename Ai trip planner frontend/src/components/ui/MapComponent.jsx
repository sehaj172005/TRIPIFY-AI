import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const MapCenter = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    if (center && center.length === 2) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);

  return null;
};

/**
 * MapComponent - Reusable Leaflet/OpenStreetMap component
 * @param {Array} center - [latitude, longitude]
 * @param {number} zoom - Initial zoom level
 * @param {Array} markers - Array of {position: [lat, lng], label: string, description?: string}
 * @param {string} height - Height of map container
 */
const MapComponent = ({
  center = [51.505, -0.09],
  zoom = 13,
  markers = [],
  height = "400px",
  style = {},
}) => {
  return (
    <div
      style={{ height, ...style }}
      className="rounded-lg overflow-hidden border border-gray-200"
    >
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%" }}
        className="w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapCenter center={center} />

        {markers.map((marker, index) => (
          <Marker key={index} position={marker.position}>
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-sm">{marker.label}</h3>
                {marker.description && (
                  <p className="text-xs text-gray-600 mt-1">
                    {marker.description}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
