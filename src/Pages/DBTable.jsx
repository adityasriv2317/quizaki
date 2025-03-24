import React, { useEffect, useState } from "react";
import axios from "axios";

const DBTable = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5; // Set max items per page to 5

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          "https://ccc-quiz.onrender.com/admin/fetchQuiz",
          { params: { email: "saurabhsri.mau@gmail.com" } }
        );
        setData(response.data || []); // Ensure it's always an array
      } catch (error) {
        console.error("Error fetching data:", error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(data.length / rowsPerPage));

  // Ensure the page doesn't go beyond available pages
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages > 0 ? totalPages : 1);
    }
  }, [data, totalPages]);

  // Properly slice the data when page changes
  const currentRows = React.useMemo(() => {
    return data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  }, [data, currentPage]);

  // Generate pagination buttons (Fixed)
  const getPageNumbers = () => {
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) {
      startPage = 1;
      endPage = Math.min(5, totalPages);
    } else if (currentPage >= totalPages - 2) {
      startPage = Math.max(1, totalPages - 4);
      endPage = totalPages;
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  return (
    <div className="p-4 font-oxanium">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20">
        <table className="min-w-full border-collapse border-spacing-0">
          <thead>
            <tr>
              <th className="px-6 py-4 bg-gray-100 border-b border-r border-gray-200 text-left text-gray-800">
                Quiz ID
              </th>
              <th className="px-6 py-4 bg-gray-100 border-b border-r border-gray-200 text-left text-gray-800">
                Quiz Title
              </th>
              <th className="px-6 py-4 bg-gray-100 border-b border-r border-gray-200 text-left text-gray-800">
                Questions
              </th>
              <th className="px-6 py-4 bg-gray-100 border-b border-gray-200 text-left text-gray-800">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="4" className="text-center py-8">
                  <div className="flex justify-center items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>
                    <div className="w-4 h-4 bg-blue-400 rounded-full animate-pulse delay-150"></div>
                    <div className="w-4 h-4 bg-blue-400 rounded-full animate-pulse delay-300"></div>
                  </div>
                </td>
              </tr>
            ) : currentRows.length > 0 ? (
              currentRows.map((quiz, index) => (
                <tr key={quiz.quizId || index} className="hover:bg-gray-100 transition-colors">
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-700">{quiz.quizId}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-700">{quiz.quizTitle}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-700">{quiz.questions?.length || 0}</td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    <span
                      className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                        quiz.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
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

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-6 space-x-2">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50"
        >
          Previous
        </button>
        <div className="flex items-center space-x-1">
          {currentPage > 3 && (
            <>
              <button onClick={() => setCurrentPage(1)} className="px-3 py-2 rounded-lg hover:bg-gray-300">
                1
              </button>
              <span>...</span>
            </>
          )}
          {getPageNumbers().map((number) => (
            <button
              key={number}
              onClick={() => setCurrentPage(number)}
              className={`px-3 py-2 rounded-lg ${
                currentPage === number ? "bg-gray-700 text-white" : "hover:bg-gray-300"
              }`}
            >
              {number}
            </button>
          ))}
          {currentPage < totalPages - 2 && (
            <>
              <span>...</span>
              <button onClick={() => setCurrentPage(totalPages)} className="px-3 py-2 rounded-lg hover:bg-gray-300">
                {totalPages}
              </button>
            </>
          )}
        </div>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DBTable;
