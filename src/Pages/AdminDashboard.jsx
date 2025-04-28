import React, { useState } from "react";
import { useAdminContext } from "../Security/AdminContext";
import Footer from "../Landing/Footer";
import create from "../assets/create.svg";
import graphic from "/graphics/vector1.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBorderAll,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { CirclePlus } from "lucide-react";
import DBTable from "./DBTable";
import Analytics from "../Admin/Analytics";
import { Link, useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAdmin, adminID, logout } = useAdminContext();
  const [current, setCurrent] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const handleQuizSelect = (quiz) => {
    setSelectedQuiz(quiz);
    setCurrent("analytics");
  };

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const renderDashboard = () => (
    <div>
      <div className="flex flex-col lg:flex-row my-9 space-y-6 lg:space-y-0">
        <div className="w-full lg:w-3/4 p-6 flex flex-row text-2xl rounded-xl shadow-xl text-white bg-[rgb(137,207,251)]">
          <div className="flex-1">
            <p className="font-semibold text-xl md:text-2xl lg:text-3xl [text-shadow:0_0_2px_black]">
              {selectedQuiz?.title || "QUIZ TITLE"}
            </p>
            <p className="mt-2 text-sm md:text-base lg:text-lg">
              {selectedQuiz?.description || "DESCRIPTION OF QUIZ"}
            </p>
            <div className="rounded-md py-1 px-2 mt-8 w-fit text-sm md:text-base lg:text-lg cursor-pointer hover:bg-yellow-300 text-black [text-shadow:0_0_0] bg-yellow-400">
              Learn More
            </div>
          </div>
          <img src={graphic} alt="Graphic" className="w-full lg:w-auto" />
        </div>

        <Link
          to="/admin/create"
          className="hidden md:block w-full lg:w-1/4 p-6"
        >
          <img src={create} alt="Create" className="shadow-xl cursor-pointer" />
        </Link>
      </div>
      <DBTable onQuizSelect={handleQuizSelect} />
    </div>
  );

  const renderContent = () => {
    switch (current) {
      case "dashboard":
        return renderDashboard();
      case "analytics":
        return <Analytics selectedQuiz={selectedQuiz} />;
      case "quizzes":
        return <DBTable />;
      default:
        return renderDashboard();
    }
  };

  if (!isAdmin || !adminID) {
    return (
      <div className="w-screen h-screen flex items-center justify-center text-xl">
        You are not authorized
      </div>
    );
  }

  return (
    <div className="p-0">
      <div className="flex flex-col lg:flex-row h-auto lg:h-screen text-white">
        {/* Left Panel */}
        <div
          className={`fixed lg:static border-r z-50 bg-gradient-to-b from-[rgb(183,67,88)] to-[rgb(242,75,105)] w-[70vw] lg:w-[18vw] h-screen p-4 text-center transform transition-transform duration-300 ease-in-out ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
        >
          <p className="text-4xl mt-6">QUIZAKI</p>
          <div className="flex flex-col mt-12 space-y-2 my-2">
            {["dashboard", "analytics", "quizzes"].map((item) => (
              <p
                key={item}
                className={`py-1 cursor-pointer rounded-md text-xl capitalize ${
                  current === item
                    ? "bg-black"
                    : "hover:bg-[rgba(255,255,255,0.2)]"
                }`}
                onClick={() => {
                  setCurrent(item);
                  setMenuOpen(false);
                }}
              >
                {item}
              </p>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div className="right p-4 w-full lg:w-[92vw] bg-gradient-to-b text-black from-[rgb(183,67,88)] to-[rgb(242,75,105)]">
          {/* Navbar */}
          <div className="rounded-lg flex shadow-xl flex-row justify-between items-center mt-5 bg-white">
            <div className="flex items-center md:pl-4">
              <button
                className={`lg:hidden mx-4 z-50 text-3xl ${
                  menuOpen ? "text-white" : "text-black"
                }`}
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
              </button>
              <p className="text-xl lg:text-2xl px-4 py-2 flex items-center capitalize">
                {current}
                {current === "dashboard" && (
                  <FontAwesomeIcon
                    className="text-blue-400 ml-2"
                    icon={faBorderAll}
                  />
                )}
              </p>
            </div>

            {/* Admin Dropdown */}
            <div className="relative flex flex-row gap-4">
              <Link
                to="/admin/create"
                className="p-1 text-gray-600 h-full block md:hidden hover:bg-slate-400 my-auto cursor-pointer rounded-md text-xl hover:bg-[rgba(255,255,255,0.2)]"
                onClick={() => setMenuOpen(false)}
              >
                <CirclePlus />
              </Link>
              <div
                className="flex items-center hover:bg-[rgba(0,0,0,0.1)] cursor-pointer p-2 rounded-r-lg"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <div className="h-8 aspect-square rounded-full bg-gray-500"></div>
                <p className="mx-2">ADMIN</p>
                <svg
                  className={`w-4 h-4 transform transition-transform ${
                    showDropdown ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              {showDropdown && (
                <div className="absolute right-0 mt-10 w-48 bg-white rounded-lg shadow-xl z-50">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-gray-700">
                      Signed in as
                      <br />
                      <span className="font-medium">{adminID}</span>
                    </div>
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Dynamic Content */}
          {renderContent()}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
