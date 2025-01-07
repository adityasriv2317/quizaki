import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import authImg from "/graphics/auth.svg";
import Mailing from "../Landing/Mailing";
import Footer from "../Landing/Footer";

import ReCAPTCHA from "react-google-recaptcha";
import mesh from "/graphics/mesh.svg";
import axios from "axios";

const Auth = () => {
  const { authType } = useParams();

  const [playerName, setPlayerName] = useState("");
  const [email, setEmail] = useState("");

  const [regLoader, setRegLoader] = useState(false);
  const [loginLoader, setLoginLoader] = useState(false);
  const [otpLoader, setOtpLoader] = useState(false);
  const [mouseOnButton, setMouseOnButton] = useState(true);

  const [captcha, setCaptcha] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [isLogin, setIsLogin] = useState(authType === "login");

  const [otpOverlay, setOtpOverlay] = useState(false);

  function onChange(value) {
    console.log("Captcha value:", value);
    setCaptchaToken(value);
    setCaptcha(!!value);
  }

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!captcha) {
      alert("Please complete the reCAPTCHA!");
      return;
    }
    if (!playerName || !email) {
      alert("Please fill out all fields.");
      return;
    }

    const regUrl = `https://ccc-quiz.onrender.com/player/registerPlayer?recaptchaToken=${captchaToken}`;

    const regData = {
      playerName: playerName,
      email: email,
    };

    try {
      console.log("posting");
      setRegLoader(true);
      const response = await axios.post(regUrl, regData);
      console.log("Registration response:", response);
      console.log("Registration form submitted:", { playerName, email });
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setRegLoader(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email) {
      alert("Please enter your email.");
      return;
    }
    try {
      setLoginLoader(true);
    } finally {
      console.log("Login form submitted:", { email });
      setLoginLoader(false);
      setOtpOverlay(true);
    }
  };

  return (
    <div className="">
      <div className="h-screen px-4 md:px-16 pt-8 text-white bg-gradient-to-b from-[rgb(183,67,88)] to-[rgb(242,75,105)] font-poppins">
        <div className="flex items-center justify-between py-4 px-4 md:px-8">
          <span className="font-oxanium text-2xl md:text-2xl">QUIZAKI</span>
          <Link
            to="/"
            className="font-poppins font-semibold text-sm md:text-base z-50 bg-white text-mag p-2 rounded-lg shadow-md [text-shadow:3px_3px_12px_rgba(233,74,102,0.4)]"
          >
            Home
          </Link>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center w-full md:mt-10 space-y-6 md:space-y-0 md:space-x-24 font-oxanium">
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
          <div className="right z-10 py-6 px-6 shadow-lg bg-gradient-to-b from-[rgb(183,67,88)] to-[rgb(129,41,57)] border rounded-lg w-full md:w-2/5 lg:w-1/3 h-auto border-white">
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

            <div className="text-center text-sm md:text-base mb-8">
              {isLogin ? (
                <>
                  New user?{" "}
                  <span
                    onClick={() => {
                      setIsLogin(false);
                      setCaptcha(false);
                    }}
                    className="hover:cursor-pointer text-yellow-300"
                  >
                    Register
                  </span>
                </>
              ) : (
                <>
                  Already registered?{" "}
                  <span
                    onClick={() => {
                      setIsLogin(true);
                      setCaptcha(false);
                    }}
                    className="hover:cursor-pointer text-yellow-300"
                  >
                    Login
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div
          className={`${
            otpOverlay ? "flex absolute" : "hidden"
          } font-oxanium z-20 absolute top-0 left-0 w-full h-full bg-black bg-opacity-45`}
        >
          <div className="mx-auto h-1/2 py-6 px-6 shadow-lg bg-gradient-to-b from-[rgb(183,67,88)] to-[rgb(129,41,57)] border rounded-lg w-full md:w-2/5 lg:w-1/3 border-white justify-center items-center mt-8 text-sm md:text-base ">
            <p className="text-2xl md:text-3xl font-semibold text-center">
              OTP Verification
            </p>
            <p className="text-sm md:text-lg text-center mt-2">
              [ Enter the OTP sent to your email ]
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col space-y-4 px-2 md:px-8 py-14"
            >
              <input
                type="text"
                name="otp"
                id="otp"
                className="rounded-md px-4 py-2 w-full text-gray-700 text-sm md:text-base"
                placeholder="Enter the OTP"
              />

              <p className="text-center cursor-pointer text-sm md:text-base">
                Didn't receive the OTP?{" "}
                <span className="text-yellow-300">Resend OTP</span>
              </p>

              <button
                className={`shadow-sm hover:bg-white hover:text-[rgb(183,67,88)] hover:border-mag hover:shadow-white shadow-mag font-semibold py-2 rounded-md w-3/5 mx-auto border border-white bg-[rgb(242,75,105)] text-white transition`}
                onMouseEnter={() => setMouseOnButton(true)}
                onMouseLeave={() => setMouseOnButton(false)}
              >
                {otpLoader ? (
                  <div
                    className={`loader ${
                      mouseOnButton ? "border-mag" : "border-white"
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
