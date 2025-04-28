import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Papa from "papaparse";
import {
  faPlus,
  faTrash,
  faSave,
  faQuestionCircle,
  faListUl,
  faArrowLeft,
  faImage,
  faTimes,
  faClock,
  faSpinner,
  faFileUpload,
} from "@fortawesome/free-solid-svg-icons";
import mesh from "/graphics/mesh.svg";
import axios from "axios";

const createAPI = "https://ccc-quiz.onrender.com/admin/CreateQuiz";

const CreateQuiz = () => {
  // Add new state for toggle
  const [isTraditional, setIsTraditional] = useState(true);

  // Add this with other state declarations
  const [csvError, setCsvError] = useState("");

  // Add this with other function declarations
  const handleCsvUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        complete: (results) => {
          try {
            const newQuestions = results.data
              .filter((row) => row.length >= 6) // Skip empty rows
              .map((row) => ({
                question: row[0],
                options: [row[1], row[2], row[3], row[4]],
                correctAnswer: parseInt(row[5]) - 1, // Convert 1-based to 0-based index
                image: null,
                category: row[6] || "",
                difficulty: row[7] || "",
              }));

            if (newQuestions.length > 0) {
              setQuestions([...questions, ...newQuestions]);
              setCsvError("");
            } else {
              setCsvError("No valid questions found in CSV");
            }
          } catch (error) {
            setCsvError("Invalid CSV format");
          }
        },
        error: (error) => {
          setCsvError("Error reading CSV file");
        },
      });
    }
  };
  const navigate = useNavigate();
  const [quizTitle, setQuizTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [timeLimit, setTimeLimit] = useState(30);
  const [questions, setQuestions] = useState([
    {
      question: "",
      options: ["", "", "", ""],
      correctAnswer: null,
      image: null,
      category: "",
      difficulty: "",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        options: ["", "", "", ""],
        correctAnswer: null,
        image: null,
        category: "",
        difficulty: "",
      },
    ]);
  };

  const removeQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuestions(newQuestions);
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  const handleImageUpload = (questionIndex, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateQuestion(questionIndex, "image", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (questionIndex) => {
    updateQuestion(questionIndex, "image", null);
  };

  function generateCode(length = 8) {
    const characters = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // No I, L, O, 1, 0
    let code = '';
    
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters[randomIndex];
    }

    return code;
}

  const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
  
      // Get the questions to validate (skip the first empty question for CSV import)
      const questionsToSubmit = isTraditional ? questions : questions.slice(1);
  
      if (questionsToSubmit.length === 0) {
        alert('Please add at least one question');
        setLoading(false);
        return;
      }
  
      // Validate questions
      const isValid = questionsToSubmit.every(q => 
        q.question.trim() !== '' && 
        q.options.every(opt => opt.trim() !== '') &&
        q.correctAnswer !== null &&
        q.category.trim() !== '' &&
        q.difficulty.trim() !== ''
      );
  
      if (!isValid) {
        alert('Please fill in all required fields for each question');
        setLoading(false);
        return;
      }
  
      // Calculate end time based on total duration
      const startDateTime = new Date(startDate);
      const totalSeconds = questionsToSubmit.length * timeLimit;
      const endDateTime = new Date(startDateTime.getTime() + (totalSeconds * 1000));
  
      // Format quiz data
      const quizData = {
        quizId: `${generateCode()}`,
        email: "saurabhsri.mau@gmail.com",
        quizTitle,
        status: false,
        startQuizTime: startDate,
        endQuiz: endDateTime.toISOString(),
        timeLimit: timeLimit,
        totalQuestions: questionsToSubmit.length,
        questions: questionsToSubmit.map((q, index) => ({
          quesKey: `q${index + 1}`,
          questionText: q.question,
          options: q.options,
          correctAnswer: q.options[q.correctAnswer],
          image: q.image,
          category: q.category,
          difficulty: q.difficulty,
        })),
      };
  
      try {
        const response = await axios.post(createAPI, quizData);

        if (response.status === 201) {
          alert('Quiz created successfully!');
          navigate("/admin/dashboard");
        } else {
          alert('Failed to create quiz. Please try again.');
        }
      } catch (error) {
        alert('Error creating quiz: ' + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    };

    // Add this function to help users format CSV correctly
    const downloadSampleCsv = () => {
      const sampleData = [
        ['', '', '', '', '', '', '', ''],
        ['What is the capital of France?', 'Paris', 'London', 'Berlin', 'Madrid', '1', 'Geography', 'Easy'],
        ['Which planet is known as the Red Planet?', 'Venus', 'Mars', 'Jupiter', 'Saturn', '2', 'Science', 'Medium'],
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([sampleData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'quiz_template.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    };

    return (
      <div className="min-h-screen bg-gradient-to-b from-[rgb(183,67,88)] to-[rgb(242,75,105)]">
        <img
          src={mesh}
          className="absolute h-[88vh] w-screen bottom-0 z-0"
          alt=""
        />

        <div className="relative z-10 px-4 md:px-16 pt-8">
          {/* Navigation and Header */}
          <div className="backdrop-blur-sm rounded-xl shadow-lg p-6 md:p-8 mb-8 border border-white/20">
            <div className="flex flex-wrap items-center justify-between gap-y-4">
              {/* Left Section */}
              <div className="flex flex-wrap items-center gap-4 md:gap-6">
                <button
                  onClick={() => navigate("/admin/dashboard")}
                  className="font-poppins font-semibold text-sm md:text-base z-50 bg-white hover:bg-white text-mag px-4 py-2 rounded-lg shadow-md [text-shadow:3px_3px_12px_rgba(233,74,102,0.4)] flex items-center space-x-2"
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                  <span>Dashboard</span>
                </button>

                <div className="flex items-center space-x-4">
                  <span className="font-oxanium text-2xl text-white">
                    QUIZAKI
                  </span>
                  <div className="h-8 w-px bg-white/20"></div>
                  <div className="hidden md:flex items-center space-x-3">
                    <FontAwesomeIcon
                      icon={faListUl}
                      className="text-[rgb(137,207,251)] text-xl"
                    />
                    <p className="font-semibold text-xl md:text-2xl text-gray-50">
                      Create New Quiz
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Section */}
              <Link
                to="/"
                className="font-poppins font-semibold text-sm md:text-base z-50 bg-white hover:bg-white text-mag px-4 py-2 rounded-lg shadow-md [text-shadow:3px_3px_12px_rgba(233,74,102,0.4)] text-center"
              >
                Home
              </Link>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-8 pb-8 max-w-7xl mx-auto"
          >
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Panel - Quiz Details and Timing */}
              <div className="lg:w-1/3 space-y-6">
                {/* Combined Quiz Details and Timing */}
                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 md:p-8 space-y-6 border border-white/20">
                  <div className="flex items-center space-x-3 mb-6">
                    <FontAwesomeIcon
                      icon={faQuestionCircle}
                      className="text-[rgb(137,207,251)] text-xl"
                    />
                    <h2 className="text-xl font-semibold text-gray-800">
                      Quiz Settings
                    </h2>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quiz Title
                      </label>
                      <input
                        type="text"
                        value={quizTitle}
                        onChange={(e) => setQuizTitle(e.target.value)}
                        className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-[rgb(137,207,251)] focus:border-transparent transition-all duration-200"
                        placeholder="Enter quiz title"
                        required
                      />
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-3 mb-4">
                        <FontAwesomeIcon
                          icon={faClock}
                          className="text-[rgb(137,207,251)] text-xl"
                        />
                        <h3 className="text-lg font-semibold text-gray-800">
                          Timing Settings
                        </h3>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Start Date & Time
                          </label>
                          <input
                            type="datetime-local"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-[rgb(137,207,251)] focus:border-transparent transition-all duration-200"
                            required
                          />
                        </div>
                        {/* <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            End Date & Time
                          </label>
                          <input
                            type="datetime-local"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-[rgb(137,207,251)] focus:border-transparent transition-all duration-200"
                            required
                          />
                        </div> */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Time Limit per Question (seconds) :{" "}
                            <span className="text-gray-600">
                              {" "}
                              {timeLimit} seconds
                            </span>
                          </label>
                        </div>
                        <div className="text-sm text-gray-500">
                          Total Quiz Duration: {questions.length * timeLimit}{" "}
                          seconds
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center bg-black/50 p-2 rounded-md justify-end space-x-3 mb-4">
                  <span className="text-sm text-white">CSV Import</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isTraditional}
                      onChange={() => setIsTraditional(!isTraditional)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[rgb(137,207,251)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[rgb(137,207,251)]"></div>
                  </label>
                  <span className="text-sm text-white">Manual Input</span>
                </div>
              </div>

              {/* Right Panel - Questions */}
              <div className="lg:w-2/3 space-y-6">
                {/* Add toggle switch */}

                {/* Conditional rendering based on toggle */}
                {isTraditional ? (
                  <div className="space-y-6">
                    {questions.map((q, questionIndex) => (
                      <div
                        key={questionIndex}
                        className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 md:p-8 border border-white/20"
                      >
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex-1">
                            <input
                              type="text"
                              value={q.question}
                              onChange={(e) =>
                                updateQuestion(
                                  questionIndex,
                                  "question",
                                  e.target.value
                                )
                              }
                              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-[rgb(137,207,251)] focus:border-transparent transition-all duration-200"
                              placeholder="Enter your question"
                              required
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeQuestion(questionIndex)}
                            className="ml-4 text-red-500 hover:text-red-600 transition-colors"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-2 mb-6">
                          <label className="block text-sm font-medium text-gray-700">
                            Question Image (Optional)
                          </label>
                          {q.image ? (
                            <div className="relative">
                              <img
                                src={q.image}
                                alt="Question preview"
                                className="w-full max-h-48 object-contain rounded-md"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(questionIndex)}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                              >
                                <FontAwesomeIcon icon={faTimes} />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center w-full">
                              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  <FontAwesomeIcon
                                    icon={faImage}
                                    className="w-8 h-8 mb-2 text-gray-500"
                                  />
                                  <p className="mb-2 text-sm text-gray-500">
                                    <span className="font-semibold">
                                      Click to upload
                                    </span>{" "}
                                    or drag and drop
                                  </p>
                                </div>
                                <input
                                  type="file"
                                  className="hidden"
                                  accept="image/*"
                                  onChange={(e) =>
                                    handleImageUpload(questionIndex, e)
                                  }
                                />
                              </label>
                            </div>
                          )}
                        </div>

                        {/* Options */}
                        <div className="space-y-3 md:space-y-4">
                          {q.options.map((option, optionIndex) => (
                            <div
                              key={optionIndex}
                              className="flex items-center space-x-3 md:space-x-4"
                            >
                              <input
                                type="radio"
                                name={`correct-${questionIndex}`}
                                checked={q.correctAnswer === optionIndex}
                                onChange={() =>
                                  updateQuestion(
                                    questionIndex,
                                    "correctAnswer",
                                    optionIndex
                                  )
                                }
                                className="h-5 w-5 text-[rgb(137,207,251)] focus:ring-[rgb(137,207,251)]"
                              />
                              <div className="flex-1">
                                <input
                                  type="text"
                                  value={option}
                                  onChange={(e) =>
                                    updateOption(
                                      questionIndex,
                                      optionIndex,
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-[rgb(137,207,251)] focus:border-transparent transition-all duration-200"
                                  placeholder={`Option ${optionIndex + 1}`}
                                  required
                                />
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Category and Difficulty */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Category
                            </label>
                            <input
                              type="text"
                              value={q.category}
                              onChange={(e) =>
                                updateQuestion(
                                  questionIndex,
                                  "category",
                                  e.target.value
                                )
                              }
                              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-[rgb(137,207,251)] focus:border-transparent transition-all duration-200"
                              placeholder="Enter category"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Difficulty
                            </label>
                            <select
                              value={q.difficulty}
                              onChange={(e) =>
                                updateQuestion(
                                  questionIndex,
                                  "difficulty",
                                  e.target.value
                                )
                              }
                              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-[rgb(137,207,251)] focus:border-transparent transition-all duration-200"
                              required
                            >
                              <option value="">Select difficulty</option>
                              <option value="Easy">Easy</option>
                              <option value="Medium">Medium</option>
                              <option value="Hard">Hard</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <label className="relative cursor-pointer">
                        <input
                          type="file"
                          accept=".csv"
                          onChange={handleCsvUpload}
                          className="hidden"
                        />
                        <div className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-all duration-200 shadow-lg hover:shadow-xl">
                          <FontAwesomeIcon icon={faFileUpload} />
                          <span>Import CSV</span>
                        </div>
                      </label>
                      <button
                        type="button"
                        onClick={downloadSampleCsv}
                        className="px-4 py-2 text-md bg-white/80 rounded-md text-blue-600 hover:text-blue-800 underline"
                      >
                        Download Template
                      </button>
                      {csvError && (
                        <p className="text-red-500 text-sm">{csvError}</p>
                      )}
                    </div>

                    {/* Add this new section */}
                    {questions.length > 1 && (
                      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold text-gray-800">
                            Uploaded Questions: {questions.length - 1}
                          </h3>
                          <button
                            type="button"
                            onClick={() => setQuestions([{
                              question: "",
                              options: ["", "", "", ""],
                              correctAnswer: null,
                              image: null,
                              category: "",
                              difficulty: "",
                            }])}
                            className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all duration-200"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                            <span>Clear All</span>
                          </button>
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                          {questions.slice(1).map((q, idx) => (
                            <div key={idx} className="py-4 border-b border-gray-200 last:border-0">
                              <p className="font-medium text-gray-700">{q.question}</p>
                              <div className="mt-2 space-y-1">
                                {q.options.map((option, optionIndex) => (
                                  <div key={optionIndex} className="flex items-center space-x-2">
                                    <span className={`w-2 h-2 rounded-full ${q.correctAnswer === optionIndex ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                    <p className={`text-sm ${q.correctAnswer === optionIndex ? 'text-green-700 font-medium' : 'text-gray-600'}`}>
                                      {option}
                                    </p>
                                  </div>
                                ))}
                              </div>
                              <p className="text-sm text-gray-500 mt-2">
                                Category: {q.category} | Difficulty: {q.difficulty}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4">
                  {isTraditional && (
                    <button
                      type="button"
                      onClick={addQuestion}
                      className="flex items-center justify-center space-x-2 px-6 py-3 bg-[rgb(137,207,251)] text-white rounded-md hover:bg-[rgb(137,207,251)]/50 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <FontAwesomeIcon icon={faPlus} />
                      <span>Add Question</span>
                    </button>
                  )}
                  <button
                    type="submit"
                    className="flex items-center justify-center space-x-2 px-8 py-3 bg-[rgb(183,67,88)] text-white rounded-md hover:bg-[rgb(183,67,88)]/90 transition-all duration-200 shadow-lg hover:shadow-xl"
                    disabled={loading}
                  >
                    {loading ? (
                      <FontAwesomeIcon icon={faSpinner} spin />
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faSave} />
                        <span>Save Quiz</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
      </div>
    </div>
  );
};

export default CreateQuiz;
