import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useWebData } from "../Security/WebData";
import CountdownTimer from "../assets/CountdownTimer";
import { useMediaQuery } from "react-responsive";
import { Lock } from "lucide-react";
import axios from "axios";
import { useQuiz } from "../Context/QuizContext";

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

  const siteData = localStorage.getItem("siteData");
  const weUser = JSON.parse(siteData);
  const uid = weUser.uid;
  const code = weUser.code;

  // console.log(uid,code);

  useEffect(() => {
    const userStatData = {
      uid: uid,
      quizId: code,
      score: quizStats.totalScore,
      streak: quizStats.streak || 0,
      correctAnswers: quizStats.correctAnswers,
      incorrectAnswers: quizStats.totalQuestions - quizStats.correctAnswers,
      time: quizStats.averageTime
    };

    console.log(userStatData);

    const saveAPI = "https://ccc-quiz.onrender.com/player/SavePlayer";

    const saveStats = async () => {
      try {
        const response = await axios.post(saveAPI, userStatData);
        console.log("Stats saved successfully");
      } catch (error) {
        console.error("Error saving stats:", error);
      }
    };

    saveStats();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#b74358] to-[#812939] p-4">
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-oxanium font-bold text-white mb-2">
            Quiz Complete!
          </h1>
        </div>

        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-8">
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
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-semibold font-oxanium text-gray-800 mb-4">
              Quiz Statistics
            </h3>
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
        stats.timeSpent.reduce((total, time) => total + time, 0) / totalQuestions
      ),
    };
  };

  const handleTimeUp = () => {
    if (!currentQuiz?.questions) return;

    if (!quizState.selectedOption) {
      setStats(prev => ({
        ...prev,
        timeSpent: [...prev.timeSpent, 30],
      }));
    }

    if (quizState.currentQuestionIndex < currentQuiz.questions.length - 1) {
      const nextIndex = quizState.currentQuestionIndex + 1;
      setTimeout(() => {
        setQuizState(prev => ({
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
      
      setResults({
        showResults: true,
        quizStats: {
          totalScore: stats.actualScore + (lastAnswer?.questionScore || 0),
          timeBonus: stats.timeBonusTotal + (lastAnswer?.timeBonus || 0),
          correctAnswers: stats.correctCount + (lastAnswer?.isCorrect ? 1 : 0),
          totalQuestions,
          accuracy: Math.round(((stats.correctCount + (lastAnswer?.isCorrect ? 1 : 0)) / totalQuestions) * 100),
          averageTime: Math.round(
            stats.timeSpent.reduce((total, time) => total + time, 0) / totalQuestions
          ),
        }
      });
    }
  };

  const handleOptionSelect = (option) => {
    if (quizState.isAnswerLocked) return;

    const isCorrect = option === quizState.question?.correctAnswer;
    const timeBonus = isCorrect ? Math.floor(quizState.countdown / 2) : 0;
    const pointsEarned = isCorrect ? 100 + timeBonus : 0;
    const newStreak = isCorrect ? quizState.streak + 1 : 0;

    setQuizState(prev => ({
      ...prev,
      selectedOption: option,
      isAnswerLocked: true,
    }));

    // Update statistics immediately for final results
    setStats(prev => ({
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

    // Delay display score and streak update until next question
    setTimeout(() => {
      setQuizState(prev => ({
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
      />
    );
  }

  const layoutProps = {
    siteData,
    progress: quizState.progress,
    question: quizState.question,
    isAnswerLocked: quizState.isAnswerLocked,
    selectedOption: quizState.selectedOption,
    setSelectedOption: handleOptionSelect,
    countdown: quizState.countdown,
    setIsAnswerLocked: (value) =>
      setQuizState((prev) => ({ ...prev, isAnswerLocked: value })),
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
