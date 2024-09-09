import React from "react";
import img3 from "./img/Musician.jpg";

const Welcome = () => {
  return (
    <section className="flex h-screen relative mt-[-4rem]">
      <div className="flex-1 p-4 flex items-center justify-center z-10">
        <div className="text-center xl:text-[6rem] sm:text-[2rem] font-semibold text-blue-700">
          Discover <br /> Our World
        </div>
      </div>
      <div className="flex-1 relative">
        <img
          src={img3}
          alt="musicain"
          className="w-full h-full object-cover  z-1"
        />
      </div>
    </section>
  );
};

export default Welcome;
