import React, { useState } from "react";
import { Link } from "react-router-dom";

import { useWebData } from "../Security/WebData";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileMenuMobile, setProfileMenuMobile] = useState(false);
  const [menuSlide, setMenuSlide] = useState(false);
  const [profileMenuDesktop, setProfileMenuDesktop] = useState(false);
  const { siteData } = useWebData();

  return (
    <div className="w-full flex justify-between text-white items-center py-2 md:py-4 z-10 bg-transparent">
      {/* Left */}
      <div className="left flex items-center [text-shadow:3px_3px_12px_rgba(0,0,0,0.5)]">
        <div className="logo font-oxanium text-2xl">QUIZAKI</div>
        <div className="nav hidden md:flex ml-10 space-x-6">
          <span className="cursor-pointer">Home</span>
          <a href="#features" className="cursor-pointer">
            Features
          </a>
          <span className="cursor-pointer">Testimonials</span>
          <span className="cursor-pointer">News</span>
        </div>
      </div>

      {/* Right */}
      {siteData.isLogin ? (
        <div className="relative">
          <div
            onClick={() => setProfileMenuDesktop(!profileMenuDesktop)}
            className="bg-[rgb(245,245,245)] hover:bg-white hidden md:block text-[rgb(185,68,89)] cursor-pointer [text-shadow:3px_3px_12px_rgba(0,0,0,0.2)] font-semibold rounded-lg p-3"
          >
            Hello, {siteData.user}
          </div>
          {profileMenuDesktop && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg">
              <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100 rounded-t-lg">
                Profile
              </Link>
              <Link
                to="/settings"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Settings
              </Link>
              <Link to="/logout" className="block px-4 py-2 hover:bg-gray-100 rounded-b-lg">
                Logout
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="hidden md:block right space-x-6 [text-shadow:3px_3px_12px_rgba(0,0,0,0.5)]">
          <Link to="/auth/login">Sign In</Link>
          <Link
            to="/auth/register"
            className="bg-[rgb(245,245,245)] hover:bg-white text-[rgb(185,68,89)] [text-shadow:3px_3px_12px_rgba(233,74,102,0.4)] font-semibold rounded-lg p-3"
          >
            Get Started
          </Link>
        </div>
      )}

      {/* Hamburger */}
      <div
        className={`md:hidden flex items-center cursor-pointer ${
          isMenuOpen ? "bg-white" : "bg-transparent"
        } p-2 rounded-lg transition-all ease-in-out`}
        onClick={() => {
          if (isMenuOpen) {
            setMenuSlide(false);
            setTimeout(() => setIsMenuOpen(false), 200);
            setProfileMenuMobile(false);
          } else {
            setMenuSlide(true);
            setIsMenuOpen(true);
            setProfileMenuMobile(false);
          }
        }}
      >
        <div className="space-y-1">
          <div
            className={`h-1 w-6 ${isMenuOpen ? "bg-mag" : "bg-white"}`}
          ></div>
          <div
            className={`h-1 w-6 ${isMenuOpen ? "bg-mag" : "bg-white"}`}
          ></div>
          <div
            className={`h-1 w-6 ${isMenuOpen ? "bg-mag" : "bg-white"}`}
          ></div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          className={`absolute top-24 left-0 w-full ${
            menuSlide ? "animate-slideIn" : "animate-slideOut"
          } bg-gradient-to-b overflow-hidden from-[rgb(187,67,89)] to-mag shadow-lg shadow-[rgba(0,0,0,0.5)] md:hidden flex flex-col items-start p-6 space-y-4`}
        >
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

          {siteData.isLogin ? (
            <>
              <div
                onClick={() => setProfileMenuMobile(!profileMenuMobile)}
                className="cursor-pointer text-[rgb(185,68,89)] font-semibold rounded-lg px-4 py-2 bg-white w-full text-left"
              >
                Hello, {siteData.user}
              </div>
              {profileMenuMobile && (
                <div className="w-full mt-2 bg-white text-black rounded-lg shadow-lg">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100 rounded-t-lg"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Settings
                  </Link>
                  <Link
                    to="/logout"
                    className="block px-4 py-2 hover:bg-gray-100 rounded-b-lg"
                  >
                    Logout
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="space-x-6">
              <Link to="/auth/login" className="text-lg">
                Sign In
              </Link>
              <Link
                to="/auth/register"
                className="text-[rgb(185,68,89)] [text-shadow:3px_3px_12px_rgba(233,74,102,0.4)] bg-white font-semibold rounded-lg px-4 py-2"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Header;
