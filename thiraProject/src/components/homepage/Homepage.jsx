import React from "react";
import Header from "./H-compo/Header";
import Welcome from "./H-compo/Welcome";


const Homepage = () => {
  return (
    <div className="flex-col min-h-screen bg-blue-100">
      <Header />
      <Welcome />
    </div>
  );
};
export default Homepage;
