import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWebData } from "../Security/WebData";
import axios from "axios";

const QuizRoom = () => {
  const { siteData } = useWebData();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const countRef = useRef(30);
  const [countdown, setCountdown] = useState(30);
  const [currentDate, setCurrentDate] = useState(new Date());
  const roomCode = siteData.code;

  async function getQuizData(roomCode) {
    try {
      const response = await axios.get(
        "https://ccc-quiz.onrender.com/admin/fetchQuiz",
        { params: { email: "saurabhsri.mau@gmail.com" } }
      );
      // find the quiz with the given room code
      const quiz = response.data.find((q) => q.quizId === roomCode);
      if (quiz) {
        setData(quiz);
        // calculate countdown time
        if (quiz.startQuizTime) {
          const startTime = new Date(quiz.startQuizTime).getTime();
          const now = new Date().getTime();
          const timeLeft = Math.max(Math.floor((startTime - now) / 1000), 0);
          setCountdown(timeLeft);
          countRef.current = timeLeft;
        }
      } else {
        console.log(`No quiz found for room code: ${roomCode}`);
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!roomCode) return;

    const dateInterval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev && prev > 0) {
          countRef.current = prev - 1;
          return prev - 1;
        } else {
          clearInterval(countdownInterval);
          // Only navigate if we have valid quiz data
          if (data && data.questions && data.questions.length > 0) {
            navigate(`/quiz/${roomCode}`, { 
              state: { 
                quizData: data
              } 
            });
          }
          return 0;
        }
      });
    }, 1000);

    return () => {
      clearInterval(dateInterval);
      clearInterval(countdownInterval);
    };
  }, [roomCode, navigate, data]); // Add data to dependencies

  useEffect(() => {
    if (roomCode) {
      getQuizData(roomCode);
    }
  }, [roomCode]);

  return (
    <div className="h-screen w-screen flex flex-col bg-gradient-to-br from-[#b74358] to-[#812939] text-white">
      {/* Top Bar */}
      <div className="w-full p-4 flex flex-row gap-3 justify-center">
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
      <div className="flex flex-col md:flex-row flex-grow gap-3 md:gap-4 px-4 pb-4 items-center md:items-stretch">
        {/* Left Section - Countdown */}
        <div className="w-full md:w-1/4 flex flex-col justify-center items-center rounded-md bg-white text-black p-2 md:p-6 shadow-md">
          {loading ? (
            // spinner
            <div className="animate-spin rounded-full h-12 my-2 md:my-0 w-12 md:h-20 md:w-20 border-t-4 border-red-700"></div>
          ) : (
            <div className="flex flex-col h-full items-center justify-evenly text-center">
              {/* quiz data */}
              <div className="mt-2 text-3xl font-semibold font-oxanium">
                <p>{data.quizTitle}</p>
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold">
                  Quiz Starts In
                </h3>
                <p className="text-3xl md:text-4xl font-semibold text-[#b74358]">
                  {countdown}s
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Section - Loading Animation */}
        <iframe
          src="https://sonic-boomgame.vercel.app/"
          className="w-full md:w-3/4 h-full flex flex-col justify-center gap-10 font-mono bg-white rounded-md items-center"
          title="Sonic Boom Game"
          sandbox="allow-scripts allow-same-origin"
        ></iframe>
      </div>
    </div>
  );
};

export default QuizRoom;
