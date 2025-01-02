import React from 'react';
import hero from '/imgs/hero.svg';

const Landing = () => {
  return (
    <div className="flex flex-col md:flex-row md:justify-between w-full md:mt-24 mt-6 h-screen">
      {/* Left  */}
      <div className="flex flex-col md:w-1/2 mt-4 items-start mb-8">
        <p className="font-semibold text-lg md:text-xl">PLAY AND IMPROVE</p>
        <p className="font-semibold text-3xl md:text-6xl mt-4 leading-tight">
          The Ultimate Brain Training Platform
        </p>
        <p className="text-md mt-6 md:mt-10">
          Loop is where stories unfold, connections are made, and memories are shared. 
          Whether you're a storyteller, a listener, or somewhere in between, there's a place 
          for you in our community.
        </p>

        {/* cta */}
        <div className="flex flex-wrap space-x-3 mt-6">
          <button className="bg-mag px-4 py-2 rounded-md shadow-md">
            Play Now
          </button>
          <button className="bg-white text-mag px-4 py-2 rounded-md shadow-md border border-mag">
            Learn More
          </button>
        </div>
      </div>

      {/* Right  */}
      <div className="md:w-1/3 mt-8 md:mt-0"><img
          src={hero}
          alt="Hero"
        /></div>
        
      </div>
  );
};

export default Landing;
