import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useWebData } from "../Security/WebData";
import CountdownTimer from "../assets/CountdownTimer";
import { useMediaQuery } from "react-responsive";
import { Lock } from "lucide-react";
import { use } from "react";
import { useQuiz } from '../Context/QuizContext';

// Pass props
const DesktopLayout = ({
  siteData,
  progress,
  question,
  selectedOption,
  isAnswerLocked,
  setSelectedOption,
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
            <div className="text-sm mt-2">Streak: {streak}</div>
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
                <p className="text-lg text-white font-light mb-4 ml-4 text-center md:text-left">
                  Choose the Correct Option
                </p>
                <div className="grid grid-cols-1 gap-4 mx-auto max-w-[90%] md:max-w-[90%]">
                  {question.options.map((option, index) => (
                    // In both DesktopLayout and MobileLayout, update the option button:
                    <button
                      key={index}
                      disabled={isAnswerLocked && selectedOption !== option}
                      className={`py-3 px-20 md:py-4 rounded-md shadow-md flex flex-row items-center justify-between text-base md:text-lg font-semibold transition-all ${
                        selectedOption === option
                          ? isAnswerLocked
                            ? option === question.correctAnswer
                              ? "bg-red-200 text-black"
                              : "bg-red-200 text-black"
                            : "bg-red-200 text-black"
                          : "bg-[rgb(244,230,230)]"
                      } ${
                        isAnswerLocked && selectedOption !== option
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={() => setSelectedOption(option)}
                    >
                      {option}
                      {selectedOption === option && <Lock size={20} />}
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
  setIsAnswerLocked,
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
              onClick={(index) => {
                setSelectedOption(option, index);
              }}
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
              {selectedOption === option && (
                <Lock size={20} className="mx-16" />
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
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#b74358] to-[#812939] p-4">
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-oxanium font-bold text-white mb-2">Quiz Complete!</h1>
        </div>

        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            {/* Score Card */}
            <div className="bg-gradient-to-r from-[#b74358] to-[#812939] rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <span className="text-lg font-oxanium">Total Score</span>
                <span className="text-2xl">🏆</span>
              </div>
              <div className="text-4xl font-bold mt-2 font-poppins">{quizStats.totalScore}</div>
              <div className="text-sm mt-2 font-oxanium">Time Bonus: +{quizStats.timeBonus}</div>
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
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-semibold font-oxanium text-gray-800 mb-4">Quiz Statistics</h3>
            <div className="grid grid-cols-1 font-poppins sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
                <span className="text-gray-600">Accuracy Rate</span>
                <span className="font-semibold">{quizStats.accuracy}%</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
                <span className="text-gray-600">Average Time</span>
                <span className="font-semibold">{quizStats.averageTime}s</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onHomeClick}
              className="flex-1 px-6 py-3 bg-[#b74358] text-white rounded-xl hover:bg-[#812939] transition-all duration-300 shadow-lg"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const QuizPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { siteData } = useWebData();
  const { updateQuizState, addAnswer } = useQuiz();
  const [countdown, setCountdown] = useState(30);
  const [progress, setProgress] = useState(0);
  const [question, setQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [Final, setFinal] = useState(false);
  const [streak, setStreak] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [isAnswerLocked, setIsAnswerLocked] = useState(false);
  const quizData = location.state?.quizData;
  const isMobile = useMediaQuery({ maxWidth: 900 });

  useEffect(() => {
    if (!quizData) {
      console.log("No quiz data available");
      return;
    }

    const currentQuiz = Array.isArray(quizData) ? quizData[0] : quizData;

    if (currentQuiz?.questions) {
      const currentQuestion = currentQuiz.questions[currentQuestionIndex];
      setQuestion(currentQuestion);
      setProgress(
        ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100
      );
    }
  }, [quizData, currentQuestionIndex]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          handleTimeUp();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex]);

  // Add new state variables for accurate statistics
  const [displayScore, setDisplayScore] = useState(0);
  const [actualScore, setActualScore] = useState(0);
  const [timeBonusTotal, setTimeBonusTotal] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeSpent, setTimeSpent] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [quizStats, setQuizStats] = useState({
    totalScore: 0,
    timeBonus: 0,
    correctAnswers: 0,
    totalQuestions: 0,
    accuracy: 0,
    averageTime: 0
  });

  const handleOptionSelect = (option) => {
    if (!isAnswerLocked) {
      setSelectedOption(option);
      setIsAnswerLocked(true);

      const isCorrect = option === question?.correctAnswer;
      const timeBonus = isCorrect ? Math.floor(countdown / 2) : 0;
      const pointsEarned = isCorrect ? 100 + timeBonus : 0;

      // Update statistics immediately
      setActualScore(prev => prev + pointsEarned);
      setTimeBonusTotal(prev => prev + timeBonus);
      if (isCorrect) setCorrectCount(prev => prev + 1);
      setTimeSpent(prev => [...prev, 30 - countdown]);

      // Update display score with delay
      setTimeout(() => {
        setDisplayScore(prev => prev + pointsEarned);
      }, countdown * 1000);

      const newAnswer = {
        quesKey: question?.quesKey || currentQuestionIndex,
        selectedAnswer: option,
        correctAnswer: question?.correctAnswer,
        isCorrect: isCorrect,
        timeLeft: countdown,
        questionScore: pointsEarned,
        timeBonus: timeBonus
      };
      
      setAnswers(prev => [...prev, newAnswer]);
    }
  };

  const handleTimeUp = () => {
    const currentQuiz = Array.isArray(quizData) ? quizData[0] : quizData;

    if (!selectedOption) {
      setTimeSpent(prev => [...prev, 30]);
    }

    if (currentQuestionIndex < currentQuiz?.questions?.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedOption(null);
        setIsAnswerLocked(false);
        setCountdown(30);
      }, 500);
    } else {
      const totalQuestions = currentQuiz.questions.length;
      
      const finalStats = {
        totalScore: actualScore,
        timeBonus: timeBonusTotal,
        correctAnswers: correctCount,
        totalQuestions: totalQuestions,
        accuracy: Math.round((correctCount / totalQuestions) * 100),
        averageTime: Math.round(timeSpent.reduce((total, time) => total + time, 0) / totalQuestions)
      };

      setQuizStats(finalStats);
      setShowResults(true);
    }
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  // Add this check before the layout rendering
  if (showResults) {
    return <ResultLayout quizStats={quizStats} onHomeClick={handleHomeClick} />;
  }

  // Update layoutProps
  const layoutProps = {
    siteData,
    progress,
    question,
    isAnswerLocked,
    selectedOption,
    setSelectedOption: handleOptionSelect,
    countdown,
    setIsAnswerLocked,
    onTimeUp: handleTimeUp,
    score: displayScore,
    currentQuestionIndex,
  };

  return isMobile ? (
    <MobLayout {...layoutProps} />
  ) : (
    <DesktopLayout {...layoutProps} />
  );
};

export default QuizPage;
