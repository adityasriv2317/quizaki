import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useWebData } from "../Security/WebData";
import CountdownTimer from "../assets/CountdownTimer";
import { useMediaQuery } from "react-responsive";
import { Lock, Expand, X } from "lucide-react";
import Spinner from "../assets/Spinner";
import axios from "axios";
import { useQuiz } from "../Context/QuizContext";
import { useAuth } from "../Security/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUndo } from "@fortawesome/free-solid-svg-icons";
import ResultLayout from "./Result";

// Pass props
const DesktopLayout = ({
  siteData,
  progress,
  question,
  selectedOption,
  isAnswerLocked,
  setSelectedOption,
  onResetSelection, // Add onResetSelection prop
  onTimeUp,
  countdown,
  score,
  streak,
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
            onTimeUp={onTimeUp}
            currentTime={countdown}
          />

          {/* Score Section */}
          <div className="bg-violet-200 font-mono font-light text-lg md:text-2xl px-4 py-2 rounded-md mt-4">
            <span className="uppercase">score : {score}</span>
            <div className="text-sm mt-2">streak: {streak}</div>
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
                <h3 className="text-lg md:text-2xl text-center font-semibold mb-2">
                  {question.questionText}
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
                <div className="flex items-center justify-between mb-4">
                  {" "}
                  {/* Added mb-4 for spacing */}
                  <p className="text-lg text-white font-light ml-4 text-center md:text-left">
                    Choose the Correct Option
                  </p>
                  {/* Reset Button - Show only when an option is selected and locked */}
                  {/* {selectedOption && isAnswerLocked && ( */}
                  <button
                    onClick={onResetSelection} // Use the passed handler
                    className="bg-red-300 text-black/70 font-semibold px-4 py-2 my-auto rounded-md shadow-md transition-all hover:bg-red-400 mr-4"
                  >
                    <FontAwesomeIcon icon={faUndo} className="mr-2" />
                    Reset
                  </button>
                  {/* )} */}
                </div>
                <div className="grid grid-cols-1 gap-4 mx-auto max-w-[90%] md:max-w-[90%]">
                  {question.options.map((option, index) => (
                    <button
                      key={index}
                      // Disable other options when one is selected and locked
                      disabled={isAnswerLocked && selectedOption !== option}
                      className={`py-3 px-20 md:py-4 rounded-md shadow-md flex flex-row items-center justify-between text-base md:text-lg font-semibold transition-all ${
                        selectedOption === option
                          ? "bg-red-200 text-black ring-2 ring-red-500" // Highlight selected/locked
                          : "bg-[rgb(244,230,230)]"
                      } ${
                        // Dim other options when one is locked
                        isAnswerLocked && selectedOption !== option
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-red-100" // Add hover effect only if not locked
                      }`}
                      onClick={() => setSelectedOption(option)}
                    >
                      {option}
                      {/* Show lock icon only on the selected option when locked */}
                      {selectedOption === option && isAnswerLocked && (
                        <Lock size={20} />
                      )}
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

const MobLayout = ({
  progress,
  question,
  selectedOption,
  setSelectedOption,
  isAnswerLocked,
  setIsAnswerLocked, // Keep this if needed elsewhere, but reset handles its part
  onResetSelection, // Add onResetSelection prop
  onTimeUp,
  countdown,
  score,
  currentQuestionIndex, // Add this prop
}) => {
  // Remove the quesNo state and useEffect
  return (
    <div className="min-h-screen w-full bg-gray-300 flex flex-col">
      <div className="p-4 bg-[rgb(185,68,89)] text-white shadow-md">
        <h3 className="text-lg flex flex-row justify-between w-full font-semibold text-left mt-4">
          <span>Question : {currentQuestionIndex + 1}</span>
          <span>Score: {score}</span>
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
            <h3 className="text-2xl font-poppins text-center font-semibold mb-2">
              {question.questionText}
            </h3>

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

        <div className="opacity-10 fixed -right-72">
          <CountdownTimer
            duration={30}
            onTimeUp={onTimeUp}
            currentTime={countdown}
            isTime
          />
        </div>
      </div>

      {/* Options Section: Displays answer choices and a timer progress bar */}
      <div className="bg-white py-6 px-6 rounded-t-[50px] shadow-md">
        <div className="flex justify-between items-center mb-8">
          <p className="text-xl font-poppins font-bold text-gray-800">
            Select the Correct Option
          </p>
          {/* Reset Button - Show only when an option is selected and locked */}
          {/* {selectedOption && isAnswerLocked && ( */}
          <button
            onClick={onResetSelection} // Use the passed handler
            className="px-3 py-1.5 bg-red-50 text-black/70 rounded-full transition-all hover:bg-red-100"
          >
            <FontAwesomeIcon icon={faUndo} className="mr-1" />
            Reset
          </button>
          {/* )} */}
        </div>
        {/* List of answer options */}
        <div className="grid grid-cols-1 gap-6">
          {question?.options.map((option, index) => (
            <button
              key={index}
              // Disable other options when one is selected and locked
              disabled={isAnswerLocked && selectedOption !== option}
              className={`flex items-center p-3 border rounded-full text-xl font-bold transition-all ${
                selectedOption === option
                  ? "bg-gray-50 text-black border-red-400 ring-2 ring-red-500" // Highlight selected/locked
                  : "bg-gray-100 border-gray-200" // Default option style
              } ${
                // Dim other options when one is locked
                isAnswerLocked && selectedOption !== option
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-200" // Add hover effect only if not locked
              }`}
              onClick={() => setSelectedOption(option)} // Pass only option
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
              {/* Show lock icon only on the selected option when locked */}
              {selectedOption === option && isAnswerLocked && (
                <Lock size={20} className="ml-auto mr-2" /> // Adjusted margin
              )}
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
  const location = useLocation();
  const navigate = useNavigate();
  const { siteData } = useWebData();
  const { updateQuizState } = useQuiz();
  const [globalStreak, setGlobalStreak] = useState({
    score: 0,
    streak: 0,
  });

  // Consolidated quiz state
  const [quizState, setQuizState] = useState({
    countdown: 30,
    progress: 0,
    currentQuestionIndex: 0,
    isAnswerLocked: false,
    selectedOption: null,
    question: null,
    displayScore: 0,
    streak: 0,
  });

  // Statistics state
  const [stats, setStats] = useState({
    actualScore: 0,
    timeBonusTotal: 0,
    correctCount: 0,
    timeSpent: [],
    answers: [],
  });

  // Results state
  const [results, setResults] = useState({
    showResults: false,
    quizStats: {
      totalScore: 0,
      timeBonus: 0,
      correctAnswers: 0,
      totalQuestions: 0,
      accuracy: 0,
      averageTime: 0,
    },
  });

  const quizData = location.state?.quizData;
  const currentQuiz = Array.isArray(quizData) ? quizData[0] : quizData;
  const isMobile = useMediaQuery({ maxWidth: 900 });

  // Update question and progress
  useEffect(() => {
    if (!currentQuiz?.questions) return;

    const currentQuestion =
      currentQuiz.questions[quizState.currentQuestionIndex];
    setQuizState((prev) => ({
      ...prev,
      question: currentQuestion,
      progress:
        ((quizState.currentQuestionIndex + 1) / currentQuiz.questions.length) *
        100,
    }));
  }, [currentQuiz, quizState.currentQuestionIndex]);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setQuizState((prev) => {
        if (prev.countdown <= 1) {
          clearInterval(timer); // Clear interval before handling time up
          handleTimeUp();
          return { ...prev, countdown: 30 };
        }
        return { ...prev, countdown: prev.countdown - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizState.currentQuestionIndex]);

  // Add this function before handleTimeUp
  const calculateFinalStats = () => {
    const totalQuestions = currentQuiz.questions.length;
    const finalScore = stats.actualScore;

    return {
      totalScore: finalScore,
      timeBonus: stats.timeBonusTotal,
      correctAnswers: stats.correctCount,
      totalQuestions,
      accuracy: Math.round((stats.correctCount / totalQuestions) * 100),
      averageTime: Math.round(
        stats.timeSpent.reduce((total, time) => total + time, 0) /
          totalQuestions
      ),
    };
  };

  const handleTimeUp = () => {
    if (!currentQuiz?.questions) return;

    if (!quizState.selectedOption) {
      setStats((prev) => ({
        ...prev,
        timeSpent: [...prev.timeSpent, 30],
      }));
    }

    if (quizState.currentQuestionIndex < currentQuiz.questions.length - 1) {
      const nextIndex = quizState.currentQuestionIndex + 1;
      setTimeout(() => {
        setQuizState((prev) => ({
          ...prev,
          currentQuestionIndex: nextIndex,
          selectedOption: null,
          isAnswerLocked: false,
          countdown: 30,
        }));
      }, 1000);
    } else {
      // Calculate final stats including the last question
      const lastAnswer = stats.answers[stats.answers.length - 1];
      const totalQuestions = currentQuiz.questions.length;

      // setGlobalStreak((prev) => {
      //   const newStreak = lastAnswer?.isCorrect? prev + 1 : 0;
      //   return newStreak;
      // });
      setResults({
        showResults: true,
        quizStats: {
          totalScore: stats.actualScore + (lastAnswer?.questionScore || 0),
          timeBonus: stats.timeBonusTotal + (lastAnswer?.timeBonus || 0),
          correctAnswers: stats.correctCount + (lastAnswer?.isCorrect ? 1 : 0),
          totalQuestions,
          accuracy: Math.round(
            ((stats.correctCount + (lastAnswer?.isCorrect ? 1 : 0)) /
              totalQuestions) *
              100
          ),
          averageTime: Math.round(
            stats.timeSpent.reduce((total, time) => total + time, 0) /
              totalQuestions
          ),
        },
      });
    }
  };

  // Add this handler function
  // const handleResetSelection = () => {
  //   if (quizState.isAnswerLocked) {
  //     // Only allow reset if an answer was locked by selection
  //     setQuizState((prev) => ({
  //       ...prev,
  //       selectedOption: null,
  //       isAnswerLocked: false, // Unlock to allow re-selection
  //     }));
  //   }
  // };

  const handleResetSelection = () => {
    if (quizState.isAnswerLocked) {
      // Find the current answer in stats to remove its effects
      const currentAnswer = stats.answers[stats.answers.length - 1];

      // Reset quiz state including score and streak
      setQuizState((prev) => ({
        ...prev,
        selectedOption: null,
        isAnswerLocked: false,
      }));

      setTimeout(() => {
        setQuizState((prev) => ({
          ...prev,
          displayScore: prev.displayScore - currentAnswer.questionScore,
          streak: prev.streak
            ? prev.streak - (currentAnswer.isCorrect ? 1 : 0)
            : 0,
        }));
      }, quizState.countdown * 1000);

      // Update stats by removing the last answer
      setStats((prev) => ({
        ...prev,
        actualScore: prev.actualScore - currentAnswer.questionScore,
        timeBonusTotal: prev.timeBonusTotal - currentAnswer.timeBonus,
        correctCount: currentAnswer.isCorrect
          ? prev.correctCount - 1
          : prev.correctCount,
        timeSpent: prev.timeSpent.slice(0, -1),
        answers: prev.answers.slice(0, -1),
      }));

      // Update global streak
      setGlobalStreak((prev) => ({
        ...prev,
        score: prev.score - currentAnswer.questionScore,
        streak: prev.streak - (currentAnswer.isCorrect ? 1 : 0),
      }));
    }
  };

  const handleOptionSelect = (option) => {
    // No changes needed here based on the request, it locks immediately
    if (quizState.isAnswerLocked) return;

    const isCorrect = option === quizState.question?.correctAnswer;
    const timeBonus = isCorrect ? Math.floor(quizState.countdown / 2) : 0;
    const pointsEarned = isCorrect ? 100 + timeBonus : 0;
    const newStreak = isCorrect ? quizState.streak + 1 : 0;

    setQuizState((prev) => ({
      ...prev,
      selectedOption: option,
      isAnswerLocked: true, // Lock happens here
    }));

    // Update statistics immediately for final results
    setStats((prev) => ({
      ...prev,
      actualScore: prev.actualScore + pointsEarned,
      timeBonusTotal: prev.timeBonusTotal + timeBonus,
      correctCount: isCorrect ? prev.correctCount + 1 : prev.correctCount,
      timeSpent: [...prev.timeSpent, 30 - quizState.countdown],
      answers: [
        ...prev.answers,
        {
          quesKey: quizState.currentQuestionIndex,
          selectedAnswer: option,
          correctAnswer: quizState.question?.correctAnswer,
          isCorrect,
          timeLeft: quizState.countdown,
          questionScore: pointsEarned,
          timeBonus,
          streak: newStreak,
        },
      ],
    }));
    setGlobalStreak({
      score: stats.actualScore,
      streak: newStreak,
    });

    // Delay display score and streak update until next question
    setTimeout(() => {
      setQuizState((prev) => ({
        ...prev,
        displayScore: prev.displayScore + pointsEarned,
        streak: newStreak,
      }));
    }, quizState.countdown * 1000);
  };

  useEffect(() => {
    const siteData = localStorage.getItem("siteData");
    const weUser = siteData ? JSON.parse(siteData) : {};

    const sessionData = sessionStorage.getItem("isPlayed");
    const ssData = sessionData ? JSON.parse(sessionData) : {};

    // console.log(ssData);
    // console.log(code);

    if (ssData.code == weUser.code) {
      console.log(ssData);
      setResults({
        showResults: true,
        quizStats: ssData.stats,
        globals: ssData.globals,
      });
      //   // window.location.href = "/quiz/result"
      // );

      // navigate("/quiz/results", {
      //   state: {
      //     quizStats: ssData.stats,
      //     onHomeClick: () => navigate("/"),
      //     globals: ssData.globals,
      //   },
      // });
    } else {
      // console.log("Not Played");
    }
  }, []);

  if (results.showResults) {
    return (
      <ResultLayout
        quizStats={results.quizStats}
        onHomeClick={() => navigate("/")}
        globals={globalStreak}
      />
    );
  }

  const layoutProps = {
    siteData,
    progress: quizState.progress,
    question: quizState.question,
    isAnswerLocked: quizState.isAnswerLocked,
    selectedOption: quizState.selectedOption,
    setSelectedOption: handleOptionSelect, // This locks the answer
    onResetSelection: handleResetSelection, // Pass the new handler
    countdown: quizState.countdown,
    setIsAnswerLocked: (
      value // This might not be needed if locking is handled internally
    ) => setQuizState((prev) => ({ ...prev, isAnswerLocked: value })),
    onTimeUp: handleTimeUp,
    score: quizState.displayScore,
    currentQuestionIndex: quizState.currentQuestionIndex,
    streak: quizState.streak,
  };

  return isMobile ? (
    <MobLayout {...layoutProps} />
  ) : (
    <DesktopLayout {...layoutProps} />
  );
};

export default QuizPage;
