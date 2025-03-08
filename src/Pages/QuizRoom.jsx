import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWebData } from "../Security/WebData";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const QuizRoom = () => {
  const { roomCode } = useParams();
  const { siteData } = useWebData();
  const navigate = useNavigate();

  const [countdown, setCountdown] = useState(30);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    // Update date every second
    const dateInterval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    // Countdown logic
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // Listen for quiz start event from the admin
    socket.on("startQuiz", () => {
      navigate(`/quiz/${roomCode}`); // Redirect to quiz page
    });

    return () => {
      clearInterval(dateInterval);
      clearInterval(countdownInterval);
      socket.off("startQuiz");
    };
  }, [roomCode, navigate]);

  return (
    <div className="h-screen w-screen flex flex-col bg-gradient-to-br from-[#b74358] to-[#812939] text-white">
      {/* Top Bar */}
      <div className="w-full p-4 flex flex-col md:flex-row gap-3 justify-center">
        <div
          className="font-oxanium md:hidden text-2xl"
          onClick={() => {
            navigate("/");
          }}
        >
          QUIZAKI
        </div>
        <div className="bg-white text-black p-4 shadow-lg text-center w-full max-w-sm rounded-lg font-oxanium">
          <span className="text-lg md:text-xl font-semibold">
            Room Code: {roomCode || "N/A"}
          </span>
          <div className="mt-2">
            <span className="text-sm md:text-lg">
              {currentDate.toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>

      {/* Main Section */}
      <div className="flex flex-col md:flex-row flex-grow gap-4 px-4 pb-4 items-center md:items-stretch">
        {/* Left Section - Countdown */}
        <div className="w-full md:w-1/4 flex flex-col justify-center items-center rounded-md bg-white text-black p-6 shadow-md">
          <h3 className="text-xl md:text-2xl font-bold">Quiz Starts In</h3>
          <p className="text-3xl md:text-4xl font-semibold text-[#b74358]">
            {countdown}s
          </p>
        </div>

        {/* Right Section - Loading Animation */}
        <div className="w-full md:w-3/4 h-full flex flex-col justify-center gap-10 font-mono bg-white rounded-md items-center p-6">
          <div className="animate-spin rounded-full h-16 w-16 md:h-20 md:w-20 border-t-4 border-gray-700"></div>
          {/* Link to game */}
          <a
            href="https://poki.com/"
            target="_blank"
            rel="noreferrer"
            className="bg-[#b74358] rounded-md shadow-md p-3 md:p-4 uppercase text-sm md:text-base"
          >
            Play a Quick Game
          </a>
        </div>
      </div>
    </div>
  );
};

export default QuizRoom;
