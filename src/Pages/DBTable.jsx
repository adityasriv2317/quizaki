import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DBTable = ({ onQuizSelect }) => {  // Add this prop
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  // Change rowsPerPage to 5
  const rowsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          "https://ccc-quiz.onrender.com/admin/fetchQuiz",
          { params: { email: "saurabhsri.mau@gmail.com" } }
        );
        // Updated sorting logic
        const sortedData = [...(response.data || [])].sort((a, b) => {
          // Convert quizId to numbers and sort in descending order
          const idA = parseInt(a.quizId, 10);
          const idB = parseInt(b.quizId, 10);
          return idB - idA;
        });
        setData(sortedData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Ensure currentPage stays within valid range
  useEffect(() => {
    const maxPage = Math.ceil(data.length / rowsPerPage);
    if (currentPage > maxPage) {
      setCurrentPage(maxPage || 1);
    }
  }, [data, currentPage]);

  // Calculate pagination values (removed duplicate declarations)
  let lastIndex = currentPage * rowsPerPage;
  let firstIndex = lastIndex - rowsPerPage;
  let currentRows = isLoading ? [] : data.slice(firstIndex, lastIndex);
  let totalPages = Math.max(1, Math.ceil(data.length / rowsPerPage));

  // Get visible page numbers
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  // Handle page changes
  const handlePageChange = (pageNumber) => {
    setIsLoading(true);
    const newPage = Math.min(Math.max(1, pageNumber), totalPages);
    setCurrentPage(newPage);
    
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  // Calculate pagination values with fresh data each time
  lastIndex = currentPage * rowsPerPage;
   firstIndex = lastIndex - rowsPerPage;
   currentRows = isLoading ? [] : data.slice(firstIndex, lastIndex);
   totalPages = Math.max(1, Math.ceil(data.length / rowsPerPage));

  // Update pagination controls to use new handler
  const handleQuizClick = (quiz) => {
    if (onQuizSelect) {
      onQuizSelect(quiz);
    }
    navigate('/admin/dashboard', { state: { current: "analytics" } });
  };

  return (
    <div className="p-4 font-oxanium">
      {/* Make the container responsive */}
      <div className="overflow-x-auto bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20">
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 sm:px-6 py-3 sm:py-4 border-b border-r border-gray-200 text-left text-gray-800 text-sm sm:text-base">
                Quiz ID
              </th>
              <th className="px-4 sm:px-6 py-3 sm:py-4 border-b border-r border-gray-200 text-left text-gray-800 text-sm sm:text-base">
                Quiz Title
              </th>
              <th className="px-4 sm:px-6 py-3 sm:py-4 border-b border-r border-gray-200 text-left text-gray-800 text-sm sm:text-base">
                Questions
              </th>
              <th className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 text-left text-gray-800 text-sm sm:text-base">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Update table cells for responsive design */}
            {isLoading ? (
              <tr>
                <td colSpan="4" className="text-center py-8">
                  <div className="flex justify-center items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-200 rounded-full animate-pulse"></div>
                    <div className="w-4 h-4 bg-blue-300 rounded-full animate-pulse delay-150"></div>
                    <div className="w-4 h-4 bg-blue-200 rounded-full animate-pulse delay-300"></div>
                  </div>
                </td>
              </tr>
            ) : currentRows.length > 0 ? (
              currentRows.map((quiz, index) => (
                <tr 
                  key={quiz.quizId || index} 
                  className="hover:bg-gray-200 transition-colors cursor-pointer"
                  onClick={() => handleQuizClick(quiz)}
                >
                  <td className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 text-gray-700 text-sm sm:text-base">{quiz.quizId}</td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 text-gray-700 text-sm sm:text-base">{quiz.quizTitle}</td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 text-gray-700 text-sm sm:text-base">{quiz.questions?.length || 0}</td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
                    <span className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium ${
                      quiz.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {quiz.status ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-8 text-gray-500 bg-gray-50">
                  No quizzes available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Make pagination controls responsive */}
      <div className="flex flex-row justify-between items-center px-2 mt-4 sm:mt-6 space-y-0">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          className="w-auto px-4 py-2 bg-gray-100 text-blue-700 rounded-lg hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50 text-sm sm:text-base"
        >
          &lt;
        </button>
        <div className="flex items-center space-x-1">
          {getPageNumbers().map((number, index) => (
            number === '...' ? (
              <span key={index} className="px-2 py-1 text-sm sm:text-base">...</span>
            ) : (
              <button
                key={index}
                onClick={() => handlePageChange(number)}
                className={`px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-sm sm:text-base ${
                  currentPage === number 
                    ? "bg-blue-500 text-white" 
                    : "text-blue-600 hover:bg-blue-100"
                }`}
              >
                {number}
              </button>
            )
          ))}
        </div>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          className="w-auto px-4 py-2 bg-gray-100 text-blue-700 rounded-lg hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50 text-sm sm:text-base"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default DBTable;
