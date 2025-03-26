import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useWebData } from "../Security/WebData";
import CountdownTimer from "../assets/CountdownTimer";
import { useMediaQuery } from "react-responsive";
import { Lock } from "lucide-react";
import { use } from "react";

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

const MobileLayout = ({
  progress,
  question,
  selectedOption,
  setSelectedOption,
  isAnswerLocked,
  onTimeUp,
  countdown,
  score,
}) => {
  return (
    <div className="min-h-screen w-full bg-gray-300 flex flex-col">
      {/* Header Section */}
      <div className="p-4 bg-[rgb(185,68,89)] text-white shadow-md">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold mt-4">
            Question {Math.floor(progress / 10)}
          </h3>
          <div className="text-lg font-semibold">Score: {score}</div>
        </div>
        {/* Progress bar */}
        <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden mt-2">
          <div
            className="h-full bg-red-400 rounded-md transition-all ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Timer */}
      <div className="flex justify-center my-4">
        <CountdownTimer
          duration={30}
          onTimeUp={onTimeUp}
          currentTime={countdown}
        />
      </div>

      {/* Question Content */}
      <div className="flex-grow flex flex-col p-4">
        {question && (
          <div className="shadow-md p-4 bg-red-100 rounded-md mb-4">
            <h3 className="text-xl font-poppins text-center font-semibold mb-4">
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
        )}
      </div>

      {/* Options Section */}
      <div className="bg-white py-6 px-6 rounded-t-[50px] shadow-md">
        <p className="text-xl font-poppins font-bold text-center mb-8 text-gray-800">
          Select the Correct Option
        </p>
        <div className="grid grid-cols-1 gap-6">
          {question?.options.map((option, index) => (
            <button
              key={index}
              disabled={isAnswerLocked && selectedOption !== option}
              className={`flex items-center justify-between p-3 border rounded-full text-xl font-bold transition-all ${
                selectedOption === option
                  ? isAnswerLocked
                    ? option === question.correctAnswer
                      ? "bg-green-200 text-black border-green-400"
                      : "bg-red-200 text-black border-red-400"
                    : "bg-gray-50 text-black border-red-400"
                  : "bg-gray-100 border-gray-200"
              } ${
                isAnswerLocked && selectedOption !== option
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              onClick={() => setSelectedOption(option)}
            >
              <span
                className={`mr-5 font-semibold text-lg text-center rounded-full px-3 py-1 ${
                  selectedOption === option
                    ? "bg-red-400 text-white"
                    : "bg-white shadow-sm text-gray-800"
                }`}
              >
                {String.fromCharCode(65 + index)}
              </span>
              <span className="flex-grow text-left pl-4">{option}</span>
              {selectedOption === option && <Lock size={20} />}
            </button>
          ))}
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
  onTimeUp,
  countdown,
  score,
}) => {
  const [quesNo, setQuesNo] = useState(1);

  useEffect(() => {
    setInterval(() => {
      let q = quesNo
      setQuesNo(q+1)
    }, 30000)
  },[])

  return (
    // Main container with full height and gray background
    <div className="min-h-screen w-full bg-gray-300 flex flex-col">
      {/* Header Section: Displays current question number and progress bar */}
      <div className="p-4 bg-[rgb(185,68,89)] text-white shadow-md">
        <h3 className="text-lg flex flex-row justify-between w-full font-semibold text-left mt-4">
          <span>Question : {quesNo}</span>
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
              onClick={() => setSelectedOption(option)}
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

const QuizPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { siteData } = useWebData();
  const [countdown, setCountdown] = useState(30);
  const [progress, setProgress] = useState(0);
  const [question, setQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [isAnswerLocked, setIsAnswerLocked] = useState(false);
  const quizData = location.state?.quizData;
  const isMobile = useMediaQuery({ maxWidth: 900 });

  useEffect(() => {
    if (!quizData) {
      console.log("No quiz data available");
      return;
    }

    // Since quizData is an array, get the first quiz object
    const currentQuiz = Array.isArray(quizData) ? quizData[0] : quizData;

    if (currentQuiz?.questions) {
      const currentQuestion = currentQuiz.questions[currentQuestionIndex];
      setQuestion(currentQuestion);
      setProgress(
        ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100
      );
    }
  }, [quizData, currentQuestionIndex]);

  const handleTimeUp = () => {
    // Since quizData is an array, get the first quiz object
    const currentQuiz = Array.isArray(quizData) ? quizData[0] : quizData;

    // Always record an answer, even if no option was selected
    const isCorrect = selectedOption === question?.correctAnswer;
    const timeBonus = isCorrect ? Math.floor(countdown / 2) : 0;

    // Update score if answer was correct
    if (isCorrect) {
      setScore((prev) => prev + (100 + timeBonus));
    }

    // Record the answer attempt
    setAnswers((prev) => [
      ...prev,
      {
        quesKey: question?.quesKey || currentQuestionIndex,
        selectedAnswer: selectedOption || "No answer",
        correctAnswer: question?.correctAnswer,
        isCorrect: isCorrect,
        timeLeft: countdown,
        questionScore: isCorrect ? 100 + timeBonus : 0,
      },
    ]);

    // Check if there are more questions
    if (currentQuestionIndex < currentQuiz?.questions?.length - 1) {
      // Reset for next question
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerLocked(false);
      setCountdown(30);
    } else {
      // Quiz completed, navigate to results
      navigate("/results", {
        state: {
          answers: [
            ...answers,
            {
              quesKey: question?.quesKey || currentQuestionIndex,
              selectedAnswer: selectedOption || "No answer",
              correctAnswer: question?.correctAnswer,
              isCorrect: isCorrect,
              timeLeft: countdown,
              questionScore: isCorrect ? 100 + timeBonus : 0,
            },
          ],
          score: isCorrect ? score + (100 + timeBonus) : score,
          totalQuestions: currentQuiz?.questions?.length || 0,
          quizTitle: currentQuiz?.quizTitle || "Quiz",
        },
      });
    }
  };

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

  const handleOptionSelect = (option) => {
    if (!isAnswerLocked) {
      setSelectedOption(option);
      setIsAnswerLocked(true);
    }
  };

  if (!quizData?.questions) {
    return null;
  }

  const layoutProps = {
    siteData,
    progress,
    question,
    isAnswerLocked,
    selectedOption,
    setSelectedOption: handleOptionSelect,
    countdown,
    onTimeUp: handleTimeUp,
    score,
    isAnswerLocked,
  };

  return isMobile ? (
    <MobLayout {...layoutProps} />
  ) : (
    <DesktopLayout {...layoutProps} />
  );
};

export default QuizPage;
