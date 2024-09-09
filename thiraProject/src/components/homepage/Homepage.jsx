import React from "react";
import Header from "./H-compo/Header";
import Welcome from "./H-compo/Welcome";
import Blog from "./H-compo/Blog";
import About from "./H-compo/About";

const Homepage = () => {
  return (
    <div className="flex-col min-h-screen bg-blue-100">
      <Header />
      <Welcome />
      <Blog />
      <About />
    </div>
  );
};
export default Homepage;
