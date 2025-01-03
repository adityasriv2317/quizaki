import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faLinkedin,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";

import playStore from "/graphics/play.svg";
import appStore from "/graphics/ios.svg";

const Footer = () => {
  return (
    <div className="py-8">
      <div className="hidden md:flex flex-col md:flex-row justify-around items-center">
        <div className="justify-center">
          <div className="flex space-x-4">
            <img
              className="w-24 md:w-32 aspect-video object-cover"
              src={playStore}
              alt="Play Store"
            />
            <img
              className="w-24 md:w-32 aspect-video object-cover"
              src={appStore}
              alt="App Store"
            />
          </div>

          <div className="flex items-center justify-evenly mx-auto">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-mag"
            >
              <FontAwesomeIcon icon={faInstagram} className="text-xl" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600"
            >
              <FontAwesomeIcon icon={faLinkedin} className="text-xl" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faGithub} className="text-xl" />
            </a>
          </div>

        </div>
        <div className="grid grid-cols-2 gap-1 text-gray-500 text-center">
          <a className="text-md hover:text-black" href="#">
            Back to Top
          </a>
          <a className="text-md hover:text-black" href="#">
            Events
          </a>
          <a className="text-md hover:text-black" href="#">
            Instructions
          </a>
          <a
            className="text-md hover:underline"
            href="https://new-cccc.vercel.app/"
            target="_blank"
          >
            CCC <FontAwesomeIcon icon={faExternalLinkAlt} className="text-xs text-center" />
          </a>
        </div>
      </div>

      <div className="block md:hidden">
        <div className="flex flex-col justify-center items-center">
          <div className="flex justify-center space-x-4 my-4">
            <img
              className="w-24 aspect-video object-cover"
              src={playStore}
              alt="Play Store"
            />
            <img
              className="w-24 aspect-video object-cover"
              src={appStore}
              alt="App Store"
            />
          </div>
          <div className="flex mx-auto justify-center space-x-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faInstagram} className="text-lg" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faLinkedin} className="text-lg" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faGithub} className="text-lg" />
            </a>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-center mx-4 mt-4">
          <a className="text-xs hover:underline" href="#">
            Back to Top
          </a>
          <a className="text-xs hover:underline" href="#">
            Events
          </a>
          <a className="text-xs hover:underline" href="#">
            Instructions
          </a>
          <a
            className="text-xs hover:underline"
            href="https://new-cccc.vercel.app/"
            target="_blank"
          >
            CCC <FontAwesomeIcon icon={faExternalLinkAlt} className="text-xs" />
          </a>
        </div>
      </div>

      <div className="bg-gray-500 my-4 w-full h-[1px]"></div>

      <div className="flex flex-col md:flex-row justify-between items-center mt-6 px-4">
        <p className="hidden md:block text-mag [text-shadow:3px_3px_12px_rgba(255,93,122,0.5)] text-3xl font-oxanium">
          QUIZAKI
        </p>
        <p className="font-mono text-xs md:text-sm text-center md:text-right">
          QUIZAKI &#xA9; 2024. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
