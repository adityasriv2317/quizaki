import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Landing/Home";
import Auth from "./Security/Auth";
import { WebData } from "./Security/WebData";
import AdminDashboard from "./Pages/AdminDashboard";
import QuizRoom from "./Pages/QuizRoom";
import QuizPage from "./Pages/QuizPage";
import Landing from "./Landing/Landing";
import AdminLogin from "./Pages/AdminLogin";
import ProtectedRoute from "./Security/ProtectedRoute";
import { AdminProvider } from "./Security/AdminContext";
import CreateQuiz from "./Admin/CreateQuiz";
import Analytics from "./Admin/Analytics";
import { QuizProvider } from "./Context/QuizContext";
import { AuthProvider } from "./Security/AuthContext";

const App = () => {
  return (
    <AdminProvider>
      <AuthProvider>
        <WebData>
          <QuizProvider>
            <Router>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/auth/:authType" element={<Auth />} />
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* Protected admin routes */}
                <Route
                  path="/admin/*"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/create"
                  element={
                    <ProtectedRoute>
                      <CreateQuiz />
                    </ProtectedRoute>
                  }
                />

                {/* <Route path="/room" element={<QuizRoom />} /> */}
                <Route path="/room/:roomId/:player" element={<QuizRoom />} />
                <Route path="/quiz/:roomCode" element={<QuizPage />} />
              </Routes>
            </Router>
          </QuizProvider>
        </WebData>
      </AuthProvider>
    </AdminProvider>
  );
};

export default App;
