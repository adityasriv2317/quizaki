import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Landing/Home";
import Auth from "./Security/Auth";
import { WebData } from "./Security/WebData";
import { AdminContext } from "./Security/AdminContext";
import AdminDashboard from "./Pages/AdminDashboard";
import QuizRoom from "./Pages/QuizRoom";

const App = () => {
  return (
    <AdminContext>
      <WebData>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth/:authType" element={<Auth />} />
            <Route path="/admin" element={<AdminDashboard />} />
            {/* <Route path="/room" element={<QuizRoom />} /> */}
            <Route path="/room/:roomId/:player" element={<QuizRoom />} />
          </Routes>
        </Router>
      </WebData>
    </AdminContext>
  );
};

export default App;
