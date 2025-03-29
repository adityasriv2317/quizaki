import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import authImg from "/graphics/auth.svg";
import Mailing from "../Landing/Mailing";
import Footer from "../Landing/Footer";

import ReCAPTCHA from "react-google-recaptcha";
import mesh from "/graphics/mesh.svg";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { useWebData } from "./WebData";

const MessagePrompt = ({ type, message, clearMessage }) => {
  if (!message) return null;

  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";

  return (
    <div
      className={`fixed text-center top-10 left-1/2 flex flex-col items-center justify-center transform -translate-x-1/2 ${bgColor} text-white px-6 py-2 rounded-md shadow-lg z-50`}
    >
      <p>{message}</p>
      <button
        className="text-center text-sm underline hover:text-gray-200"
        onClick={clearMessage}
      >
        Close
      </button>
    </div>
  );
};

const Auth = () => {
  const { authType } = useParams();

  const [playerName, setPlayerName] = useState("");
  const [email, setEmail] = useState("");
  const [userOtp, setUserOtp] = useState("");

  const [regLoader, setRegLoader] = useState(false);
  const [loginLoader, setLoginLoader] = useState(false);
  const [otpLoader, setOtpLoader] = useState(false);
  const [mouseOnButton, setMouseOnButton] = useState(true);

  const [captcha, setCaptcha] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [isLogin, setIsLogin] = useState(authType === "login");

  const [otpOverlay, setOtpOverlay] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const navigate = useNavigate();
  const { userLogin } = useWebData();

  function onChange(value) {
    console.log("Captcha value:", value);
    setCaptchaToken(value);
    setCaptcha(!!value);
  }

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!captcha) {
      setMessageType("error");
      setMessage("Please complete the reCAPTCHA!");
      return;
    }
    if (!playerName || !email) {
      setMessageType("error");
      setMessage("Please fill out all fields.");
      return;
    }

    const regUrl = "https://ccc-quiz.onrender.com/player/registerPlayer";

    const regData = {
      playerName: playerName,
      uid: `${playerName}${email}21`,
      email: email,
      recaptchaToken: captchaToken,
    };

    try {
      console.log("posting");
      // console.log("Registration data:", regData);
      setRegLoader(true);
      const response = await axios.post(regUrl, regData);
      console.log("Registration response:", response);
      console.log("Registration form submitted:", { playerName, email });
      setOtpOverlay(true);
    } catch (error) {
      console.error("Registration error:", error);
      setMessageType("error");
      setMessage("Registration failed. Please try again.");
    } finally {
      setRegLoader(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email) {
      setMessageType("error");
      setMessage("Please enter your email.");
      return;
    }

    try {
      setInterval(() => {
        setLoginLoader(true);
        setOtpOverlay(true);
      }, 5000);
    } catch (error) {
      console.error("Error in login", error);
      setMessage("Login failed. Please check your email and try again.");
    } finally {
      console.log("Login form submitted:", { email });
      setLoginLoader(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();

    if (!userOtp) {
      setMessageType("error");
      setMessage("Please enter the OTP.");
      return;
    }

    const otpAPI = `https://ccc-quiz.onrender.com/player/verifyOtp?email=${email}&otp=${userOtp}`;

    try {
      const res = await axios.post(otpAPI);
      console.log("OTP verified:", res);
      setMessageType("success");
      setMessage("OTP verified successfully. You can now login.");
      userLogin(playerName, email);
      navigate("/");
    } catch (error) {
      console.log("Error in OTP verification", error);
      setMessageType("error");
      setMessage("OTP verification failed. Please try again.");
      console.error(error);
    } finally {
      setOtpLoader(false);
    }
  };

  return (
    <div className="">
      <MessagePrompt
        type={messageType}
        message={message}
        clearMessage={() => setMessage("")}
      />
      <div className="h-screen px-4 md:px-16 pt-8 text-white bg-gradient-to-b from-[rgb(183,67,88)] to-[rgb(242,75,105)] font-poppins">
        <div className="flex items-center justify-between py-4 px-4 md:px-8">
          <span className="font-oxanium text-2xl md:text-2xl">QUIZAKI</span>
          <Link
            to="/"
            className="font-poppins font-semibold text-sm md:text-base z-50 md:bg-[rgb(245,245,245)] bg-white hover:bg-white text-mag py-3 px-6 rounded-lg shadow-md [text-shadow:3px_3px_12px_rgba(233,74,102,0.4)]"
          >
            Home
          </Link>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center w-full mt-6 md:mt-10 space-y-6 md:space-y-0 md:space-x-24 font-oxanium">
          <img
            src={mesh}
            className="absolute h-[88vh] w-screen bottom-0 z-0"
            alt=""
          />

          {/* Left Image */}
          <div className="left hidden md:block md:w-1/2 z-10 lg:w-1/3">
            <img
              src={authImg}
              alt="Auth Illustration"
              className="h-full object-cover"
            />
          </div>

          {/* Right Form */}
          <div className="right z-10 py-6 px-6 shadow-lg bg-gradient-to-b from-[rgb(183,67,88)] to-[rgb(129,41,57)] border rounded-lg w-full md:w-1/2 lg:w-1/3 h-auto border-white">
            <p className="text-2xl md:text-3xl font-semibold text-center">
              {isLogin ? "LOGIN" : "REGISTER"}
            </p>
            <p className="text-sm md:text-lg text-center mt-2">
              {isLogin
                ? "[ Enter your credentials to Login ]"
                : "[ Verify your mail to Login ]"}
            </p>

            {isLogin ? (
              // Login Form
              <form
                onSubmit={handleLogin}
                className="flex flex-col text-gray-700 space-y-4 px-2 md:px-8 py-14"
              >
                <input
                  type="email"
                  name="email"
                  id="email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-md px-4 py-2 w-full text-sm md:text-base"
                  placeholder="Enter your email"
                />

                <ReCAPTCHA
                  sitekey="6LcQ9poqAAAAAEmU3sOsQmC0vdLUV-lqCC2TR0uN"
                  className="md:mx-auto scale-75 md:scale-100"
                  onChange={onChange}
                />

                <button
                  className={`shadow-sm ${
                    captcha
                      ? "cursor-pointer hover:bg-white hover:text-[rgb(183,67,88)] hover:border-mag hover:shadow-white"
                      : "cursor-not-allowed"
                  } shadow-mag font-semibold py-2 rounded-md w-3/5 mx-auto border border-white ${
                    captcha ? "bg-[rgb(242,75,105)]" : "bg-[rgb(199,64,89)]"
                  } text-white transition`}
                  onMouseEnter={() => setMouseOnButton(true)}
                  onMouseLeave={() => setMouseOnButton(false)}
                >
                  {loginLoader ? (
                    <div
                      className={`loader ${
                        mouseOnButton ? "border-mag" : "border-white"
                      } mx-auto border-t-transparent border-4 w-6 h-6 rounded-full animate-spin`}
                    />
                  ) : (
                    "Login"
                  )}
                </button>
              </form>
            ) : (
              // Register Form
              <form
                onSubmit={handleRegister}
                className="flex flex-col text-gray-700 space-y-4 px-2 md:px-8 py-14"
              >
                <input
                  type="text"
                  name="playerName"
                  id="playerName"
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="rounded-md px-4 py-2 w-full text-sm md:text-base"
                  placeholder="Enter your player name"
                />
                <input
                  type="email"
                  name="email"
                  id="email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-md px-4 py-2 w-full text-sm md:text-base"
                  placeholder="Enter your email"
                />

                <ReCAPTCHA
                  sitekey="6LcQ9poqAAAAAEmU3sOsQmC0vdLUV-lqCC2TR0uN"
                  className="md:mx-auto scale-75 md:scale-100"
                  onChange={onChange}
                />

                <button
                  className={`shadow-sm ${
                    captcha
                      ? "cursor-pointer hover:bg-white hover:text-[rgb(183,67,88)] hover:border-mag hover:shadow-white"
                      : "cursor-not-allowed"
                  } shadow-mag font-semibold py-2 rounded-md w-3/5 mx-auto border border-white ${
                    captcha ? "bg-[rgb(242,75,105)]" : "bg-[rgb(199,64,89)]"
                  } text-white transition`}
                  onMouseEnter={() => setMouseOnButton(true)}
                  onMouseLeave={() => setMouseOnButton(false)}
                >
                  {regLoader ? (
                    <div
                      className={`loader ${
                        mouseOnButton ? "border-mag" : "border-white"
                      } mx-auto border-t-transparent border-4 w-6 h-6 rounded-full animate-spin`}
                    />
                  ) : (
                    "Register"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* otp overlay */}
        <div
          className={`${
            otpOverlay ? "flex absolute" : "hidden"
          } font-oxanium z-20 absolute top-0 left-0 w-full h-full bg-black bg-opacity-45`}
        >
          <div className="mx-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-1/2 py-6 px-6 shadow-lg bg-gradient-to-b from-[rgb(183,67,88)] to-[rgb(129,41,57)] border rounded-lg w-full md:w-2/5 lg:w-1/3 border-white justify-center items-center mt-8 text-sm md:text-base ">
            <button
              onClick={() => setOtpOverlay(false)}
              className="relative font-mono text-white text-lg"
            >
              X
            </button>
            <p className="text-2xl md:text-3xl font-semibold text-center">
              OTP Verification
            </p>
            <p className="text-sm md:text-lg text-center mt-2">
              [ Enter the OTP sent to your email ]
            </p>

            <form
              onSubmit={verifyOtp}
              className="flex flex-col space-y-4 px-2 md:px-8 py-14"
            >
              <input
                type="text"
                name="otp"
                id="otp"
                className="rounded-md px-4 py-2 w-full text-gray-700 text-sm md:text-base"
                placeholder="Enter the OTP"
                onChange={(e) => setUserOtp(e.target.value)}
              />

              {/* <p className="text-center cursor-pointer text-sm md:text-base">
                Didn't receive the OTP?{" "}
                <span className="text-yellow-300">Resend OTP</span>
              </p> */}
              <p className="text-center cursor-pointer text-yellow-300 text-sm md:text-base">
                Please check your spam folder if not received within 30 seconds.
              </p>

              <button
                className={`shadow-sm hover:bg-white hover:text-[rgb(183,67,88)] hover:border-mag hover:shadow-white shadow-mag font-semibold py-2 rounded-md w-3/5 mx-auto border border-white bg-[rgb(242,75,105)] text-white transition`}
                onMouseEnter={() => setMouseOnButton(true)}
                onMouseLeave={() => setMouseOnButton(false)}
              >
                {otpLoader ? (
                  <div
                    className={`loader ${
                      mouseOnButton ? "border-mag" : "border-yellow-300"
                    } mx-auto border-t-transparent border-4 w-6 h-6 rounded-full animate-spin`}
                  />
                ) : (
                  "Verify"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="w-full text-lg mt-24 px-6 md:px-16">
        <Mailing />
        <Footer />
      </div>
    </div>
  );
};

export default Auth;
