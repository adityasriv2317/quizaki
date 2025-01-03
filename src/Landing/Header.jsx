import React, { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="w-full flex justify-between text-white items-center py-2 md:py-4 z-10 bg-transparent">
      {/* left */}
      <div className="left flex items-center [text-shadow:3px_3px_12px_rgba(0,0,0,0.5)]">
        <div className="logo font-oxanium text-2xl">QUIZAKI</div>
        <div className="nav hidden md:flex ml-10 space-x-6">
          <span>Home</span>
          <span>Features</span>
          <span>Testimonials</span>
          <span>News</span>
        </div>
      </div>

      {/* right */}
      <div className="hidden md:block right space-x-6 [text-shadow:3px_3px_12px_rgba(0,0,0,0.5)]">
        <Link to="/auth">Sign In</Link>
        <Link
          to="/auth"
          className="bg-white text-[rgb(185,68,89)] [text-shadow:3px_3px_12px_rgba(233,74,102,0.4)] font-semibold rounded-lg p-3"
        >
          Get Started
        </Link>
      </div>

      {/* hamburger */}
      <div
        className={`md:hidden flex items-center cursor-pointer ${isMenuOpen?"bg-white":"bg-transparent"} p-2 rounded-lg`}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <div className="space-y-1">
          <div className={`h-1 w-6 ${isMenuOpen?"bg-mag":"bg-white"}`}></div>
          <div className={`h-1 w-6 ${isMenuOpen?"bg-mag":"bg-white"}`}></div>
          <div className={`h-1 w-6 ${isMenuOpen?"bg-mag":"bg-white"}`}></div>
        </div>
      </div>

      {/* list */}
      {isMenuOpen && (
        <div className="absolute top-24 left-0 w-full bg-gradient-to-b from-[rgb(187,67,89)] to-mag shadow-lg md:hidden flex flex-col items-start p-6 space-y-4">
          <Link to="/" className="text-lg">
            Home
          </Link>
          <Link to="/features" className="text-lg">
            Features
          </Link>
          <Link to="/testimonials" className="text-lg">
            Testimonials
          </Link>
          <Link to="/news" className="text-lg">
            News
          </Link>
          <div className="bg-white w-full h-[1px]"></div>
          <div className=" space-x-6">
            <Link to="/auth" className="text-lg">
              Sign In
            </Link>
            <Link
              to="/auth"
              className="text-[rgb(185,68,89)] [text-shadow:3px_3px_12px_rgba(233,74,102,0.4)] bg-white font-semibold rounded-lg px-4 py-2"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
