import React, { useState } from "react";
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
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Header() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const user = localStorage.getItem("user");
  const profile = user ? JSON.parse(user) : null;

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
    <header className="p-4 shadow-sm flex items-center justify-between bg-white flex-wrap">
      {/* Logo */}
      <h2 className="font-bold text-2xl px-4">Tripify AI</h2>

      {/* Hamburger for mobile */}
      <div className="md:hidden px-4">
        <Menu
          className="w-6 h-6 cursor-pointer"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        />
      </div>

      {/* Main Navigation */}
      <nav
        className={`w-full md:w-auto md:flex items-center gap-5 px-4 ${
          mobileMenuOpen ? "block" : "hidden"
        } md:block`}
      >
        <div className="flex flex-col md:flex-row gap-4 mt-4 md:mt-0 md:ml-auto items-center">
          <a href="/create-trip">
            <Button className="w-full md:w-auto">Create Trip</Button>
          </a>

          {profile ? (
            <>
              <a href={`/my-trips/${profile.email}`}>
                <Button className="w-full md:w-auto">View your Trips</Button>
              </a>

              <Popover>
                <PopoverTrigger>
                  <img
                    src={profile?.picture}
                    alt="profile"
                    className="w-8 h-8 rounded-full object-cover cursor-pointer"
                  />
                </PopoverTrigger>
                <PopoverContent className="w-40">
                  <Button
                    onClick={() => {
                      localStorage.clear();
                      window.location.reload();
                    }}
                    className="w-full"
                  >
                    Logout
                  </Button>
                </PopoverContent>
              </Popover>
            </>
          ) : (
            <>
              <Button
                onClick={() => setDialogOpen(true)}
                className="w-full md:w-auto"
              >
                Sign in
              </Button>

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      You need to Sign in to generate trip.
                    </DialogTitle>
                    <DialogDescription>
                      Sign in securely using Google Authentication.
                    </DialogDescription>
                  </DialogHeader>
                  <Button className="mt-4 w-full" onClick={login}>
                    <FcGoogle className="mr-2" /> Sign in with Google
                  </Button>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
