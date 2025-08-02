import React from "react";
import { Button } from "./button";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <div className="flex flex-col justify-center px-4 sm:px-8 md:px-16 lg:mx-40 xl:mx-56 gap-6 sm:gap-8 md:gap-10">
      <h1 className="font-extrabold text-3xl sm:text-4xl md:text-5xl text-center mt-12 sm:mt-16">
        <span className="text-red-500">Your Next Adventure with AI:</span> <br />
        Personalised Itineraries at your fingertips.
      </h1>
      <p className="text-base sm:text-lg md:text-xl text-gray-500 text-center max-w-3xl mx-auto">
        Your personal trip planner and travel curator, creating custom itineraries
        tailored to your interests and budget.
      </p>
      <Link to="/create-trip">
        <div className="flex justify-center">
          <Button className="w-fit text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3">
            Get Started, It's Free.
          </Button>
        </div>
      </Link>
    </div>
  );
}

export default Hero;
