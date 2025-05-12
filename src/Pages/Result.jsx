import React, { useEffect, useRef, useState, useCallback } from "react";
import { Expand, X, RefreshCcw } from "lucide-react";
import Spinner from "../assets/Spinner";
import axios from "axios";

const ResultLayout = ({ quizStats, onHomeClick, globals }) => {
  const siteData = localStorage.getItem("siteData");
  const weUser = siteData ? JSON.parse(siteData) : {};
  const uid = weUser.uid;
  const code = weUser.code;
  const invoked = useRef(false);
  // Add state for leaderboard
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);
  const [leaderboardError, setLeaderboardError] = useState(null);

  const api = import.meta.env.VITE_API_URL;

  // Save quiz data to session storage
  useEffect(() => {
    const quizData = {
      code: code,
      stats: quizStats,
      globals: globals,
    };
    sessionStorage.setItem("isPlayed", JSON.stringify(quizData));
  }, [code, quizStats, globals]);

  // State to manage leaderboard expansion
  const [isLeaderboardExpanded, setIsLeaderboardExpanded] = useState(false);

  // Wrap the data fetching logic in useCallback
  const saveStatsAndFetchLeaderboard = useCallback(async () => {
    if (!uid || !code) {
      setLeaderboardError(
        "Cannot load leaderboard: User or Quiz information missing."
      );
      setLoadingLeaderboard(false);
      return;
    }

    const sessionData = sessionStorage.getItem("isPlayed");
    const ssData = sessionData ? JSON.parse(sessionData) : {};
    const hasPlayed = ssData && ssData.code === code;

    const userStatData = {
      uid: uid,
      quizId: code,
      score: quizStats.totalScore,
      streak: globals.streak,
      correctAnswers: quizStats.correctAnswers,
      incorrectAnswers: quizStats.totalQuestions - quizStats.correctAnswers,
      time: quizStats.averageTime,
    };

    const saveAPI = `${api}/player/SavePlayer`;
    const leaderboardAPI = `${api}/player/leaderboard/${code}`;

    setLoadingLeaderboard(true);
    setLeaderboardError(null);
    try {
      // Only save if the user hasn't played this quiz before
      if (!hasPlayed) {
        try {
          const saveResponse = await axios.post(saveAPI, userStatData);
        } catch (saveError) {
          console.error("Error saving stats:", saveError);
        }
      }

      // Always fetch and update leaderboard
      const leaderboardResponse = await axios.get(leaderboardAPI);
      const data = Array.isArray(leaderboardResponse.data)
        ? leaderboardResponse.data
        : [];
      // Sort by score first, then by streak
      const sortedData = data.sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score; // Sort by score first
        }
        return (b.streak || 0) - (a.streak || 0); // Then by streak
      });
      setLeaderboardData(sortedData);
    } catch (error) {
      if (error.response) {
        setLeaderboardError(
          `Failed to load leaderboard: Server responded with status ${error.response.status}`
        );
      } else if (error.request) {
        setLeaderboardError(
          "Failed to load leaderboard: No response from server."
        );
      } else {
        setLeaderboardError(`Failed to load leaderboard: ${error.message}`);
      }
    } finally {
      setLoadingLeaderboard(false);
    }
  }, [quizStats, code, uid, globals.streak]);

  useEffect(() => {
    const siteData = localStorage.getItem("siteData");
    const weUser = siteData ? JSON.parse(siteData) : {};

    const sessionData = sessionStorage.getItem("isPlayed");
    const ssData = sessionData ? JSON.parse(sessionData) : {};

    if (!invoked.current) {
      invoked.current = true;
      saveStatsAndFetchLeaderboard();
    }
  }, [saveStatsAndFetchLeaderboard]);

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

  const getLeaderboard = useCallback(async () => {
    const leaderboardAPI = `${api}/player/leaderboard/${code}`;
    setLoadingLeaderboard(true);
    setLeaderboardError(null);
    
    try {
      const leaderboardResponse = await axios.get(leaderboardAPI);
      const data = Array.isArray(leaderboardResponse.data)
        ? leaderboardResponse.data
        : [];
      // Sort by score first, then by streak
      const sortedData = data.sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score; // Sort by score first
        }
        return (b.streak || 0) - (a.streak || 0); // Then by streak
      });
      setLeaderboardData(sortedData);
    } catch (error) {
      if (error.response) {
        setLeaderboardError(
          `Failed to load leaderboard: Server responded with status ${error.response.status}`
        );
      } else if (error.request) {
        setLeaderboardError(
          "Failed to load leaderboard: No response from server."
        );
      } else {
        setLeaderboardError(`Failed to load leaderboard: ${error.message}`);
      }
    } finally {
      setLoadingLeaderboard(false);
    }
  }, [code]);

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
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={getLeaderboard}
                    className="text-[#812939] hover:text-[#b74358] transition-colors"
                    aria-label="Refresh Leaderboard"
                  >
                    <RefreshCcw size={24} />
                  </button>
                  <button
                    onClick={() => setIsLeaderboardExpanded(true)}
                    className="text-[#812939] hover:text-[#b74358] transition-colors"
                    aria-label="Expand Leaderboard"
                  >
                    <Expand size={24} />
                  </button>
                </div>
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

export default ResultLayout;
