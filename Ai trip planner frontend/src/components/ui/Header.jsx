import React, { useState, useEffect } from "react";
import { Button } from "./button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useGoogleLogin } from "@react-oauth/google";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import axios from "axios";
import { toast } from "sonner";
import { FcGoogle } from "react-icons/fc";
import { Menu, X, Plane, LogOut, Map } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Header() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const Navigate = useNavigate();

  const user = localStorage.getItem("user");
  const profile = user ? JSON.parse(user) : null;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const generateUser = async (access_token) => {
    try {
      const userDetails = await axios.get(
        "https://openidconnect.googleapis.com/v1/userinfo",
        { headers: { Authorization: `Bearer ${access_token}` } }
      );
      localStorage.setItem("user", JSON.stringify(userDetails.data));
      window.location.reload();
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const login = useGoogleLogin({
    onSuccess: (res) => {
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
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
            ? "glass shadow-sm"
            : "bg-transparent"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => Navigate("/")}
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
              <Plane className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">
              Tripify<span className="gradient-text">AI</span>
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-3">
            <button
              onClick={() => Navigate("/create-trip")}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-all duration-200"
            >
              Plan a Trip
            </button>

            {profile ? (
              <>
                <button
                  onClick={() => Navigate("/my-trips/" + profile.email)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-all duration-200 flex items-center gap-1.5"
                >
                  <Map className="w-4 h-4" />
                  My Trips
                </button>

                <Popover>
                  <PopoverTrigger>
                    <img
                      src={profile?.picture}
                      alt="profile"
                      className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-md cursor-pointer hover:scale-105 transition-transform duration-200"
                    />
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-2">
                    <div className="px-2 py-1.5 mb-1">
                      <p className="text-xs font-medium text-gray-900 truncate">{profile.name}</p>
                      <p className="text-xs text-gray-400 truncate">{profile.email}</p>
                    </div>
                    <button
                      onClick={() => { localStorage.clear(); window.location.reload(); }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </PopoverContent>
                </Popover>
              </>
            ) : (
              <Button
                onClick={() => setDialogOpen(true)}
                className="gradient-bg text-white border-0 px-5 py-2 text-sm font-medium rounded-xl shadow-lg hover:opacity-90 hover:scale-105 transition-all duration-200"
              >
                Sign in
              </Button>
            )}
          </nav>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden glass border-t border-white/20 animate-fade-in">
            <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-2">
              <button
                onClick={() => { Navigate("/create-trip"); setMobileMenuOpen(false); }}
                className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
              >
                ✈️ Plan a Trip
              </button>
              {profile ? (
                <>
                  <button
                    onClick={() => { Navigate("/my-trips/" + profile.email); setMobileMenuOpen(false); }}
                    className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    🗺️ My Trips
                  </button>
                  <button
                    onClick={() => { localStorage.clear(); window.location.reload(); }}
                    className="w-full text-left px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <Button
                  onClick={() => { setDialogOpen(true); setMobileMenuOpen(false); }}
                  className="w-full gradient-bg text-white border-0 rounded-xl"
                >
                  Sign in with Google
                </Button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Sign-in Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-sm rounded-2xl p-8">
          <DialogHeader className="text-center">
            <div className="w-12 h-12 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <DialogTitle className="text-xl font-bold">Welcome to Tripify AI</DialogTitle>
            <DialogDescription className="text-gray-500 mt-1">
              Sign in to start planning your perfect trip with AI.
            </DialogDescription>
          </DialogHeader>
          <Button
            onClick={() => login()}
            className="mt-6 w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl py-3 font-medium shadow-sm transition-all duration-200 hover:shadow-md"
          >
            <FcGoogle className="w-5 h-5" />
            Continue with Google
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Header;
