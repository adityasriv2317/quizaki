import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useWebData } from "../Security/WebData";
import Carousel from "./Carousel";
import Events from "./Events";
import About from "./About";

const GoToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <button
        onClick={scrollToTop}
        className="bg-mag text-white p-3 rounded-full shadow-lg hover:bg-[rgb(212,76,101)] focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 15l7-7 7 7"
          />
        </svg>
      </button>
    </div>
  );
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileMenuMobile, setProfileMenuMobile] = useState(false);
  const [menuSlide, setMenuSlide] = useState(false);
  const [profileMenuDesktop, setProfileMenuDesktop] = useState(false);
  const { siteData } = useWebData();
  const menuRef = useRef(null);
  const { userLogout } = useWebData();

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
        <div
          onClick={() => {
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }}
          className="cursor-pointer logo font-oxanium text-2xl"
        >
          QUIZAKI
        </div>
        <div className="nav hidden md:flex ml-10 space-x-6">
          <div
            href=""
            className="cursor-pointer"
            onClick={() => {
              closeMenu;
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
          >
            Home
          </div>
          <div
            onClick={() => {
              const element = document.getElementById("features");
              if (element) {
                element.scrollIntoView({ behavior: "smooth" });
              }
              closeMenu;
            }}
            className="cursor-pointer"
          >
            Features
          </div>
          <div
            className="cursor-pointer"
            onClick={() => {
              const element = document.getElementById("testimonials");
              if (element) {
                element.scrollIntoView({ behavior: "smooth" });
              }
              closeMenu;
            }}
          >
            Testimonials
          </div>
          <div
            className="cursor-pointer"
            onClick={() => {
              const element = document.getElementById("news");
              if (element) {
                element.scrollIntoView({ behavior: "smooth" });
              }
              closeMenu;
            }}
          >
            News
          </div>
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
            <div
              onClick={() => {
                userLogout();
                setProfileMenuDesktop(false);
              }}
              className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg block px-4 py-2 cursor-pointer hover:bg-gray-100"
            >
              Logout
            </div>
          )}
        </div>
      ) : (
        <div className="hidden md:block right space-x-6 [text-shadow:3px_3px_12px_rgba(0,0,0,0.5)]">
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
          } bg-gradient-to-b overflow-hidden from-[rgb(187,67,89)] to-mag shadow-lg shadow-[rgba(0,0,0,0.5)] md:hidden flex flex-col items-center p-6 space-y-4`}
        >
          <div
            href=""
            className="cursor-pointer"
            onClick={() => {
              closeMenu;
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
          >
            Home
          </div>
          <div
            onClick={() => {
              const element = document.getElementById("features");
              if (element) {
                element.scrollIntoView({ behavior: "smooth" });
              }
              closeMenu;
            }}
            className="cursor-pointer"
          >
            Features
          </div>
          <div
            className="cursor-pointer"
            onClick={() => {
              const element = document.getElementById("testimonials");
              if (element) {
                element.scrollIntoView({ behavior: "smooth" });
              }
              closeMenu;
            }}
          >
            Testimonials
          </div>
          <div
            className="cursor-pointer"
            onClick={() => {
              const element = document.getElementById("news");
              if (element) {
                element.scrollIntoView({ behavior: "smooth" });
              }
              closeMenu;
            }}
          >
            News
          </div>
          <div className="bg-white w-full h-[1px]"></div>

          {siteData.isLogin ? (
            <>
              <div
                onClick={() => setProfileMenuMobile(!profileMenuMobile)}
                className="cursor-pointer text-center text-[rgb(185,68,89)] font-semibold rounded-lg px-4 py-2 bg-white w-full"
              >
                Hello, {siteData.user}
              </div>
              {profileMenuMobile && (
                <div
                  className="block w-full mt-2 bg-white text-black rounded-lg shadow-lg px-4 py-2 hover:bg-gray-100 rounded-b-lg"
                  onClick={() => {
                    userLogout();
                    closeMenu();
                    setProfileMenuMobile(false);
                  }}
                >
                  Logout
                </div>
              )}
            </>
          ) : (
            <div className="space-x-6">
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

      <GoToTop />
    </div>
  );
};

export default Header;
