import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import { useWebData } from "../Security/WebData";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileMenuMobile, setProfileMenuMobile] = useState(false);
  const [menuSlide, setMenuSlide] = useState(false);
  const [profileMenuDesktop, setProfileMenuDesktop] = useState(false);
  const { siteData } = useWebData();
  const menuRef = useRef(null);

  const menuClick = () => {
    if (isMenuOpen) {
      setMenuSlide(false);
      setTimeout(() => setIsMenuOpen(false), 200);
      setProfileMenuMobile(false);
    } else {
      setMenuSlide(true);
      setIsMenuOpen(true);
      setProfileMenuMobile(false);
    }
  };

  const closeMenu = () => {
    setMenuSlide(false);
    setTimeout(() => setIsMenuOpen(false), 200);
    setProfileMenuMobile(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full flex justify-between text-white items-center py-2 md:py-4 z-10 bg-transparent">
      {/* Left */}
      <div className="left flex items-center [text-shadow:3px_3px_12px_rgba(0,0,0,0.5)]">
        <div className="logo font-oxanium text-2xl">QUIZAKI</div>
        <div className="nav hidden md:flex ml-10 space-x-6">
          <a href="#" className="cursor-pointer" onClick={closeMenu}>
            Home
          </a>
          <a href="#features" className="cursor-pointer" onClick={closeMenu}>
            Features
          </a>
          <a href="#testimonials" className="cursor-pointer" onClick={closeMenu}>
            Testimonials
          </a>
          <a href="#news" className="cursor-pointer" onClick={closeMenu}>
            News
          </a>
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
        onClick={menuClick}
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
          ref={menuRef}
          className={`absolute top-24 left-0 w-full ${
            menuSlide ? "animate-slideIn" : "animate-slideOut"
          } bg-gradient-to-b overflow-hidden from-[rgb(187,67,89)] to-mag shadow-lg shadow-[rgba(0,0,0,0.5)] md:hidden flex flex-col items-start p-6 space-y-4`}
        >
          <a href="#" className="text-lg" onClick={closeMenu}>
            Home
          </a>
          <a href="#features" className="text-lg" onClick={closeMenu}>
            Features
          </a>
          <a href="#testimonials" className="text-lg" onClick={closeMenu}>
            Testimonials
          </a>
          <a href="#news" className="text-lg" onClick={closeMenu}>
            News
          </a>
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
                    onClick={closeMenu}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={closeMenu}
                  >
                    Settings
                  </Link>
                  <Link
                    to="/logout"
                    className="block px-4 py-2 hover:bg-gray-100 rounded-b-lg"
                    onClick={closeMenu}
                  >
                    Logout
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="space-x-6">
              <Link to="/auth/login" className="text-lg" onClick={closeMenu}>
                Sign In
              </Link>
              <Link
                to="/auth/register"
                className="text-[rgb(185,68,89)] [text-shadow:3px_3px_12px_rgba(233,74,102,0.4)] bg-white font-semibold rounded-lg px-4 py-2"
                onClick={closeMenu}
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
