import React, { useState, useEffect } from "react";

import phone from "/graphics/phone.svg";
import p1 from "/imgs/p1.svg";
import p2 from "/imgs/p2.svg";
import p3 from "/imgs/p3.svg";
import p4 from "/imgs/p4.svg";
import p5 from "/imgs/p5.svg";

const Carousel = () => {
  const [activeIndex, setActiveIndex] = useState(2);
  const [visibleImages, setVisibleImages] = useState(5);

  const images = [p1, p2, p3, p4, p5];

  useEffect(() => {
    const handleResize = () => {
      setVisibleImages(window.innerWidth > 760 ? 5 : 3);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  const getTranslateX = () => {
    const centerOffset =
      visibleImages == 3 ? 100 / visibleImages : 397 / visibleImages / 2;
    return `calc(${centerOffset}% - ${(activeIndex * 100) / visibleImages}%)`;
  };

  return (
    <div id="features" className="mt-32 px-4">
      {/* head */}
      <p className="text-center text-mag text-xl font-semibold [text-shadow:3px_3px_12px_rgba(233,74,102,0.4)]">
        CONVENIENT & ACCESSIBLE
      </p>
      <p className="text-center text-black text-3xl md:text-4xl mt-2 font-semibold [text-shadow:3px_3px_12px_rgba(0,0,0,0.4)]">
        Train Your Brain Anytime, Anywhere
      </p>
      <p className="text-center text-gray-800 text-base md:text-xl px-2 md:px-8 lg:px-16 mt-10 font-medium [text-shadow:3px_3px_12px_rgba(0,0,0,0.4)]">
        Our mobile app allows you to train your brain at your convenience.
        Access brain games anytime, anywhere, and make the most of your free
        moments to stay sharp.
      </p>

      {/* slider */}
      <div className="relative flex items-center justify-center mt-10 overflow-hidden py-4 px-10">
        {/* case */}
        {/* <img
          src={phone}
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-full ${
            visibleImages == 5 ? "scale-110" : "scale-90"
          } md:w-1/5 z-20`}
        /> */}
        <div
          className="slider flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(${getTranslateX()})`,
          }}
        >
          {images.map((img, index) => (
            <div
              key={index}
              className={`relative flex-shrink-0 aspect-auto ${
                visibleImages === 5 ? "w-1/5" : "w-1/3"
              } transition-transform duration-500 ease-in-out ${
                index === activeIndex ? "scale-100 z-10" : "scale-75 opacity-50"
              }`}
            >
              <img src={img} className="h-full w-full rounded-sm" />
            </div>
          ))}
        </div>
      </div>

      {/* dots */}
      <div className="flex justify-center items-center mt-6 space-x-2 transition-transform duration-500 ease-in-out">
        {images.map((_, index) => (
          <div
            key={index}
            onClick={() => {
              setActiveIndex(index);
            }}
            className={`w-3 h-3 rounded-full cursor-pointer ${
              index === activeIndex
                ? "bg-mag scale-110 shadow-sm shadow-mag"
                : "bg-gray-200 shadow-sm"
            } transition-colors duration-300`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;