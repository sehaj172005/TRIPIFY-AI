import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import InformationSection from "../components/InformationSection.jsx";
import Hotels from "../components/Hotels.jsx";
import PlacesToVisit from "../components/PlacesToVisit.jsx";
import Header from "../../components/ui/Header.jsx";

function Viewtrip() {
  const { tripId } = useParams();
  const [tripData, setTripData] = useState();

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const tripDetails = await axios.get(
          `https://tripify-ai-backend.onrender.com/trip/view-trip/${tripId}`,
        );
        setTripData(tripDetails.data);
      } catch (e) {
        toast("Can't fetch trip-details.");
      }
    };
    fetchTrip();
  }, [tripId]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50/30 pt-20">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <InformationSection trip={tripData} />
          <Hotels trip={tripData} />
          <PlacesToVisit trip={tripData} />
        </div>
      </main>
    </>
  );
}

export default Viewtrip;
