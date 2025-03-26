import React, { useEffect, useState, useRef } from "react";

const CountdownTimer = ({ duration, onTimeUp, currentTime }) => {
  const [timeLeft, setTimeLeft] = useState(currentTime);
  const startTimeRef = useRef(Date.now());
  const frameRef = useRef(null);
  const radius = 50;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    // Reset start time when currentTime changes
    startTimeRef.current = Date.now();
    setTimeLeft(currentTime);
  }, [currentTime]);

  useEffect(() => {
    const endTime = startTimeRef.current + currentTime * 1000;

    const animate = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((endTime - now) / 1000));

      if (remaining <= 0) {
        setTimeLeft(0);
        onTimeUp();
        cancelAnimationFrame(frameRef.current);
        return;
      }

      setTimeLeft(remaining);
      frameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [currentTime, onTimeUp]);

  const progress = (timeLeft / duration) * circumference;

  return (
    <div className="relative w-28 h-28 flex items-center justify-center">
      <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90">
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="#e0e0e0"
          strokeWidth="8"
          fill="transparent"
        />
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke={timeLeft <= 5 ? "#ff4444" : "#4caf50"}
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.1s linear' }}
        />
      </svg>
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