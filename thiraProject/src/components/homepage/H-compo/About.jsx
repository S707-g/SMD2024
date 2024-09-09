import React from "react";
import img1 from "./img/headache.jpg";

const About = () => {
  return (
    <section className="h-screen flex">
      <div className="flex-1"></div>
      <div className="flex-1">
        <img src={img1} alt="" />
      </div>
    </section>
  );
};

export default About;
