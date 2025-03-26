import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useWebData } from '../Security/WebData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

const Result = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { siteData } = useWebData();
  const quizResults = location.state || {};

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[rgb(183,67,88)] to-[rgb(242,75,105)] text-white font-poppins">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 md:p-8 border border-white/20 max-w-lg w-full text-center">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">{quizResults.quizTitle || 'Quiz Results'}</h2>
        <div className="bg-violet-200 font-mono font-light text-lg md:text-2xl px-4 py-2 rounded-md mb-4">
          <span className="uppercase">Score: {quizResults.score || 0}</span>
          <div className="text-sm mt-2">
            Questions: {quizResults.totalQuestions || 0}
          </div>
        </div>
        <p className="text-lg text-gray-700 mb-4">
          You answered {quizResults.answers?.filter(a => a.isCorrect).length || 0} questions correctly!
        </p>
        <button
          onClick={handleHomeClick}
          className="flex items-center justify-center space-x-2 px-6 py-3 bg-[rgb(137,207,251)] text-white rounded-md hover:bg-[rgb(137,207,251)]/90 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <FontAwesomeIcon icon={faHome} />
          <span>Go to Home</span>
        </button>
      </div>
    </div>
  );
};

export default Result;