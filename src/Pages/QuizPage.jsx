import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useWebData } from "../Security/WebData";
import CountdownTimer from "../assets/CountdownTimer";
import { useMediaQuery } from "react-responsive";
import { Lock, Expand, X } from "lucide-react";
import Spinner from "../assets/Spinner";
import { useQuiz } from "../Context/QuizContext";
import { useAuth } from "../Security/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUndo } from "@fortawesome/free-solid-svg-icons";
import ResultLayout from "./Result";

// Pass props
const DesktopLayout = ({
  siteData,
  progress,
  question,
  selectedOption,
  isAnswerLocked,
  setSelectedOption,
  onResetSelection,
  onTimeUp,
  countdown,
  score,
  streak,
  onNextQuestion,
  onPreviousQuestion,
  currentQuestionIndex,
  totalQuestions,
  stats,
  setQuizState,
  answeredQuestions,
  userAnswers,
}) => {
  // Function to get a consistent emoji based on user data
  const getFixedEmoji = () => {
    const emojis = ["🐶", "🐱", "🦁", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐯"];
    const userString = siteData?.user || siteData?.email || "Guest";
    const hash = userString
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return emojis[hash % emojis.length];
  };

  const userEmoji = getFixedEmoji();

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-[#b74358] to-[#812939] text-white p-4">
      {/* Progress Bar */}
      <div className="flex flex-row justify-between">
        <div className="w-full md:w-1/2 my-auto mx-auto h-3 p-0.5 bg-gray-300 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-red-400 transition-all rounded-md"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        {/* {currentQuestionIndex === totalQuestions - 1 && ( */}
        <button
          onClick={onTimeUp}
          className={`${
            currentQuestionIndex === totalQuestions - 1
              ? "bg-green-500 hover:bg-green-600"
              : "bg-gray-400 cursor-not-allowed"
          }  px-6 py-2 rounded-md shadow-md transition-all text-white font-semibold`}
        >
          Submit
        </button>
        {/* )} */}
      </div>

      {/* Content Container */}
      <div className="flex flex-col md:flex-row flex-grow gap-4 items-center md:items-stretch">
        {/* Left Panel (Fixed Height on Desktop) */}
        <div className="w-full md:w-3/12 h-auto md:h-[80vh] md:mb-0 md:mt-auto bg-gray-200 text-black p-6 shadow-md rounded-md flex flex-col justify-between items-center">
          {/* Timer */}
          <div className="flex items-center justify-center w-full">
            {/* Score Section */}
            {/* <div className="bg-violet-200 font-mono font-light text-lg md:text-2xl px-4 w-3/5 py-2 rounded-md">
              <span className="uppercase">score : {score}</span>
              <div className="text-sm mt-2">streak: {streak}</div>
            </div> */}
            <CountdownTimer
              duration={30}
              onTimeUp={onTimeUp}
              currentTime={countdown}
            />
          </div>

          {/* questions grid */}
          <div className="w-full">
            <h3 className="text-lg font-semibold text-center mb-2">
              Questions
            </h3>
            <div className="grid grid-cols-5 rounded-md gap-2 border-2 p-4 bg-white/20 border-red-600">
              {Array.from({ length: totalQuestions }, (_, index) => {
                let buttonColor = "bg-white text-black"; // Default for unvisited

                if (answeredQuestions.includes(index)) {
                  buttonColor = "bg-green-500 text-white"; // Answered questions stay green
                } else if (index === currentQuestionIndex) {
                  buttonColor = "bg-purple-500 text-white"; // Current question when not answered
                } else if (index < currentQuestionIndex) {
                  buttonColor = "bg-red-500 text-white"; // Visited but not answered
                }

                return (
                  <button
                    key={index}
                    onClick={() => {
                      // Jump to the selected question
                      setQuizState((prev) => {
                        const previousAnswer = prev.userAnswers[index];
                        return {
                          ...prev,
                          currentQuestionIndex: index,
                          selectedOption: previousAnswer || null,
                          isAnswerLocked: !!previousAnswer,
                        };
                      });
                    }}
                    className={`w-8 h-8 rounded-md ${buttonColor} transition-all hover:opacity-80 font-semibold`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-row mb-20 gap-4 items-center justify-between">
            <div className="bg-gray-400 rounded-full w-14 h-14 flex items-center justify-center text-4xl">
              {userEmoji}
            </div>
            <div className="text-left">
              <p className="text-xl md:text-2xl">{siteData?.user || "Guest"}</p>
              <p className="text-sm md:text-base">{siteData?.email || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Right Panel - Question */}
        <div className="w-full md:w-3/4 bg-transparent text-black p-4 md:p-6 rounded-md flex flex-col">
          {question && (
            <>
              {/* Question Text */}
              <div className="shadow-md flex items-center justify-center p-4 bg-red-100 rounded-md mb-4 h-auto md:h-full">
                <h3 className="text-lg md:text-2xl text-center font-semibold">
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
                  <p className="text-lg text-white font-light ml-4 text-center md:text-left">
                    Choose the Correct Option
                  </p>
                  <div className="flex font-semibold text-black/70 justify-end gap-4">
                    {userAnswers[currentQuestionIndex] && (
                      <button
                        onClick={onResetSelection}
                        className="bg-red-300 px-4 py-2 my-auto rounded-md shadow-md transition-all hover:bg-red-400 mr-4"
                      >
                        <FontAwesomeIcon icon={faUndo} className="mr-2" />
                        Reset
                      </button>
                    )}
                    <button
                      onClick={onPreviousQuestion}
                      disabled={currentQuestionIndex === 0}
                      className={`px-4 py-2 rounded-md ${
                        currentQuestionIndex === 0
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-red-400 hover:bg-red-500"
                      } transition-all`}
                    >
                      &lt;
                    </button>
                    <button
                      onClick={onNextQuestion}
                      disabled={currentQuestionIndex === totalQuestions - 1}
                      className={`px-4 py-2 rounded-md ${
                        currentQuestionIndex === totalQuestions - 1
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-red-400 hover:bg-red-500"
                      } transition-all`}
                    >
                      &gt;
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 mx-auto max-w-[90%] md:max-w-[90%]">
                  {question.options.map((option, index) => (
                    <button
                      key={index}
                      disabled={isAnswerLocked && selectedOption !== option}
                      className={`py-3 px-20 md:py-4 rounded-md shadow-md flex flex-row items-center justify-between text-base md:text-lg font-semibold transition-all ${
                        selectedOption === option
                          ? "bg-red-200 text-black ring-2 ring-red-500"
                          : "bg-[rgb(244,230,230)]"
                      } ${
                        isAnswerLocked && selectedOption !== option
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-red-100"
                      }`}
                      onClick={() => setSelectedOption(option)}
                    >
                      {option}
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
  question,
  selectedOption,
  setSelectedOption,
  isAnswerLocked,
  onResetSelection,
  onTimeUp,
  countdown,
  currentQuestionIndex,
  onNextQuestion,
  onPreviousQuestion,
  totalQuestions,
}) => {
  return (
    <div className="min-h-screen w-full bg-gray-300 flex flex-col">
      <div className="p-4 bg-[rgb(185,68,89)] text-white shadow-md">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">
            Question : {currentQuestionIndex + 1}
          </h3>
          {/* <span>Score: {score}</span> */}
          <span>
            Time: {Math.floor(countdown / 60)}:
            {(countdown % 60).toString().padStart(2, "0")}
          </span>
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

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
        {currentQuestionIndex === totalQuestions - 1 && (
          <button
            onClick={onTimeUp}
            className={`${
              currentQuestionIndex === totalQuestions - 1
                ? "bg-mag hover:bg-red-600"
                : "bg-gray-400 cursor-not-allowed"
            } px-6 py-2 rounded-xl shadow-md transition-all text-white font-semibold`}
          >
            Submit
          </button>
        )}
      </div>
      <div className="flex items-center w-full my-3 pr-4 justify-end">
        <div className="flex gap-2">
          <button
            onClick={onPreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className={`px-3 py-2 rounded-md text-sm ${
              currentQuestionIndex === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-400 hover:bg-mag"
            } transition-all`}
          >
            &lt;
          </button>
          <button
            onClick={onNextQuestion}
            disabled={currentQuestionIndex === totalQuestions - 1}
            className={`px-3 py-2 rounded-md text-sm ${
              currentQuestionIndex === totalQuestions - 1
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-400 hover:bg-mag"
            } transition-all`}
          >
            &gt;
          </button>
        </div>
      </div>

      {/* Options Section: Displays answer choices and a timer progress bar */}
      <div className="bg-white py-6 px-6 pb-16 rounded-t-[50px] shadow-md">
        <div className="flex justify-between items-center mb-8">
          <p className="text-xl font-poppins font-bold text-gray-800">
            Select the Correct Option
          </p>
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
      </div>
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
    countdown: 1800, // 30 minutes in seconds
    progress: 0,
    currentQuestionIndex: 0,
    isAnswerLocked: false,
    selectedOption: null,
    question: null,
    displayScore: 0,
    streak: 0,
    answeredQuestions: [], // Track answered questions
    userAnswers: {}, // Store user answers for each question
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

  // Update handleNextQuestion and handlePreviousQuestion
  const handleNextQuestion = () => {
    if (quizState.currentQuestionIndex < currentQuiz.questions.length - 1) {
      const nextIndex = quizState.currentQuestionIndex + 1;
      const previousAnswer = quizState.userAnswers[nextIndex];
      setQuizState((prev) => ({
        ...prev,
        currentQuestionIndex: nextIndex,
        selectedOption: previousAnswer || null,
        isAnswerLocked: !!previousAnswer,
      }));
    }
  };

  const handlePreviousQuestion = () => {
    if (quizState.currentQuestionIndex > 0) {
      const prevIndex = quizState.currentQuestionIndex - 1;
      const previousAnswer = quizState.userAnswers[prevIndex];
      setQuizState((prev) => ({
        ...prev,
        currentQuestionIndex: prevIndex,
        selectedOption: previousAnswer || null,
        isAnswerLocked: !!previousAnswer,
      }));
    }
  };

  // Update timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setQuizState((prev) => {
        if (prev.countdown <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return { ...prev, countdown: 1800 }; // Reset to 30 minutes
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

    // If there's a current answer that hasn't been processed
    if (quizState.selectedOption && !quizState.isAnswerLocked) {
      const isCorrect = quizState.selectedOption === quizState.question?.correctAnswer;
      // Only calculate time bonus for the last question
      const timeBonus = (isCorrect && quizState.currentQuestionIndex === currentQuiz.questions.length - 1) 
        ? Math.floor(quizState.countdown / 2) 
        : 0;
      const pointsEarned = isCorrect ? 100 + timeBonus : 0;

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
            selectedAnswer: quizState.selectedOption,
            correctAnswer: quizState.question?.correctAnswer,
            isCorrect,
            timeLeft: quizState.countdown,
            questionScore: pointsEarned,
            timeBonus,
            streak: quizState.streak,
          },
        ],
      }));
    }

    // Calculate final stats
    const totalQuestions = currentQuiz.questions.length;
    const finalStats = {
      totalScore: stats.actualScore,
      timeBonus: stats.timeBonusTotal,
      correctAnswers: stats.correctCount,
      totalQuestions,
      accuracy: Math.round((stats.correctCount / totalQuestions) * 100),
      averageTime: Math.round(
        stats.timeSpent.reduce((total, time) => total + time, 0) / totalQuestions
      ),
    };

    // Store results in session storage
    const sessionData = {
      code: siteData?.code,
      stats: finalStats,
      globals: globalStreak,
    };
    sessionStorage.setItem("isPlayed", JSON.stringify(sessionData));

    // Show results
    setResults({
      showResults: true,
      quizStats: finalStats,
      globals: globalStreak,
    });
  };

  const handleOptionSelect = (option) => {
    if (quizState.isAnswerLocked) return;

    const isCorrect = option === quizState.question?.correctAnswer;
    // Only calculate time bonus for the last question
    const timeBonus = (isCorrect && quizState.currentQuestionIndex === currentQuiz.questions.length - 1) 
      ? Math.floor(quizState.countdown / 4) 
      : 0;
    const pointsEarned = isCorrect ? 100 + timeBonus : 0;
    
    // Calculate new streak
    const newStreak = isCorrect ? (quizState.streak + 1) : 0;

    setQuizState((prev) => ({
      ...prev,
      selectedOption: option,
      isAnswerLocked: true,
      answeredQuestions: [...prev.answeredQuestions, prev.currentQuestionIndex],
      userAnswers: {
        ...prev.userAnswers,
        [prev.currentQuestionIndex]: option,
      },
      streak: newStreak, // Update streak immediately in quiz state
    }));

    // Update statistics
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

    // Update global streak
    setGlobalStreak((prev) => ({
      score: prev.score + pointsEarned,
      streak: newStreak,
    }));

    // Delay display score update
    setTimeout(() => {
      setQuizState((prev) => ({
        ...prev,
        displayScore: prev.displayScore + pointsEarned,
      }));
    }, quizState.countdown * 1000);
  };

  const handleResetSelection = () => {
    if (quizState.isAnswerLocked) {
      const currentAnswer = stats.answers[stats.answers.length - 1];

      setQuizState((prev) => ({
        ...prev,
        selectedOption: null,
        isAnswerLocked: false,
        answeredQuestions: prev.answeredQuestions.filter(
          (q) => q !== prev.currentQuestionIndex
        ),
        userAnswers: {
          ...prev.userAnswers,
          [prev.currentQuestionIndex]: null,
        },
        streak: currentAnswer.isCorrect ? Math.max(0, prev.streak - 1) : prev.streak, // Adjust streak when resetting
      }));

      // Update stats
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
        score: prev.score - currentAnswer.questionScore,
        streak: currentAnswer.isCorrect ? Math.max(0, prev.streak - 1) : prev.streak,
      }));
    }
  };

  useEffect(() => {
    const siteData = localStorage.getItem("siteData");
    const weUser = siteData ? JSON.parse(siteData) : {};

    const sessionData = sessionStorage.getItem("isPlayed");
    const ssData = sessionData ? JSON.parse(sessionData) : {};

    if (ssData.code == weUser.code) {
      // console.log(ssData);
      setResults({
        showResults: true,
        quizStats: ssData.stats,
        globals: ssData.globals,
      });
    } else {
    }
  }, []);

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
    setSelectedOption: handleOptionSelect,
    onResetSelection: handleResetSelection,
    countdown: quizState.countdown,
    setIsAnswerLocked: (value) =>
      setQuizState((prev) => ({ ...prev, isAnswerLocked: value })),
    onTimeUp: handleTimeUp,
    score: quizState.displayScore,
    currentQuestionIndex: quizState.currentQuestionIndex,
    streak: quizState.streak,
    onNextQuestion: handleNextQuestion,
    onPreviousQuestion: handlePreviousQuestion,
    totalQuestions: currentQuiz?.questions?.length || 0,
    stats: stats,
    setQuizState: setQuizState,
    answeredQuestions: quizState.answeredQuestions,
    userAnswers: quizState.userAnswers,
  };

  return isMobile ? (
    <MobLayout {...layoutProps} />
  ) : (
    <DesktopLayout {...layoutProps} />
  );
};

export default QuizPage;
