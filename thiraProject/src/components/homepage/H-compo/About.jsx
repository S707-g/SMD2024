import React from "react";
import img1 from "./img/headache.jpg";

const About = () => {
  return (
    <section className="h-screen flex-col bg-blue-200">
      <div className="w-full h-5/6 flex">
        <div className="flex-1 justify-center items-center pl-20 pt-11">
          <div className="text-6xl font-semibold text-blue-700 h-1/6">
            About
          </div>
          <div className="text-xl  text-blue-700 relative h-5/6 text-start w-5/6 leading-relaxed">
            ​Welcome to Thira, your go-to destination for captivating and
            engaging social media blog content. Our mission is to create and
            share compelling stories, insightful articles, and visually stunning
            posts that resonate with our audience. Join us on this exciting
            journey of discovery and inspiration. ​Welcome to Thira, your go-to
            destination for captivating and engaging social media blog content.
            Our mission is to create and share compelling stories, insightful
            articles, and visually stunning posts that resonate with our
            audience. Join us on this exciting journey of discovery and
            inspiration.
          </div>
        </div>
        <div className="flex-1">
          <img
            src={img1}
            alt="headache"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="flex border-2 h-1/6 border-blue-600">
        <div className="text-4xl font-thin text-blue-70 pt-10 pl-20 text-blue-500">Thira </div>
      </div>
    </section>
  );
};

export default About;
