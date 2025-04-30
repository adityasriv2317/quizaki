import React, { useEffect, useState, useCallback } from "react";
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
const ResultLayout = ({ quizStats, onHomeClick }) => {
  const siteData = localStorage.getItem("siteData");
  // Add null check for siteData before parsing
  const weUser = siteData ? JSON.parse(siteData) : {};
  const uid = weUser.uid;
  const code = weUser.code; // Assuming 'code' is the quizId

  // Add state for leaderboard
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);
  const [leaderboardError, setLeaderboardError] = useState(null);

  // State to manage leaderboard expansion
  const [isLeaderboardExpanded, setIsLeaderboardExpanded] = useState(false);

  // Wrap the data fetching logic in useCallback
  const saveStatsAndFetchLeaderboard = useCallback(async () => {
    // Ensure uid and code are available
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
      score: quizStats.totalScore,
      // Ensure streak is included, defaulting to 0 if not present in quizStats
      streak: quizStats.streak || 0,
      correctAnswers: quizStats.correctAnswers,
      incorrectAnswers: quizStats.totalQuestions - quizStats.correctAnswers,
      time: quizStats.averageTime,
    };

    console.log("Submitting user stats:", userStatData);

    const saveAPI = "https://ccc-quiz.onrender.com/player/SavePlayer";
    const leaderboardAPI = `https://ccc-quiz.onrender.com/player/leaderboard/${code}`;

    setLoadingLeaderboard(true); // Start loading before fetch
    setLeaderboardError(null); // Reset error
    try {
      // Save player stats (consider if this should be retried as well)
      // For now, we only retry the leaderboard fetch part if it fails initially
      // If save fails, leaderboard fetch might not proceed in the first run.
      // Let's attempt save first, then fetch leaderboard. If fetch fails, retry only fetch.
      try {
        const saveResponse = await axios.post(saveAPI, userStatData);
        console.log("Stats saved successfully:", saveResponse.data);
      } catch (saveError) {
        console.error("Error saving stats:", saveError);
        // Log and continue to fetch leaderboard
      }

      // Fetch leaderboard data
      // console.log("Fetching leaderboard from:", leaderboardAPI);
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
  }, [quizStats, code, uid]); // Add dependencies for useCallback

  useEffect(() => {
    saveStatsAndFetchLeaderboard();
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
            <span className={isExpandedView ? "text-center" : "text-right"}>Score</span>
            {/* Center Streak header only if expanded */}
            <span className={isExpandedView ? "text-center" : "text-right"}>Streak</span>
          </div>
          {/* Rows - Apply text-center conditionally for expanded view */}
          {dataToShow.map((entry, index) => (
            <div
              key={entry.uid || index}
              className="grid grid-cols-4 gap-2 py-1 text-gray-800 items-center text-sm"
            >
              <span className="text-center font-medium">{index + 1}</span>
              {/* Center Player name only if expanded */}
              <span className={`truncate ${isExpandedView ? "text-center" : ""}`}>{entry.playerName || "Unknown"}</span>
              {/* Center Score only if expanded */}
              <span className={`font-semibold ${isExpandedView ? "text-center" : "text-right"}`}>{entry.score}</span>
              {/* Center Streak only if expanded */}
              <span className={`font-semibold ${isExpandedView ? "text-center" : "text-right"}`}>
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
    answers: [], // Keep track of answers per question
    finalStreak: 0, // Add state to track the final streak
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
      streak: 0, // Add streak to final stats
    },
  });

  const quizData = location.state?.quizData;
  const currentQuiz = Array.isArray(quizData) ? quizData[0] : quizData;
  const isMobile = useMediaQuery({ maxWidth: 900 });

  // Wrap calculateFinalStats in useCallback and define it earlier
  const calculateFinalStats = useCallback(() => {
    const totalQuestions = currentQuiz.questions.length;
    // Ensure timeSpent has an entry for every question, even if unanswered
    const completedTimeSpent = [...stats.timeSpent];
    while (completedTimeSpent.length < totalQuestions) {
      completedTimeSpent.push(30); // Add max time for unanswered questions
    }
    const totalTime = completedTimeSpent.reduce(
      (total, time) => total + time,
      0
    );
    const averageTime =
      totalQuestions > 0 ? Math.round(totalTime / totalQuestions) : 0;

    return {
      totalScore: stats.actualScore,
      timeBonus: stats.timeBonusTotal,
      correctAnswers: stats.correctCount,
      totalQuestions,
      accuracy:
        totalQuestions > 0
          ? Math.round((stats.correctCount / totalQuestions) * 100)
          : 0,
      averageTime: averageTime,
      streak: stats.finalStreak, // Use the final streak calculated
    };
    // Dependencies for useCallback: stats state and the number of questions
  }, [stats, currentQuiz?.questions.length]);


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

  // useEffect to calculate final stats *after* stats state updates and results are shown
  useEffect(() => {
    // Only calculate when results should be shown and stats have potentially updated
    if (results.showResults) {
      const finalStats = calculateFinalStats(); // Reads the latest 'stats' state
      // Check if the calculated stats are different from the current ones to avoid infinite loops
      // Using JSON.stringify for a simple deep comparison
      if (JSON.stringify(finalStats) !== JSON.stringify(results.quizStats)) {
        setResults(prevResults => ({
          ...prevResults,
          quizStats: finalStats,
        }));
      }
    }
    // Dependency array includes 'stats' and 'results.showResults'
    // and the memoized calculateFinalStats function
  }, [stats, results.showResults, calculateFinalStats, results.quizStats]); // Added results.quizStats to deps


  const handleTimeUp = useCallback(() => { // Wrap in useCallback
    if (!currentQuiz?.questions || results.showResults) return; // Prevent running if results are shown

    const currentQuestionIndex = quizState.currentQuestionIndex;
    const totalQuestions = currentQuiz.questions.length;

    // Record time spent for the current question if no option was selected
    if (!quizState.selectedOption) {
      setStats((prev) => ({
        ...prev,
        // Only add time if it hasn't been added by handleOptionSelect
        timeSpent:
          prev.timeSpent.length === currentQuestionIndex
            ? [...prev.timeSpent, 30]
            : prev.timeSpent,
        // Reset streak if time runs out on an unanswered question
        finalStreak: 0, // Reset streak as the chain is broken
      }));
      // Update display streak immediately for UI consistency
      setQuizState((prev) => ({ ...prev, streak: 0 }));
    } else {
      // If an option was selected, the streak is handled in handleOptionSelect
      // We just need to ensure finalStreak reflects the last known streak
      setStats((prev) => ({ ...prev, finalStreak: quizState.streak }));
    }

    // Check if it's the last question
    if (currentQuestionIndex >= totalQuestions - 1) {
      // End of the quiz - Just set showResults to true.
      // The new useEffect hook will handle calculating and setting the final stats.
      setResults((prevResults) => ({
        ...prevResults,
        showResults: true,
        // quizStats will be updated by the useEffect now
      }));
      // Removed the setTimeout and calculateFinalStats call from here
    } else {
      // Move to the next question
      const nextIndex = currentQuestionIndex + 1;
      // Use setTimeout to allow seeing the locked answer briefly (optional)
      // Or remove setTimeout if immediate transition is preferred
      setTimeout(() => {
        setQuizState((prev) => ({
          ...prev,
          currentQuestionIndex: nextIndex,
          selectedOption: null,
          isAnswerLocked: false,
          countdown: 30, // Reset countdown for the next question
          // displayScore and streak are updated via handleOptionSelect's delayed update
        }));
      }, 500); // Delay before showing next question (adjust as needed)
    }
    // Add dependencies for useCallback
  }, [currentQuiz?.questions, quizState.currentQuestionIndex, quizState.selectedOption, quizState.streak, results.showResults]);


  // Add this handler function
  const handleResetSelection = () => {
    if (quizState.isAnswerLocked) {
      // Only allow reset if an answer was locked by selection
      setQuizState((prev) => ({
        ...prev,
        selectedOption: null,
        isAnswerLocked: false, // Unlock to allow re-selection
      }));
      // Note: We don't revert score/stats here as they are updated upon selection lock.
      // If the user re-selects, handleOptionSelect will run again.
      // If they don't re-select before time runs out, handleTimeUp will proceed without a selected option.
    }
  };

  const handleOptionSelect = (option) => {
      if (quizState.isAnswerLocked || results.showResults) return; // Prevent selection if locked or quiz ended
  
      const isCorrect = option === quizState.question?.correctAnswer;
      const timeBonus = isCorrect ? Math.floor(quizState.countdown / 2) : 0;
      const pointsEarned = isCorrect ? 100 + timeBonus : 0;
      const newStreak = isCorrect ? quizState.streak + 1 : 0; // Calculate potential new streak
  
      // Lock the answer immediately
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
        // Ensure timeSpent length matches current question index before adding
        timeSpent:
          prev.timeSpent.length === quizState.currentQuestionIndex
            ? [...prev.timeSpent, 30 - quizState.countdown]
            : prev.timeSpent, // Avoid adding time twice if reset/reselect happens fast
        answers: [
          // Keep track of detailed answer info if needed
          ...prev.answers,
          {
            /* ... answer details ... */
          },
        ],
        finalStreak: newStreak, // Update final streak tracker
      }));
  
      // Update display score and streak for the UI immediately
      setQuizState((prev) => ({
        ...prev,
        displayScore: prev.displayScore + pointsEarned, // Update display score immediately
        streak: newStreak, // Update display streak immediately
      }));
  
      // REMOVE THIS SECTION - Don't automatically move to next question
      // setTimeout(() => {
      //   handleTimeUp(); // handleTimeUp will now manage moving to next question or ending quiz
      // }, 1000); // Delay to show correctness/feedback before moving on
    };

  if (results.showResults) {
    return (
      <ResultLayout
        quizStats={results.quizStats}
        onHomeClick={() => navigate("/")}
        // quizId={code} // Pass quizId if needed and not derived from localStorage in ResultLayout
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
    // setIsAnswerLocked is likely not needed externally anymore
    onTimeUp: handleTimeUp, // handleTimeUp handles timeout logic
    score: quizState.displayScore, // Use displayScore for UI
    currentQuestionIndex: quizState.currentQuestionIndex,
    streak: quizState.streak, // Use display streak for UI
  };

  return isMobile ? (
    <MobLayout {...layoutProps} />
  ) : (
    <DesktopLayout {...layoutProps} />
  );
};

export default QuizPage;
