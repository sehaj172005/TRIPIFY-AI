import React, { useEffect, useState } from "react";
import LocationSearch from "../components/ui/Location-search";
import { Input } from "../components/ui/input";
import { SetBudgetOptions } from "../constants/options";
import { SelectTravelList } from "../constants/options";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { getTravelPlan } from "../services/Aimodel";
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
import { Plane, MapPin, Calendar, Wallet, Users, Sparkles } from "lucide-react";

function Createtrip() {
  const [selectedPlace, setSelectedPlace] = useState("");
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [jsonData, setJsonData] = useState();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tripLoadingDialog, setTripLoadingDialog] = useState(false);
  const Navigate = useNavigate();

  const handlePlaceSelect = (name, value) => {
    if (name === "location") {
      value = value?.formatted_address || "";
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isFormComplete =
    !!formData.location &&
    !!formData.NoofDays &&
    Number(formData.NoofDays) >= 1 &&
    Number(formData.NoofDays) <= 7 &&
    !!formData.Budget &&
    !!formData.traveler;

  const OnGenerateTrip = async () => {
    setTripLoadingDialog(true);
    setLoading(true);
    if (formData?.NoofDays > 7) {
      toast("No. of Days can't be more than 6.");
      setLoading(false);
      return;
    } else if (!formData.NoofDays || !formData.location || !formData.Budget || !formData.traveler) {
      toast("Please fill all the details.");
      setLoading(false);
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      setDialogOpen(true);
      setLoading(false);
      setTripLoadingDialog(false);
      return;
    }

    try {
      setLoading(true);
      setTripLoadingDialog(true);
      const aiResponse = await getTravelPlan(formData);
      const payload = {
        userSelection: formData,
        Tripdata: aiResponse,
        email: user.email,
      };
      const res = await axios.post(
        "https://tripify-ai-backend.onrender.com/trip/create",
        payload,
      );
      Navigate("/view-trip/" + res.data._id);
    } catch (e) {
      toast.error("There was an error generating trip.");
    } finally {
      setLoading(false);
      setTripLoadingDialog(false);
    }
  };

  const generateUser = async (access_token) => {
    try {
      const userDetails = await axios.get(
        "https://openidconnect.googleapis.com/v1/userinfo",
        { headers: { Authorization: `Bearer ${access_token}` } },
      );
      localStorage.setItem("user", JSON.stringify(userDetails.data));
      return userDetails.data; // return user so caller can use it
    } catch (error) {
      console.error("Error fetching user info:", error);
      return null;
    }
  };

  const login = useGoogleLogin({
    onSuccess: async (res) => {
      const user = await generateUser(res.access_token); // await so localStorage is set
      setDialogOpen(false);
      toast.success("Signed in! Generating your trip...");
      // Automatically continue generating the trip
      setTimeout(() => OnGenerateTrip(), 300);
    },
    onError: () => {
      toast.error("Sign-in failed");
      setDialogOpen(false);
    },
  });

  return (
    <>
      <Header />

      {/* Sign-in Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-sm rounded-2xl p-8">
          <DialogHeader className="text-center">
            <div className="w-12 h-12 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <DialogTitle className="text-xl font-bold">Sign in to continue</DialogTitle>
            <DialogDescription className="text-gray-500 mt-1">
              You need to sign in to generate and save your trip.
            </DialogDescription>
          </DialogHeader>
          <Button
            onClick={() => login()}
            className="mt-6 w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl py-3 font-medium shadow-sm"
          >
            <FcGoogle className="w-5 h-5" />
            Continue with Google
          </Button>
        </DialogContent>
      </Dialog>

      {/* AI Loading Dialog */}
      <Dialog open={tripLoadingDialog} onOpenChange={setTripLoadingDialog}>
        <DialogContent className="sm:max-w-sm rounded-2xl p-10 text-center">
          <div className="flex flex-col items-center gap-6">
            {/* Animated AI orb */}
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 gradient-bg rounded-full opacity-20 animate-ping" />
              <div className="relative w-20 h-20 gradient-bg rounded-full flex items-center justify-center shadow-xl">
                <Sparkles className="w-8 h-8 text-white animate-spin-slow" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Crafting your trip...</h3>
              <p className="text-gray-500 text-sm">Our AI is building your personalized itinerary. This takes 30–60 seconds.</p>
            </div>
            {/* Animated dots */}
            <div className="flex gap-2 justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 dot-1" />
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400 dot-2" />
              <span className="w-2.5 h-2.5 rounded-full bg-orange-400 dot-3" />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main Form Page */}
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50/30 pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-6">

          {/* Header */}
          <div className="text-center mb-12 animate-fade-up">
            <div className="inline-flex items-center gap-2 bg-sky-50 border border-sky-100 text-sky-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              AI Trip Planner
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Tell us how you<br />
              <span className="gradient-text">like to travel</span>
            </h1>
            <p className="text-gray-500 text-lg max-w-md mx-auto">
              Fill in your preferences and let our AI create the perfect itinerary for you.
            </p>
          </div>

          {/* Form Cards */}
          <div className="flex flex-col gap-6">

            {/* Destination */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-fade-up-delay-1 relative z-20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-sky-100 rounded-xl flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-sky-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">Destination</h2>
                  <p className="text-xs text-gray-400">Where do you want to go?</p>
                </div>
              </div>
              <LocationSearch onPlaceSelect={handlePlaceSelect} />
            </div>

            {/* Duration */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-fade-up-delay-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-teal-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-teal-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">Trip Duration</h2>
                  <p className="text-xs text-gray-400">How many days? (Max 7)</p>
                </div>
              </div>
              <Input
                onChange={(e) => handlePlaceSelect("NoofDays", e.target.value)}
                placeholder="e.g. 3"
                type="Number"
                min="1"
                max="7"
                className="rounded-xl border-gray-200 focus:border-sky-300 focus:ring-sky-200 text-base py-3"
              />
            </div>

            {/* Budget */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-fade-up-delay-3">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-orange-500" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">Budget</h2>
                  <p className="text-xs text-gray-400">What's your spending style?</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {SetBudgetOptions.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handlePlaceSelect("Budget", item.title)}
                    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${formData?.Budget === item.title
                      ? "border-sky-400 bg-sky-50 shadow-md"
                      : "border-gray-100 hover:border-gray-200 bg-gray-50"
                      }`}
                  >
                    {formData?.Budget === item.title && (
                      <span className="absolute top-2 right-2 w-5 h-5 gradient-bg rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </span>
                    )}
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <div className="font-semibold text-gray-900 text-sm">{item.title}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Travelers */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-fade-up-delay-4">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Users className="w-4 h-4 text-purple-500" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">Travel Group</h2>
                  <p className="text-xs text-gray-400">Who's coming with you?</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {SelectTravelList.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handlePlaceSelect("traveler", item.people)}
                    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${formData?.traveler === item.people
                      ? "border-sky-400 bg-sky-50 shadow-md"
                      : "border-gray-100 hover:border-gray-200 bg-gray-50"
                      }`}
                  >
                    {formData?.traveler === item.people && (
                      <span className="absolute top-2 right-2 w-5 h-5 gradient-bg rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </span>
                    )}
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <div className="font-semibold text-gray-900 text-sm">{item.title}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <div className="flex flex-col items-center gap-3 pt-2 animate-fade-up-delay-5">
              {!isFormComplete && !loading && (
                <p className="text-sm text-gray-400 flex items-center gap-1.5">
                  <span className="text-orange-400">⚠️</span>
                  Please complete all fields above to continue
                </p>
              )}
              <button
                onClick={OnGenerateTrip}
                disabled={!isFormComplete || loading}
                className={`relative group w-full sm:w-auto px-12 py-4 rounded-2xl text-base font-semibold text-white transition-all duration-300 flex items-center justify-center gap-3 ${isFormComplete && !loading
                  ? "gradient-bg shadow-xl hover:opacity-95 hover:scale-105 hover:shadow-2xl cursor-pointer"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                  }`}
              >
                {loading ? (
                  <>
                    <AiOutlineLoading3Quarters className="w-5 h-5 animate-spin" />
                    Generating your trip...
                  </>
                ) : (
                  <>
                    <Plane className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                    Generate My Trip ✈️
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      </main>
    </>
  );
}

export default Createtrip;
