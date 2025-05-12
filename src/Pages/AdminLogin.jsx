import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAdminContext } from "../Security/AdminContext";
import authImg from "/graphics/auth.svg";
import mesh from "/graphics/mesh.svg";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";

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

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loginLoader, setLoginLoader] = useState(false);
  const [mouseOnButton, setMouseOnButton] = useState(true);
  const [captcha, setCaptcha] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);

  const api = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAdminContext();

  // Get the location they tried to visit before being redirected
  const from = location.state?.from?.pathname || "/admin/dashboard";

  function onChange(value) {
    // console.log("Captcha value:", value);
    setCaptchaToken(value);
    setCaptcha(!!value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");

    if (!captcha) {
      setMessageType("error");
      setMessage("Please complete the reCAPTCHA!");
      return;
    }

    if (!email || !password) {
      setMessageType("error");
      setMessage("Please fill out all fields.");
      return;
    }

    const adminData = {
      email: email,
      password: password,
    };

    const loginAPI = `${api}/user/login`;

    try {
      setLoginLoader(true);

      const response = await axios.post(loginAPI, adminData);
      if (response.status === 200) {
        login(email);
        navigate(from, { replace: true });
      }
      setMessageType("success");
      setMessage("Login successful!");
    } catch (err) {
      setMessageType("error");
      setMessageType("error");
      setMessage("An error occurred during login");
    } finally {
      setLoginLoader(false);
    }
  };

  // Redirect if already logged in
  useEffect(() => {
    const adminData = localStorage.getItem("adminData");
    if (adminData) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [navigate]);

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
            className="font-poppins font-semibold text-sm md:text-base z-50 md:bg-[rgb(245,245,245)] bg-white hover:bg-white text-mag p-2 rounded-lg shadow-md [text-shadow:3px_3px_12px_rgba(233,74,102,0.4)]"
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
              ADMIN LOGIN
            </p>
            <p className="text-sm md:text-lg text-center mt-2">
              [ Enter your admin credentials to access the dashboard ]
            </p>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col text-gray-700 space-y-4 px-2 md:px-8 py-14"
            >
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-md px-4 py-2 w-full text-sm md:text-base"
                placeholder="Enter admin email"
              />

              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-md px-4 py-2 w-full text-sm md:text-base"
                placeholder="Enter admin password"
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
