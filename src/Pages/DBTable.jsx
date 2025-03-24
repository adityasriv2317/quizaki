import React, {useEffect, useState  } from "react";

const DBTable = () => {
  const [data, setData] = useState([]); // Store table data
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const rowsPerPage = 5; // Number of rows per page

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Start loading
      try {
        const response = await fetch("https://api.example.com/quizzes"); // Replace with your API endpoint
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    fetchData();
  }, []);

  // Pagination calculations
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(data.length / rowsPerPage);

  // Handlers for pagination
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="p-4 font-oxanium">
      <table className="min-w-full border-collapse border-spacing-0">
        <thead>
          <tr className="">
            <th className="font-medium px-4 py-2 bg-[rgba(246,200,208,0.7)] border-b border-r border-mag rounded-tl-lg">
              Quiz ID
            </th>
            <th className="font-medium px-4 py-2 bg-[rgba(246,200,208,0.7)] border-b border-mag border-r">
              Quiz Title
            </th>
            <th className="font-medium px-4 py-2 bg-[rgba(246,200,208,0.7)] border-b border-mag rounded-tr-lg">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            // Loading animation row
            <tr>
              <td colSpan="3" className="text-center py-4">
                <div className="flex justify-center items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
                  <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse delay-150"></div>
                  <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse delay-300"></div>
                </div>
              </td>
            </tr>
          ) : currentRows.length > 0 ? (
            currentRows.map((row, index) => (
              <tr key={index}>
                <td className="px-4 py-2 border-t">{row.quizID}</td>
                <td className="px-4 py-2 border-t">{row.quizTitle}</td>
                <td className="px-4 py-2 border-t">{row.status}</td>
              </tr>
            ))
          ) : (
            // Empty state if no data is available
            <tr>
              <td
                colSpan="3"
                className="text-center py-4 bg-[rgba(246,200,208,0.7)] rounded-b-lg text-gray-500"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 disabled:hover:bg-blue-500 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="flex items-center">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 disabled:hover:bg-blue-500 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DBTable;