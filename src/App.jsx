import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Landing/Home";
import Auth from "./Security/Auth";
import { WebData } from "./Security/WebData";

const App = () => {
  return (
    <WebData>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth/:authType" element={<Auth />} />
        </Routes>
      </Router>
    </WebData>
  );
};

export default App;
