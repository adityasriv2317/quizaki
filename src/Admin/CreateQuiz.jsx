import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faSave, faQuestionCircle, faListUl, faArrowLeft, faImage, faTimes, faClock, faCalendar } from "@fortawesome/free-solid-svg-icons";
import mesh from "/graphics/mesh.svg";

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [timeLimit, setTimeLimit] = useState(30); // Default 30 seconds per question
  const [questions, setQuestions] = useState([
    { question: '', options: ['', '', '', ''], correctAnswer: 0, image: null }
  ]);

  const addQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], correctAnswer: 0, image: null }]);
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
        updateQuestion(questionIndex, 'image', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (questionIndex) => {
    updateQuestion(questionIndex, 'image', null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add API call to save quiz
    console.log({ 
      quizTitle, 
      quizDescription, 
      startDate, 
      endDate, 
      timeLimit,
      questions 
    });
    navigate('/admin/dashboard');
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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="font-poppins font-semibold text-sm md:text-base z-50 bg-white hover:bg-white text-mag p-2 rounded-lg shadow-md [text-shadow:3px_3px_12px_rgba(233,74,102,0.4)] flex items-center space-x-2"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                <span>Dashboard</span>
              </button>
              <div className="flex items-center space-x-4">
                <span className="font-oxanium text-2xl md:text-2xl mt-1 text-white">QUIZAKI</span>
                <div className="h-8 w-px bg-white/20"></div>
                <div className="flex items-center space-x-3">
                  <FontAwesomeIcon icon={faListUl} className="text-[rgb(137,207,251)] text-xl" />
                  <p className="font-semibold text-xl md:text-2xl text-gray-50">
                    Create New Quiz
                  </p>
                </div>
              </div>
            </div>
            <Link
              to="/"
              className="font-poppins font-semibold text-sm md:text-base z-50 bg-white hover:bg-white text-mag p-2 rounded-lg shadow-md [text-shadow:3px_3px_12px_rgba(233,74,102,0.4)]"
            >
              Home
            </Link>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 pb-8 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Panel - Quiz Details and Timing */}
            <div className="lg:w-1/3 space-y-6">
              {/* Combined Quiz Details and Timing */}
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 md:p-8 space-y-6 border border-white/20">
                <div className="flex items-center space-x-3 mb-6">
                  <FontAwesomeIcon icon={faQuestionCircle} className="text-[rgb(137,207,251)] text-xl" />
                  <h2 className="text-xl font-semibold text-gray-800">Quiz Settings</h2>
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
                      <FontAwesomeIcon icon={faClock} className="text-[rgb(137,207,251)] text-xl" />
                      <h3 className="text-lg font-semibold text-gray-800">Timing Settings</h3>
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
                      <div>
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
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Time Limit per Question (seconds)
                        </label>
                        <input
                          type="number"
                          value={timeLimit}
                          onChange={(e) => setTimeLimit(Math.max(1, parseInt(e.target.value) || 1))}
                          min="1"
                          className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-[rgb(137,207,251)] focus:border-transparent transition-all duration-200"
                          required
                        />
                      </div>
                      <div className="text-sm text-gray-500">
                        Total Quiz Duration: {questions.length * timeLimit} seconds
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Questions */}
            <div className="lg:w-2/3 space-y-6">
              {/* Questions */}
              <div className="space-y-6">
                {questions.map((q, questionIndex) => (
                  <div key={questionIndex} className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 md:p-8 border border-white/20">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-[rgb(137,207,251)] flex items-center justify-center text-white font-semibold">
                          {questionIndex + 1}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">Question {questionIndex + 1}</h3>
                      </div>
                      {questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeQuestion(questionIndex)}
                          className="text-red-500 hover:text-red-700 transition-colors duration-200"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-4 md:space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Question Text
                        </label>
                        <input
                          type="text"
                          value={q.question}
                          onChange={(e) => updateQuestion(questionIndex, 'question', e.target.value)}
                          className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-[rgb(137,207,251)] focus:border-transparent transition-all duration-200"
                          placeholder="Enter your question"
                          required
                        />
                      </div>

                      {/* Image Upload */}
                      <div className="space-y-2">
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
                                <FontAwesomeIcon icon={faImage} className="w-8 h-8 mb-2 text-gray-500" />
                                <p className="mb-2 text-sm text-gray-500">
                                  <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500">PNG, JPG or GIF (MAX. 800x400px)</p>
                              </div>
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(questionIndex, e)}
                              />
                            </label>
                          </div>
                        )}
                      </div>

                      {/* Options */}
                      <div className="space-y-3 md:space-y-4">
                        {q.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center space-x-3 md:space-x-4">
                            <input
                              type="radio"
                              name={`correct-${questionIndex}`}
                              checked={q.correctAnswer === optionIndex}
                              onChange={() => updateQuestion(questionIndex, 'correctAnswer', optionIndex)}
                              className="h-5 w-5 text-[rgb(137,207,251)] focus:ring-[rgb(137,207,251)]"
                            />
                            <div className="flex-1">
                              <input
                                type="text"
                                value={option}
                                onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
                                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-[rgb(137,207,251)] focus:border-transparent transition-all duration-200"
                                placeholder={`Option ${optionIndex + 1}`}
                                required
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons - Moved to right panel */}
              <div className="flex justify-end space-x-4 mt-8">
                <button
                  type="button"
                  onClick={addQuestion}
                  className="flex items-center justify-center space-x-2 px-6 py-3 bg-[rgb(137,207,251)] text-white rounded-md hover:bg-[rgb(137,207,251)]/90 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <FontAwesomeIcon icon={faPlus} />
                  <span>Add Question</span>
                </button>
                <button
                  type="submit"
                  className="flex items-center justify-center space-x-2 px-8 py-3 bg-[rgb(183,67,88)] text-white rounded-md hover:bg-[rgb(183,67,88)]/90 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <FontAwesomeIcon icon={faSave} />
                  <span>Save Quiz</span>
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
