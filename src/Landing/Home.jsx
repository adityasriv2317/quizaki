import React from "react";

import Header from "./Header";
import Landing from "./Landing";
import About from "./About";
import Carousel from "./Carousel";
import Footer from "./Footer";
import Mailing from "./Mailing";
import Events from "./Events";

const Home = () => {
  return (
    <div className="bg-[url('/imgs/home.svg')] bg-top md:bg-contain bg-no-repeat font-poppins w-full px-6 md:px-16 pt-8 text-lg">
      <div className="h-screen">
        <Header />
        <Landing />
      </div>

      <About />
      <Carousel />
      {/* <Events /> */}

      <Mailing />
      <Footer />

    </div>
  );
};

export default Home;
