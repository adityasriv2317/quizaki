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
import DBTable from "./DBTable";
import Analytics from "../Admin/Analytics";
import Quizzes from "../Admin/Quizzes";
import CreateQuiz from "../Admin/CreateQuiz";
import { Link } from "react-router-dom";

const dashboard = () => {
  return (
    <div>
      <div className="flex flex-col lg:flex-row my-10 space-y-6 lg:space-y-0">
        <div className="w-full lg:w-3/4 p-6 flex flex-row text-2xl rounded-xl shadow-xl text-white bg-[rgb(137,207,251)]">
          <div className="flex-1">
            <p className="font-semibold text-xl md:text-2xl lg:text-3xl [text-shadow:0_0_2px_black]">
              QUIZ TITLE
            </p>
            <p className="mt-2 text-sm md:text-base lg:text-lg">
              DESCRIPTION OF QUIZ & THE BACKGROUND IS THE COVER POSTER OF THE
              QUIZ
            </p>
            <div className="rounded-md py-1 px-2 mt-8 w-fit text-sm md:text-base lg:text-lg cursor-pointer hover:bg-yellow-300 text-black [text-shadow:0_0_0] bg-yellow-400">
              Learn More
            </div>
          </div>
          <img src={graphic} alt="Graphic" className="w-full lg:w-auto" />
        </div>

        <Link to="/admin/create" className="hidden md:block w-full lg:w-1/4 p-6">
          <img src={create} alt="Create" className="shadow-xl cursor-pointer" />
        </Link>
      </div>
      <DBTable />
    </div>
  );
};

const analytics = () => {
  return <Analytics />;
};

const quizzes = () => {
  return <Quizzes />;
};

const AdminDashboard = () => {
  const { isAdmin, adminID } = useAdminContext();
  const [admin, setAdmin] = useState("test@example.com");
  const [current, setCurrent] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);

  return isAdmin && admin === adminID ? (
    <div className="p-0">
      {/* Main Panels */}
      <div className="flex flex-col lg:flex-row h-auto lg:h-screen text-white">
        {/* Left Panel with Hamburger Menu */}
        <div
          className={`fixed lg:static border-r z-50 bg-gradient-to-b from-[rgb(183,67,88)] to-[rgb(242,75,105)] w-[70vw] lg:w-[18vw] h-screen p-4 text-center transform transition-transform duration-300 ease-in-out ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
        >
          <p className="text-4xl mt-6">QUIZAKI</p>
          <div className="flex flex-col mt-12 space-y-2 my-2">
            <p
              className={`py-1 cursor-pointer rounded-md text-xl ${
                current === "dashboard"
                  ? "bg-black"
                  : "hover:bg-[rgba(255,255,255,0.2)]"
              }`}
              onClick={() => {
                setCurrent("dashboard");
                setMenuOpen(false);
              }}
            >
              DASHBOARD
            </p>
            <p
              className={`py-1 cursor-pointer rounded-md text-xl ${
                current === "analytics"
                  ? "bg-black"
                  : "hover:bg-[rgba(255,255,255,0.2)]"
              }`}
              onClick={() => {
                setCurrent("analytics");
                setMenuOpen(false);
              }}
            >
              ANALYTICS
            </p>
            <p
              className={`py-1 cursor-pointer rounded-md text-xl ${
                current === "quizzes"
                  ? "bg-black"
                  : "hover:bg-[rgba(255,255,255,0.2)]"
              }`}
              onClick={() => {
                setCurrent("quizzes");
                setMenuOpen(false);
              }}
            >
              QUIZZES
            </p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="right p-4 w-full lg:w-[92vw] bg-gradient-to-b text-black from-[rgb(183,67,88)] to-[rgb(242,75,105)]">
          {/* Navbar */}
          <div className="rounded-lg flex shadow-xl flex-row justify-between items-center mt-5 bg-white">
            <div className="flex items-center md:pl-4">
              <button
                className="lg:hidden mx-4 z-50 text-3xl text-black"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? (
                  <FontAwesomeIcon icon={faTimes} />
                ) : (
                  <FontAwesomeIcon icon={faBars} />
                )}
              </button>
              {current === "dashboard" && (
                <p className="text-xl lg:text-2xl py-2 flex items-center">
                  Dashboard
                  <FontAwesomeIcon
                    className="text-blue-400 ml-2"
                    icon={faBorderAll}
                  />
                </p>
              )}
              {current === "analytics" && (
                <p className="text-xl lg:text-2xl px-4 py-2">Analytics</p>
              )}
              {current === "quizzes" && (
                <p className="text-xl lg:text-2xl px-4 py-2">Quizzes</p>
              )}
            </div>
            <div className="flex items-center hover:bg-[rgba(0,0,0,0.1)] cursor-pointer p-2">
              <p className="mr-2">ADMIN</p>
              <div className="h-8 aspect-square rounded-full bg-gray-500"></div>
            </div>
          </div>

          {/* Dynamic Content */}
          {current === "dashboard" && dashboard()}
          {current === "analytics" && analytics()}
          {current === "quizzes" && quizzes()}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  ) : (
    <div className="w-screen h-screen flex items-center justify-center text-xl">
      You are not authorized
    </div>
  );
};

export default AdminDashboard;
