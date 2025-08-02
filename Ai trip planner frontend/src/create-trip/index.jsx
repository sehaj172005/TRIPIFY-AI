import React, { useEffect, useState } from "react";
import LocationSearch from "../components/ui/Location-search";
import { Input } from "../components/ui/input";
import { SetBudgetOptions } from "../constants/options";
import { SelectTravelList } from "../constants/options";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { getTravelPlan } from "../services/Aimodel";
import { GoogleLogin } from "@react-oauth/google";
import { useGoogleLogin } from "@react-oauth/google";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/ui/Header";
function Createtrip() {
  const [selectedPlace, setSelectedPlace] = useState("null");
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [jsonData, setJsonData] = useState();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tripLoadingDialog, setTripLoadingDialog] = useState(false);
  const Navigate = useNavigate();

  const handlePlaceSelect = (name, value) => {
    if (name == "location") {
      value = value.formatted_address;
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const OnGenerateTrip = async () => {
    setTripLoadingDialog(true);
    setLoading(true);
    if (formData?.NoofDays > 7) {
      toast("No. of Days can't be more than 6.");
      setLoading(false);
      return;
    } else if (
      !formData.NoofDays ||
      !formData.location ||
      !formData.Budget ||
      !formData.traveler
    ) {
      toast("Please fill all the details.");
      setLoading(false);
      return;
    }

    const user = localStorage.getItem("user");
    if (!user) {
      setDialogOpen(true);
      setLoading(false);
      setTripLoadingDialog(false);
      return;
    }

    try {
      setLoading(true);
      setTripLoadingDialog(true);
      const Tripdetails = await getTravelPlan({
        location: formData.location || "",
        days: formData.NoofDays,
        budget: formData.Budget,
        traveler: formData.traveler,
      });
      toast.success("TRIP GENERATED");
      setJsonData(Tripdetails);
      console.log(Tripdetails);
      const user = JSON.parse(localStorage.getItem("user"));

      const res = await axios.post(
        "https://tripify-ai-backend.onrender.com/trip/create",
        {
          userSelection: formData,
          Tripdata: Tripdetails,
          email: user?.email,
        }
      );
      Navigate("/view-trip/" + res.data._id);
    } catch (e) {
      toast.error("There was an error generating trip.");
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const generateUser = async (access_token) => {
    try {
      const userDetails = await axios.get(
        "https://openidconnect.googleapis.com/v1/userinfo",
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      console.log("User Info:", userDetails.data);
      localStorage.setItem("user", JSON.stringify(userDetails.data));
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const login = useGoogleLogin({
    onSuccess: (res) => {
      console.log(res.access_token);
      generateUser(res.access_token);
      setDialogOpen(false);
      toast.success("Signed in successfully");
    },
    onError: () => {
      toast.error("Sign-in failed");
      setDialogOpen(false);
    },
  });
  return (
    <>
      {/* Dialog */}

      <Header />
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>You need to Sign in to generate trip.</DialogTitle>
            <DialogDescription>
              Sign in securely using Google Authentication.
            </DialogDescription>
          </DialogHeader>
          <Button
            onClick={() => {
              login();
            }}
            className="mt-4 w-full"
          >
            <FcGoogle />
            Sign in with Google
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={tripLoadingDialog} onOpenChange={setTripLoadingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Trip Loading...</DialogTitle>
            <DialogDescription>
              Your Trip is being generated.Please wait it might take 30-60
              seconds.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <div className="sm:px-10 md:px-32 lg:px-56 xl:px-52 px-5 mt-10">
        <h2 className="font-bold text-3xl">Tell us your travel preferences.</h2>
        <p className="mt-3 text-gray-500 text-xl">
          Just provide some basic information, and our trip planner will
          generate a customized itinerary based on your preference.
        </p>

        <div className="mt-20 flex flex-col gap-7">
          <div>
            <h2 className="text-xl my-3 font-medium">
              What is destination of choice?
            </h2>
            <LocationSearch onPlaceSelect={handlePlaceSelect} />
          </div>

          <div>
            <h2 className="text-xl my-3 font-medium">
              How many days are you planning your trip?
            </h2>
            <Input
              onChange={(e) => handlePlaceSelect("NoofDays", e.target.value)}
              placeholder="Ex. 3"
              type="Number"
            />
          </div>
        </div>

        <h2 className="text-xl my-3 font-medium mt-11">What is your budget?</h2>
        <div className="grid grid-cols-3 lg:gap-10 xl:gap-10 md:gap-5 mt-5">
          {SetBudgetOptions.map((item, index) => (
            <div
              key={index}
              className={`flex flex-col cursor-pointer lg:p-4 xl:p-4 border rounded-lg hover:shadow-lg ${
                formData?.Budget === item.title && "shadow-lg border-black"
              }`}
              onClick={() => handlePlaceSelect("Budget", item.title)}
            >
              <h2 className="text-3xl">{item.icon}</h2>
              <h2 className="font-bold xl:text-lg lg:text-lg">{item.title}</h2>
              <h2 className="text-gray-500">{item.desc}</h2>
            </div>
          ))}
        </div>

        <h2 className="text-xl my-3 font-medium mt-11">
          Who do you plan on traveling with on your next adventure?
        </h2>
        <div className="grid grid-cols-3 lg:gap-5 xl:gap-5 md:gap-5 mt-5">
          {SelectTravelList.map((item, index) => (
            <div
              key={index}
              className={`flex flex-col cursor-pointer lg:p-4 xl:p-4 border rounded-lg hover:shadow-lg ${
                formData?.traveler === item.people && "shadow-lg border-black"
              }`}
              onClick={() => handlePlaceSelect("traveler", item.people)}
            >
              <h2 className="text-3xl">{item.icon}</h2>
              <h2 className="font-bold xl:text-lg lg:text-lg">{item.title}</h2>
              <h2 className="text-gray-500 mt-2">{item.desc}</h2>
            </div>
          ))}
        </div>

        <div className="flex justify-end mb-2">
          <Button onClick={OnGenerateTrip} className="mt-8">
            {loading ? (
              <AiOutlineLoading3Quarters className="w-7 h-7 animate-spin" />
            ) : (
              "Generate Trip"
            )}
          </Button>
        </div>
      </div>
    </>
  );
}

export default Createtrip;
