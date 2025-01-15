import React, { useState, useEffect } from "react";
import { useAdminContext } from "../Security/AdminContext";
import Footer from "../Landing/Footer";
import create from "../assets/create.svg";
import graphic from "/graphics/vector1.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBorderAll } from "@fortawesome/free-solid-svg-icons";

const DBTable = () => {
  const [data, setData] = useState([]); 
  const [isLoading, setIsLoading] = useState(true); 
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Start loading
      try {
        const response = await fetch("https://api.example.com/quizzes"); // Replace with your API endpoint
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    fetchData();
  }, []);

  // Pagination calculations
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(data.length / rowsPerPage);

  // Handlers for pagination
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="p-4 font-oxanium">
      <table className="min-w-full border-collapse border-spacing-0">
        <thead>
          <tr className="">
            <th className="font-medium px-4 py-2 bg-[rgba(246,200,208,0.7)] border-b border-r border-mag rounded-tl-lg">
              Quiz ID
            </th>
            <th className="font-medium px-4 py-2 bg-[rgba(246,200,208,0.7)] border-b border-mag border-r">
              Quiz Title
            </th>
            <th className="font-medium px-4 py-2 bg-[rgba(246,200,208,0.7)] border-b border-mag rounded-tr-lg">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            // Loading animation row
            <tr>
              <td colSpan="3" className="text-center py-4">
                <div className="flex justify-center items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
                  <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse delay-150"></div>
                  <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse delay-300"></div>
                </div>
              </td>
            </tr>
          ) : currentRows.length > 0 ? (
            currentRows.map((row, index) => (
              <tr key={index}>
                <td className="px-4 py-2 border-t">{row.quizID}</td>
                <td className="px-4 py-2 border-t">{row.quizTitle}</td>
                <td className="px-4 py-2 border-t">{row.status}</td>
              </tr>
            ))
          ) : (
            // Empty state if no data is available
            <tr>
              <td
                colSpan="3"
                className="text-center py-4 bg-[rgba(246,200,208,0.7)] rounded-b-lg text-gray-500"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 disabled:hover:bg-blue-500 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="flex items-center">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 disabled:hover:bg-blue-500 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

const dashboard = () => {
  return (
    <div className="">
      <div className="flex flex-row my-10">
        <div className="w-3/4 p-6 flex text-2xl rounded-xl shadow-xl text-white bg-[rgb(137,207,251)]">
          <div>
            <p className="font-semibold text-3xl [text-shadow:0_0_2px_black]">QUIZ TITLE</p>
            <p className="mt-2">
              DESCRIPTION OF QUIZ & THE BACKGROUND IS THE COVER POSTER OF THE
              QUIZ
            </p>
            <div className="rounded-md py-1 px-2 mt-8 w-fit text-lg cursor-pointer hover:bg-yellow-300 text-black [text-shadow:0_0_0] bg-yellow-400">Learn More</div>
          </div>
          <img src={graphic} className="" alt="" />
        </div>

        <div className="w-1/4 p-6">
          <img src={create} alt="" className="shadow-xl cursor-pointer" />
        </div>
      </div>

      {/* table of db */}
      <DBTable />
    </div>
  );
};

const analytics = () => {
  return <div className="flex my-10">analytics</div>;
};

const quizzes = () => {
  return <div className="flex my-10">quizzes</div>;
};

const AdminDashboard = () => {
  const { isAdmin, adminID } = useAdminContext();
  const [admin, setAdmin] = useState("admin@ccc.com");
  const [current, setCurrent] = useState("dashboard");

  return isAdmin && admin === adminID ? (
    // render if admin is authorized
    <div className="p-0">
      {/* main panels */}
      <div className="flex flex-row h-screen text-white space-x-[2px]">
        {/* left panel with constant acitvity */}
        <div className="font-oxanium left w-[18vw] text-center p-4 bg-gradient-to-b from-[rgb(183,67,88)] to-[rgb(242,75,105)]">
          <p className="text-4xl mt-6">QUIZAKI</p>

          <div className="flex flex-col mt-12 space-y-2 my-2">
            <p
              className={`py-1 cursor-pointer rounded-md text-xl ${
                current === "dashboard"
                  ? "bg-black"
                  : "hover:bg-[rgba(255,255,255,0.2)]"
              }`}
              onClick={() => setCurrent("dashboard")}
            >
              DASHBOARD
            </p>
            <p
              className={`py-1 cursor-pointer rounded-md text-xl ${
                current === "analytics"
                  ? "bg-black"
                  : "hover:bg-[rgba(255,255,255,0.2)]"
              }`}
              onClick={() => setCurrent("analytics")}
            >
              ANALYTICS
            </p>
            <p
              className={`py-1 cursor-pointer rounded-md text-xl ${
                current === "quizzes"
                  ? "bg-black"
                  : "hover:bg-[rgba(255,255,255,0.2)]"
              }`}
              onClick={() => setCurrent("quizzes")}
            >
              QUIZZES
            </p>
          </div>
        </div>

        {/* right panel that changes with buttons default adminDB */}
        <div className="right p-4 w-[92vw] bg-gradient-to-b text-black from-[rgb(183,67,88)] to-[rgb(242,75,105)]">
          {/* navbar */}
          <div className="rounded-lg flex shadow-xl flex-row justify-between items-center mt-5 bg-white">
            {current === "dashboard" && <p className="ml-2 px-4 py-2  text-2xl"><FontAwesomeIcon className="text-blue-400" icon={faBorderAll} /> Dashboard</p>}
            {current === "analytics" && <p className="ml-2 px-4 py-2  text-2xl">Analytics</p>}
            {current === "quizzes" && <p className="ml-2 px-4 py-2  text-2xl">Quizzes</p>}
            <div className="flex flex-row hover:bg-[rgba(0,0,0,0.1)] cursor-pointer p-2 space-x-2">
              <p className="items-center flex">ADMIN</p>
              <div className="h-8 aspect-square rounded-full bg-gray-500"></div>
            </div>
          </div>

          {current === "dashboard" && dashboard()}
          {current === "analytics" && analytics()}
          {current === "quizzes" && quizzes()}
        </div>
      </div>
      {/* footer */}
      <Footer />
    </div>
  ) : (
    <div className="w-screen h-screen">You are not authorized</div>
  );
};

export default AdminDashboard;
