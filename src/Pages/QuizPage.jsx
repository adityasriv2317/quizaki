import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWebData } from "../Security/WebData";
import { io } from "socket.io-client";
import CountdownTimer from "../assets/CountdownTimer";
import { useMediaQuery } from "react-responsive";

const socket = io("http://localhost:5000");

// Pass props
const DesktopLayout = ({
  siteData,
  progress,
  question,
  selectedOption,
  setSelectedOption,
}) => {
  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-[#b74358] to-[#812939] text-white p-4">
      {/* Progress Bar */}
      <div className="w-full md:w-1/2 mx-auto h-3 p-0.5 bg-gray-300 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-red-400 transition-all rounded-md"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Content Container */}
      <div className="flex flex-col md:flex-row flex-grow gap-4 items-center md:items-stretch">
        {/* Left Panel (Fixed Height on Desktop) */}
        <div className="w-full md:w-3/12 h-auto md:h-[80vh] md:mb-0 md:mt-auto bg-gray-200 text-black p-6 shadow-md rounded-md flex flex-col justify-between items-center">
          {/* Timer */}
          <CountdownTimer
            duration={30}
            onTimeUp={() => console.log("Time's up!")}
          />

          {/* Score */}
          <div className="bg-violet-200 font-mono font-light text-lg md:text-2xl px-4 py-2 rounded-md mt-4">
            <span className="uppercase">
              score : {siteData?.user?.score || 0}
            </span>
          </div>

          {/* User Details */}
          <div className="text-center mb-20">
            <p className="text-xl md:text-2xl">{siteData?.user || "Guest"}</p>
            <p className="text-sm md:text-base">{siteData?.email || "N/A"}</p>
          </div>
        </div>

        {/* Right Panel - Question */}
        <div className="w-full md:w-3/4 bg-transparent text-black p-4 md:p-6 rounded-md flex flex-col">
          {question && (
            <>
              {/* Question Text */}
              <div className="shadow-md p-4 bg-red-100 rounded-md mb-4 h-auto md:h-full">
                <h3 className="text-lg md:text-2xl font-semibold mb-2">
                  {question.text}
                </h3>
                {question.image && (
                  <img
                    src={question.image}
                    alt="Question"
                    className="w-full rounded-md mb-4"
                  />
                )}
              </div>

              {/* Answer Options */}
              <div className="mt-auto">
                <p className="text-lg text-white font-light mb-4 ml-4 text-center md:text-left">
                  Choose the Correct Option
                </p>
                <div className="grid grid-cols-1 gap-4 mx-auto max-w-[90%] md:max-w-[90%]">
                  {question.options.map((option, index) => (
                    <button
                      key={index}
                      className={`p-3 md:p-4 rounded-md shadow-md text-base md:text-lg font-semibold transition-all ${
                        selectedOption === option
                          ? "bg-red-200 text-black"
                          : "bg-[rgb(244,230,230)]"
                      }`}
                      onClick={() => setSelectedOption(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const MobileLayout = ({
  progress,
  question,
  selectedOption,
  setSelectedOption,
  countdown,
}) => {
  return (
    // Main container with full height and gray background
    <div className="min-h-screen w-full bg-gray-300 flex flex-col">
      {/* Header Section: Displays current question number and progress bar */}
      <div className="p-4 bg-[rgb(185,68,89)] text-white shadow-md">
        <h3 className="text-lg font-semibold text-left mt-4">
          Question : {progress / 10}
        </h3>
        {/* Progress bar for question navigation */}
        <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden mt-2">
          <div
            className="h-full bg-red-400 rounded-md transition-all ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Main Content Section: Displays the question and image if available */}
      <div className="flex-grow flex flex-col p-4">
        {question && (
          <>
            {/* Question text */}
            <h3 className="text-lg font-semibold mb-2">{question.text}</h3>

            {/* Display question image if provided */}
            {question.image && (
              <img
                src={question.image}
                alt="Question"
                className="w-full rounded-md mb-4"
              />
            )}
          </>
        )}
      </div>

      {/* Options Section: Displays answer choices and a timer progress bar */}
      <div className="bg-white py-6 px-6 rounded-t-[50px] shadow-md">
        {/* prompt for selecting correct option */}
        <p className="text-xl font-poppins font-bold text-center mb-8 text-gray-800">
          Select the Correct Option
        </p>
        {/* List of answer options */}
        <div className="grid grid-cols-1 gap-6">
          {question?.options.map((option, index) => (
            <button
              key={index}
              className={`flex items-center p-3 border rounded-full text-xl font-bold transition-all ${
                selectedOption === option
                  ? "bg-gray-50 text-black border-red-400" // Highlight selected option
                  : "bg-gray-100 border-gray-200" // Default option style
              }`}
              onClick={() => setSelectedOption(option)}
            >
              {/* Display option letter (A, B, C, D) */}
              <span
                className={`mr-5 font-semibold text-lg text-center rounded-full px-3 py-1 ${
                  selectedOption === option
                    ? "bg-red-400 text-white"
                    : "bg-white shadow-sm text-gray-800"
                }`}
              >
                {String.fromCharCode(65 + index)}
              </span>
              {option}
            </button>
          ))}
        </div>

        {/* Timer progress bar (turns red in last 5 seconds) */}
        <div className="w-full h-2.5 mt-8 mb-4 bg-transparent border-2 border-black rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ease ${
              countdown <= 5 ? "bg-red-500" : "bg-green-400"
            }`}
            style={{ width: `${(countdown / 30) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const QuizPage = () => {
  const navigate = useNavigate();
  const { siteData } = useWebData();
  const [countdown, setCountdown] = useState(30);
  const [progress, setProgress] = useState(0);
  const [question, setQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const totalQuestions = 10;

  const isMobile = useMediaQuery({ maxWidth: 900 });

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    socket.on("newQuestion", (data) => {
      setQuestion(data);
      setCountdown(30);
      setProgress(((data.index + 1) / totalQuestions) * 100);
    });

    socket.on("endQuiz", () => {
      navigate("/results");
    });

    return () => {
      clearInterval(countdownInterval);
      socket.off("newQuestion");
      socket.off("endQuiz");
    };
  }, [navigate]);

  return isMobile ? (
    <MobileLayout
      progress={progress}
      question={question}
      selectedOption={selectedOption}
      setSelectedOption={setSelectedOption}
      countdown={countdown}
    />
  ) : (
    <DesktopLayout
      siteData={siteData}
      progress={progress}
      question={question}
      selectedOption={selectedOption}
      setSelectedOption={setSelectedOption}
    />
  );
};

export default QuizPage;