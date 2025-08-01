import React from "react";
import { Button } from "./button";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <div className="flex flex-col justify-center mx-56 gap-9">
      <h1 className="font-extrabold text-[50px] text-center mt-16">
        <span className="text-red-500">Your Next Adventure with AI : </span>{" "}
        <br></br>
        Personalised Itineraies at your finger tips.
      </h1>
      <p className="text-xl text-gray-500 text-center">
        Your Personal trip planner and travel curator,creating custom itineraies
        tailored to your interests and budget
      </p>
      <Link to="/create-trip">
        <div className="flex justify-center">
          <Button className="w-fit">Get Started, It's Free.</Button>
        </div>
      </Link>
    </div>
  );
}

export default Hero;
