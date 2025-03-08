import React, { useState, useEffect } from "react";
import hero from "/imgs/hero.svg";
import Carousel from "./Carousel";
import ThreeDModel from "../Model/ThreeDModel";

import { useWebData, WebData } from "../Security/WebData";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const [cta, setCta] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { siteData, setSiteData } = useWebData();
  const [roomCode, setRoomCode] = useState("");
  const navigate = useNavigate();

  const joinRoom = (e) => {
    e.preventDefault();

    if (!roomCode.trim()) {
      console.error("Room code is required!");
      return;
    }

    if (!siteData?.user) {
      console.error("User information is missing!");
      return;
    }

    try {
      setSiteData((prev) => ({
        ...prev,
        code: roomCode,
      }));
      setHasSubmitted(true);
    } finally {
      console.log("updated");
    }
  };

  useEffect(() => {
    if (
      hasSubmitted &&
      roomCode &&
      siteData.code === roomCode &&
      siteData.user
    ) {
      console.log("code:", siteData.code, "roomCode:", roomCode);
      navigate(`/room/${roomCode}/${siteData.user}`);
    }
  }, [hasSubmitted, siteData.code, roomCode, siteData.user, navigate]);

  return (
    <div className="flex flex-col md:flex-row text-white md:justify-between w-full md:mt-24 mt-6 h-screen">
      {/* Left  */}
      <div className="flex flex-col md:w-1/2 mt-4 items-start mb-8">
        <p className="font-semibold text-lg md:text-xl [text-shadow:3px_3px_12px_rgba(0,0,0,0.5)]">
          PLAY AND IMPROVE
        </p>
        <p className="font-semibold text-3xl md:text-6xl [text-shadow:3px_3px_12px_rgba(0,0,0,0.5)] mt-4 leading-tight">
          The Ultimate Brain Training Platform
        </p>
        <p className="text-md mt-6 md:mt-10 [text-shadow:3px_3px_12px_rgba(0,0,0,0.5)]">
          Loop is where stories unfold, connections are made, and memories are
          shared. Whether you're a storyteller, a listener, or somewhere in
          between, there's a place for you in our community.
        </p>

        {/* cta */}
        <div className="flex flex-wrap space-x-3 mt-6">
          <button
            onClick={() => setCta(true)}
            className="bg-mag hover:bg-[rgb(209,71,94)] border border-red-800 [text-shadow:3px_3px_12px_rgba(0,0,0,0.4)] px-4 py-2 rounded-md shadow-xl"
          >
            Play Now
          </button>
          <button
            onClick={() => {
              const element = document.getElementById("features");
              if (element) {
                element.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="bg-[rgb(245,245,245)] hover:bg-white text-mag px-4 [text-shadow:3px_3px_12px_rgba(233,74,102,0.4)] py-2 rounded-md shadow-xl border border-mag"
          >
            Learn More
          </button>
        </div>
      </div>

      {/* Right  */}
      <div className="md:w-1/3 mt-8 md:mt-0">
        <img src={hero} alt="Hero" />
      </div>

      {/* cta div */}
      <div
        role="dialog"
        aria-modal="true"
        className={`${
          cta ? "flex fixed" : "hidden"
        } top-0 left-0 w-full h-full bg-black bg-opacity-50 items-center justify-center z-50`}
      >
        <div className="bg-gradient-to-b from-[rgb(183,67,88)] to-[rgb(129,41,57)] max-w-[80vw] shadow-xl mx-auto max-h-screen overflow-auto border rounded-lg">
          <button
            onClick={() => {
              setCta(false);
              setRoomCode("");
              setSiteData((prev) => ({
                ...prev,
                code: "",
              }));
              setHasSubmitted(false);
            }}
            className="relative z-[52] top-0 right-0 border font-oxanium font-bold bg-white text-mag [text-shadow:3px_3px_12px_rgba(0,0,0,0.4)] px-4 py-2 rounded-br-xl"
            aria-label="Close Modal"
          >
            X
          </button>

          {siteData?.isLogin ? (
            <div className="font-oxanium text-center px-6 py-6 my-2 mx-2">
              <p className="text-white text-xl font-semibold">
                Enter room code to continue
              </p>
              <form
                onSubmit={joinRoom}
                className="flex flex-col items-center mt-4"
              >
                <input
                  type="text"
                  name="roomCode"
                  className="rounded-md px-4 py-2 w-full text-center text-gray-700 text-sm md:text-base"
                  placeholder="Enter room code here..."
                  onChange={(e) => {
                    setRoomCode(e.target.value);
                  }}
                  value={roomCode}
                />
                <button
                  type="submit"
                  className="bg-mag hover:bg-[rgb(209,71,94)] cursor-pointer font-oxanium border [text-shadow:3px_3px_12px_rgba(0,0,0,0.4)] px-4 py-2 rounded-md shadow-xl mt-2"
                >
                  Join
                </button>
              </form>
            </div>
          ) : (
            <div className="font-oxanium text-center px-6 py-2 mx-2">
              <p className="text-white text-xl my-6 font-semibold">
                You need to register to continue
              </p>
              <span
                onClick={() => {
                  navigate("/auth/register");
                }}
                className="bg-mag hover:bg-[rgb(209,71,94)] bt-5 font-oxanium border [text-shadow:3px_3px_12px_rgba(0,0,0,0.4)] px-4 py-2 rounded-md shadow-xl cursor-pointer"
              >
                Register &gt;&gt;
              </span>
              <br />
              <br />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Landing;
