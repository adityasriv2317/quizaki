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

// Add this new component at the top with other layout components
const ResultLayout = ({ quizStats, onHomeClick, globals }) => {
  const siteData = localStorage.getItem("siteData");
  const weUser = siteData ? JSON.parse(siteData) : {};
  const uid = weUser.uid;
  const code = weUser.code; // Assuming 'code' is the quizId

  const invoked = useRef(false); // flag for useEffect

  // Add state for leaderboard
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);
  const [leaderboardError, setLeaderboardError] = useState(null);

  // State to manage leaderboard expansion
  const [isLeaderboardExpanded, setIsLeaderboardExpanded] = useState(false);

  // Wrap the data fetching logic in useCallback
  const saveStatsAndFetchLeaderboard = useCallback(async () => {
    if (!uid || !code) {
      console.error("User ID or Quiz Code is missing.");
      setLeaderboardError(
        "Cannot load leaderboard: User or Quiz information missing."
      );
      setLoadingLeaderboard(false);
      return;
    }

    const userStatData = {
      uid: uid,
      quizId: code,
      // score: quizStats.totalScore,
      score: quizStats.totalScore,
      streak: globals.streak, // Use the streak from quizStats directly
      correctAnswers: quizStats.correctAnswers,
      incorrectAnswers: quizStats.totalQuestions - quizStats.correctAnswers,
      time: quizStats.averageTime,
    };

    console.log("Submitting user stats with streak:", userStatData);

    const saveAPI = "https://ccc-quiz.onrender.com/player/SavePlayer";
    const leaderboardAPI = `https://ccc-quiz.onrender.com/player/leaderboard/${code}`;

    setLoadingLeaderboard(true); // Start loading before fetch
    setLeaderboardError(null); // Reset error
    try {
      try {
        console.log("Sending stats to:", saveAPI);
        const saveResponse = await axios.post(saveAPI, userStatData);
        console.log("Stats saved successfully:", saveResponse.data);
      } catch (saveError) {
        console.error("Error saving stats:", saveError);
        // Log and continue to fetch leaderboard
      }

      // Fetch leaderboard data
      console.log("Fetching leaderboard from:", leaderboardAPI);
      const leaderboardResponse = await axios.get(leaderboardAPI);
      // console.log("Leaderboard data received:", leaderboardResponse.data);

      // Ensure data is an array and sort by score descending
      const data = Array.isArray(leaderboardResponse.data)
        ? leaderboardResponse.data
        : [];
      // Sort here to ensure consistent order
      const sortedData = data.sort((a, b) => (b.score || 0) - (a.score || 0));
      setLeaderboardData(sortedData);
    } catch (error) {
      // console.error("Error during leaderboard fetch:", error);
      if (error.response) {
        // console.error("Error data:", error.response.data);
        // console.error("Error status:", error.response.status);
        setLeaderboardError(
          `Failed to load leaderboard: Server responded with status ${error.response.status}`
        );
      } else if (error.request) {
        // console.error("Error request:", error.request);
        setLeaderboardError(
          "Failed to load leaderboard: No response from server."
        );
      } else {
        // console.error("Error message:", error.message);s
        setLeaderboardError(`Failed to load leaderboard: ${error.message}`);
      }
    } finally {
      setLoadingLeaderboard(false); // Stop loading
    }
  }, [quizStats, code, uid]);

  useEffect(() => {
    if (!invoked.current) {
      invoked.current = true;
      saveStatsAndFetchLeaderboard();
    }
  }, [saveStatsAndFetchLeaderboard]); // Depend on the memoized function

  // Helper function to render leaderboard content based on state
  const renderLeaderboardTable = (isExpandedView) => {
    if (loadingLeaderboard) {
      return <Spinner />;
    }

    if (leaderboardError) {
      return (
        <div className="text-center p-4">
          <Spinner />
          <p className="text-red-600 my-2">Could not load leaderboard.</p>
          <button
            onClick={saveStatsAndFetchLeaderboard}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            aria-label="Retry fetching leaderboard"
          >
            Retry
          </button>
        </div>
      );
    }

    const dataToShow = isExpandedView
      ? leaderboardData
      : leaderboardData.slice(0, 5);

    if (dataToShow.length > 0) {
      return (
        <div className="leaderboard-table">
          {/* Header - Apply text-center conditionally for expanded view */}
          <div
            // Apply sticky header styling consistently
            className={`grid grid-cols-4 gap-2 font-semibold text-gray-700 border-b pb-2 mb-2 text-sm sticky top-0 bg-gray-100 z-10`}
          >
            <span className="text-center">Rank</span>
            {/* Center Player header only if expanded */}
            <span className={isExpandedView ? "text-center" : ""}>Player</span>
            {/* Center Score header only if expanded */}
            <span className={isExpandedView ? "text-center" : "text-right"}>
              Score
            </span>
            {/* Center Streak header only if expanded */}
            <span className={isExpandedView ? "text-center" : "text-right"}>
              Streak
            </span>
          </div>
          {/* Rows - Apply text-center conditionally for expanded view */}
          {dataToShow.map((entry, index) => (
            <div
              key={entry.uid || index}
              className="grid grid-cols-4 gap-2 py-1 text-gray-800 items-center text-sm"
            >
              <span className="text-center font-medium">{index + 1}</span>
              {/* Center Player name only if expanded */}
              <span
                className={`truncate ${isExpandedView ? "text-center" : ""}`}
              >
                {entry.playerName || "Unknown"}
              </span>
              {/* Center Score only if expanded */}
              <span
                className={`font-semibold ${
                  isExpandedView ? "text-center" : "text-right"
                }`}
              >
                {entry.score}
              </span>
              {/* Center Streak only if expanded */}
              <span
                className={`font-semibold ${
                  isExpandedView ? "text-center" : "text-right"
                }`}
              >
                {entry.streak || 0}
              </span>
            </div>
          ))}
        </div>
      );
    }

    return (
      <p className="text-center text-gray-600">
        No leaderboard data available.
      </p>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#b74358] to-[#812939] p-4">
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="text-center mb-4">
          <h1 className="text-4xl md:text-5xl font-oxanium font-bold text-white">
            Quiz Complete!
          </h1>
        </div>

        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-8 relative">
          {" "}
          {/* Added relative positioning */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            {/* Score Card */}
            <div className="bg-gradient-to-r from-[#b74358] to-[#812939] rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <span className="text-lg font-oxanium">Total Score</span>
                <span className="text-2xl">🏆</span>
              </div>
              <div className="text-4xl font-bold mt-2 font-poppins">
                {quizStats.totalScore}
              </div>
              <div className="text-sm mt-2 font-oxanium">
                Time Bonus: +{quizStats.timeBonus}
              </div>
            </div>

            {/* Correct Answers Card */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <span className="text-lg font-oxanium">Correct Answers</span>
                <span className="text-2xl">✓</span>
              </div>
              <div className="text-4xl font-bold font-poppins mt-2">
                {quizStats.correctAnswers}/{quizStats.totalQuestions}
              </div>
            </div>
          </div>
          {/* Detailed Stats */}
          <div className="bg-gray-50 rounded-xl p-2 mb-8">
            <div className="mx-auto">
              <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
                <span className="text-gray-600">Accuracy Rate</span>
                <span className="font-semibold">{quizStats.accuracy}%</span>
              </div>
              {/* <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
                <span className="text-gray-600">Average Time</span>
                <span className="font-semibold">{quizStats.averageTime}s</span>
              </div> */}
            </div>
          </div>
          {/* Leaderboard Section */}
          <div className="mt-2">
            {/* Header with Expand button */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-oxanium font-bold text-[#812939]">
                Leaderboard (Top 5)
              </h2>
              {/* Show Expand button only if not expanded and data exists */}
              {!isLeaderboardExpanded && leaderboardData.length > 5 && (
                <button
                  onClick={() => setIsLeaderboardExpanded(true)}
                  className="text-[#812939] hover:text-[#b74358] transition-colors"
                  aria-label="Expand Leaderboard"
                >
                  <Expand size={24} />
                </button>
              )}
            </div>
            {/* Compact Leaderboard View */}
            <div className="bg-gray-100 rounded-lg shadow p-4 max-h-60 overflow-y-auto">
              {/* Render top 5 */}
              {renderLeaderboardTable(false)}
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <button
              onClick={onHomeClick}
              className="flex-1 px-6 py-3 bg-[#b74358] text-white rounded-xl hover:bg-[#812939] transition-all duration-300 shadow-lg"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Leaderboard Modal */}
      {isLeaderboardExpanded && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-oxanium font-bold text-[#812939]">
                Full Leaderboard
              </h2>
              <button
                onClick={() => setIsLeaderboardExpanded(false)}
                className="text-gray-500 hover:text-gray-800"
                aria-label="Close Leaderboard"
              >
                <X size={24} />
              </button>
            </div>
            {/* Modal Body - Scrollable */}
            <div className="pb-1 overflow-y-auto flex-grow">
              {/* Render full leaderboard */}
              {renderLeaderboardTable(true)}
            </div>
          </div>
        </div>
      )}
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
