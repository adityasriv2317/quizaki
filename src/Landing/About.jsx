import React from "react";

import a from "/icons/a.svg";
import b from "/icons/b.svg";
import c from "/icons/c.svg";

const About = () => {
  return (
    <div id="testimonials">
      {/* heading */}
      <p className="text-center text-mag text-xl font-semibold mt-[25vw] md:mt-[25vh] [text-shadow:3px_3px_12px_rgba(233,74,102,0.4)]">
        UNLOCK YOUR COGNITIVE POTENTIAL
      </p>
      <p className="text-center text-black text-4xl mt-2 font-semibold [text-shadow:3px_3px_12px_rgba(0,0,0,0.4)]">
        Why Choose Our Brain Games?
      </p>

      {/* boxes */}
      <div className="flex flex-col md:flex-row md:space-x-6 items-center [text-shadow:2px_2px_14px_rgba(0,0,0,0.3)] justify-center mt-14 space-y-6 md:space-y-0">
        {/* a */}
        <div className="rounded-xl w-full md:w-1/3 aspect-[3/2] gap-6 p-6 bg-[rgb(255,93,122)] [box-shadow:0_8px_2px_rgb(216,78,103)] flex flex-col items-center text-center justify-center text-white">
          <img src={a} alt="" />
          <p className="font-bold text-xl">Engaging & Fun Challenges</p>
          <p className="text-sm">
            Our app offers a variety of entertaining Quizes that keep you
            engaged and motivated, making brain training a fun and rewarding
            experience.
          </p>
        </div>
        {/* b */}
        <div className="rounded-xl w-full md:w-1/3 aspect-[3/2] gap-6 p-6 bg-[rgb(242,159,5)] [box-shadow:0_8px_2px_rgb(210,125,3)] flex flex-col items-center text-center justify-center text-white">
          <img src={b} alt="" />
          <p className="text-xl font-bold">Boost Your Brain Health</p>
          <p className="text-sm">
            Quizes with our app can help maintain and enhance your cognitive
            health, supporting long-term mental fitness and resilience.
          </p>
        </div>
        <div className="rounded-xl w-full md:w-1/3 aspect-[3/2] gap-6 p-6 bg-[rgb(66,197,148)] [box-shadow:0_8px_2px_rgb(50,170,125)] flex flex-col items-center text-center justify-center text-white">
          <img src={c} alt="" />
          <p className="text-xl font-bold">Adaptive Difficulty Levels</p>
          <p className="text-sm">
            Quizes automatically adjust their difficulty based on your
            performance, ensuring that you are always challenged and engaged.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
