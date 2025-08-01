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
import { useNavigate } from "react-router-dom";

function Header() {
  const [dialogOpen, setDialogOpen] = useState(false);
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
      console.log("User Info:", userDetails.data);
      localStorage.setItem("user", JSON.stringify(userDetails.data));
      window.location.reload();
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
    <div className="p-3 shadow-sm flex justify-between items-center px-7">
      {/* Logo Image */}
     <h2 className="font-bold text-2xl px-10">Tripify AI</h2>
      {/* Right Section */}
      <div className="flex gap-7">
        <a href="/create-trip">
          <Button>Create Trip</Button>
        </a>
        {profile ? (
          <div className="flex items-center gap-7">
            {/* View Trip link */}
            <a
              href={`/my-trips/${profile.email}`}
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              <Button>View your Trips</Button>
            </a>

            {/* Profile and Logout */}
            <Popover>
              <PopoverTrigger>
                <img
                  src={profile?.picture}
                  alt="profilePhoto"
                  className="w-8 h-8 rounded-full object-cover cursor-pointer"
                />
              </PopoverTrigger>
              <PopoverContent>
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
          </div>
        ) : (
          <>
            <Button onClick={() => setDialogOpen(true)}>Sign in</Button>

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
                <Button
                  className="mt-4 w-full"
                  onClick={() => {
                    login();
                  }}
                >
                  <FcGoogle className="mr-2" /> Sign in with Google
                </Button>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </div>
  );
}

export default Header;
