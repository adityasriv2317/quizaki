import React, { useState } from "react";
import { Link } from "react-router-dom";
import authImg from "/graphics/auth.svg";
import Mailing from "../Landing/Mailing";
import Footer from "../Landing/Footer";

import ReCAPTCHA from "react-google-recaptcha";
import mesh from "/graphics/mesh.svg";
import axios from "axios";

const Auth = () => {
  const [playerName, setPlayerName] = useState("");
  const [email, setEmail] = useState("");
  const [captcha, setCaptcha] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [isLogin, setIsLogin] = useState(false);

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

    // let signupData = {
    //   adminId: adminid,
    //   password: adminpass,
    // };

    const regUrl = `https://ccc-quiz.onrender.com/player/registerPlayer?recaptchaToken=${captchaToken}`;

    const regData = {
      "PlayerName": playerName,
      "email": email,
    };

    try {
      console.log("posting");
      const response = await axios.post(regUrl, regData);
      console.log("Registration response:", response);
      console.log("Registration form submitted:", { playerName, email });
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email) {
      alert("Please enter your email.");
      return;
    }
    console.log("Login form submitted:", { email });
  };

  return (
    <div className="">
      <div className="h-screen px-4 md:px-16 pt-8 text-white bg-gradient-to-b from-[rgb(183,67,88)] to-[rgb(242,75,105)] font-poppins">
        <div className="flex items-center justify-between py-4 px-4 md:px-8">
          <span className="font-oxanium text-2xl md:text-2xl">QUIZAKI</span>
          <Link
            to="/"
            className="font-poppins font-semibold text-sm md:text-base"
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
                >
                  Login
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
                >
                  Register
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
      </div>

      <div className="w-full text-lg mt-24 px-6 md:px-16">
        <Mailing />
        <Footer />
      </div>
    </div>
  );
};

export default Auth;
