import React from "react";

const Appointments = (props) => {
  return (
    <div className="flex w-full p-20 border-2">
      <div>Title: {props.title}</div>
      <div>date {props.date}</div>
    </div>
  );
};

export default Appointments;
