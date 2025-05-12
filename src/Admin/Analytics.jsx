import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const Analytics = () => {
  const [latestQuiz, setLatestQuiz] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const selectedQuiz = location.state?.selectedQuiz;

  const api = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchLatestQuiz = async () => {
      setIsLoading(true);
      try {
        // If we have a selected quiz from the table, use that
        if (selectedQuiz) {
          setLatestQuiz(selectedQuiz);
          setIsLoading(false);
          return;
        }

        // Otherwise fetch the latest quiz
        const response = await axios.get(`${api}/admin/fetchQuiz`, {
          params: { email: "saurabhsri.mau@gmail.com" },
        });
        const sortedQuizzes = [...(response.data || [])].sort(
          (a, b) => a.quizId - b.quizId
        );
        setLatestQuiz(sortedQuizzes[sortedQuizzes.length - 1] || null);
      } catch (err) {
        setError("Failed to fetch quiz data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestQuiz();
  }, [selectedQuiz]);

  return (
    <div className="p-4 font-oxanium">
      <div className="max-w-2xl mx-auto bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Latest Quiz Control
        </h2>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="flex space-x-2">
              <div className="w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>
              <div className="w-4 h-4 bg-blue-400 rounded-full animate-pulse delay-150"></div>
              <div className="w-4 h-4 bg-blue-400 rounded-full animate-pulse delay-300"></div>
            </div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : latestQuiz ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-medium text-gray-700">
                  {latestQuiz.quizTitle}
                </h3>
                <p className="text-gray-600">Quiz ID: {latestQuiz.quizId}</p>
                <p className="text-gray-600">
                  Questions: {latestQuiz.questions?.length || 0}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <span
                  className={`px-3 py-1.5 rounded-full text-sm font-medium mb-2 ${
                    latestQuiz.status
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {latestQuiz.status ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-gray-500 text-center py-4">
            No quiz available
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
