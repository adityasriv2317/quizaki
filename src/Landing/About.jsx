import React from 'react'

const About = () => {
  return (
    <div>
      <p className="text-center text-mag text-xl mt-[20vh]">UNLOCK YOUR COGNITIVE POTENTIAL</p>
      <p className="text-center text-black text-4xl mt-2 font-semibold">Why Chose Our Brain Games?</p>

      {/* boxes */}
      <div className="flex flex-col md:flex-row md:space-x-6 items-center px-2 mt-14">
        <div className="rounded-md md:w-1/3 aspect-[3/2] bg-[rgb(255,93,122)]">
            a
        </div>
        <div className="rounded-md md:w-1/3 aspect-[3/2] bg-[rgb(242,159,5)]">
            a
        </div>
        <div className="rounded-md md:w-1/3 aspect-[3/2] bg-[rgb(66,197,148)]">
            a
        </div>
      </div>

    </div>
  )
}

export default About
