import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import InformationSection from '../components/InformationSection.jsx'
import Hotels from '../components/Hotels.jsx'
import PlacesToVisit from '../components/PlacesToVisit.jsx';

function Viewtrip() {
    const {tripId} = useParams();
    const [tripData , setTripData] = useState()

   useEffect(() => {
  const fetchTrip = async () => {
    try {
      const tripDetails = await axios.get(`http://localhost:3000/trip/view-trip/${tripId}`);
      setTripData(tripDetails.data);
      console.log("data fetched." , tripDetails.data);
    } catch (e) {
      toast("Can't fetch trip-details.");
    }
  };

  fetchTrip();

}, [tripId]);

  return (
    <div className='p-10 md:px-20 lg:px-44 xl:px-56'>
      <InformationSection trip = {tripData} />
      <Hotels trip = {tripData} />
      <PlacesToVisit trip = {tripData} />
    </div>
  )
}

export default Viewtrip