import React, { useEffect, useState } from "react";

const CountdownTimer = ({ duration, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const radius = 50; // SVG Circle radius
  const circumference = 2 * Math.PI * radius; // Full circle length

  useEffect(() => {
    if (timeLeft === 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  const progress = (timeLeft / duration) * circumference;

  return (
    <div className="relative w-28 h-28 flex items-center justify-center">
      <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90">
        {/* Background Circle */}
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="#e0e0e0"
          strokeWidth="8"
          fill="transparent"
        />
        {/* Animated Progress Circle */}
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke={timeLeft <= 5 ? "#ff4444" : "#4caf50"} // Green -> Red if <5s
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-linear"
        />
      </svg>
      {/* Timer Value */}
      <span
        className={`text-2xl font-bold ${
          timeLeft <= 5 ? "text-red-500" : "text-green-600"
        }`}
      >
        {timeLeft}s
      </span>
    </div>
  );
};

export default CountdownTimer;