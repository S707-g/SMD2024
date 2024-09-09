import React from "react";

const Blog = () => {
  return (
    <section className="flex-col h-screen relative">
      <div className="h-1/6 flex justify-center">
        <div className="text-6xl font-semibold text-blue-700 w-10/12 pt-10">
          Blog
        </div>
      </div>
      <div className="flex h-5/6 items-center justify-center">
        <div className="border-solid border-2 border-blue-700 w-10/12 h-5/6 flex divide-x-2 divide-blue-700">
          <div className="w-1/3"></div>
          <div className="w-1/3"></div>
          <div className="w-1/3"></div>
        </div>
      </div>
    </section>
  );
};

export default Blog;
