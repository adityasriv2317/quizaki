import React from "react";

const Events = () => {
  return (
    <div className="w-full my-10 flex flex-col font-poppins md:flex-row justify-center items-center space-y-6 md:space-y-0 md:space-x-8 px-4">
      {/* Left Section */}
      <div className="left w-full md:w-1/4 text-center md:text-left">
        <p className="text-mag font-semibold text-lg md:text-xl">CCC EVENTS</p>
        <p className="text-3xl md:text-5xl font-bold">Latest Quiz Events</p>
        <div className="bubbles flex flex-wrap gap-2 my-4 justify-center md:justify-start">
          {[
            "Competition",
            "New Update",
            "Weekly Trivia",
            "2024 Creators",
            "Flash Quizzes",
            "2024 Showdown",
          ].map((item) => (
            <div
              key={item}
              className="py-1 px-3 rounded-full border border-black text-sm md:text-base"
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Right Section */}
      <div className="right flex flex-col sm:flex-row w-full md:w-3/4 space-y-4 sm:space-y-0 sm:space-x-8">
        {/* Card 1 */}
        <div className="bg-orange-500 flex-1 aspect-[2/2] rounded-lg p-4 text-center text-white">
          <p className="font-semibold text-3xl md:text-4xl my-4">JAVA</p>
          <p className="text-sm md:text-base">DESCRIPTION</p>
          <ul className="mt-4 text-sm md:text-base">
            <li>Class</li>
            <li>Function</li>
            <li>Recursion</li>
          </ul>
        </div>
        {/* Card 2 */}
        <div className="bg-green-500 flex-1 rounded-lg p-4 text-center text-white">
          <p className="font-semibold text-3xl md:text-4xl my-4">WEB DEV</p>
          <p className="text-sm md:text-base">DESCRIPTION</p>
          <ul className="mt-4 text-sm md:text-base">
            <li>React</li>
            <li>Bootstrap</li>
            <li>Designs</li>
          </ul>
        </div>
        {/* Card 3 */}
        <div className="bg-blue-500 flex-1 rounded-lg p-4 text-center text-white">
          <p className="font-semibold text-3xl md:text-4xl my-4">PYTHON</p>
          <p className="text-sm md:text-base">DESCRIPTION</p>
          <ul className="mt-4 text-sm md:text-base">
            <li>Data Types</li>
            <li>Libraries</li>
            <li>Modules</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Events;
