import React, { createContext, useContext, useReducer, useRef } from 'react';

const QuizContext = createContext();

const quizReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_QUIZ_STATE':
      return {
        ...state,
        ...action.payload,
        score: (action.payload.score || state.score),
        answers: [...(action.payload.answers || state.answers)]
      };
    case 'ADD_ANSWER':
      return {
        ...state,
        answers: [...state.answers, action.payload.answer],
        score: state.score + action.payload.pointsEarned,
        correctAnswers: state.correctAnswers + (action.payload.answer.isCorrect ? 1 : 0),
        timeBonus: state.timeBonus + (action.payload.answer.isCorrect ? Math.floor(action.payload.answer.timeLeft / 2) : 0)
      };
    case 'RESET_QUIZ_STATE':
      return initialState;
    default:
      return state;
  }
};

const initialState = {
  score: 0,
  totalQuestions: 0,
  quizTitle: '',
  accuracy: 0,
  correctAnswers: 0,
  timeBonus: 0,
  answers: [],
  averageTime: 0
};

export const QuizProvider = ({ children }) => {
  const [quizState, dispatch] = useReducer(quizReducer, initialState);
  const stateRef = useRef(quizState);

  const updateQuizState = (newState) => {
    dispatch({
      type: 'UPDATE_QUIZ_STATE',
      payload: newState
    });
  };

  const addAnswer = (answer, pointsEarned) => {
    dispatch({
      type: 'ADD_ANSWER',
      payload: { answer, pointsEarned }
    });
  };

  const resetQuizState = () => {
    dispatch({ type: 'RESET_QUIZ_STATE' });
  };

  return (
    <QuizContext.Provider value={{ 
      quizState, 
      updateQuizState, 
      resetQuizState,
      addAnswer 
    }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};