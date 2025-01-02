import React from 'react'
import hero from '/imgs/hero.svg'

const Landing = () => {
  return (
    <div className='flex justify-between w-full mt-24 h-screen'>
      <div className="flex flex-col left w-1/2 mt-4 items-start">
        <p className='font-semibold text-lg'>PLAY AND IMPROVE</p>
        <p className='font-semibold text-6xl mt-4'>The Ultimate Brain Training Platform</p>
        <p className='text-wrap mt-10'>Loop is where stories unfold, connections are made, and memories are shared. Whether you're a storyteller, a listener, or somewhere in between, there's a place for you in our community.</p>

        {/* cta */}
        <div className="flex space-x-3 mt-8">
          <div className="bg-mag px-4 py-2 rounded-md">Play Now</div>
          <div className="bg-white text-mag px-4 py-2 rounded-md">Learn More</div>
        </div>
      </div>

      <div className="right w-1/3">
        <img src={hero} alt="" />
      </div>
    </div>
  )
}

export default Landing
