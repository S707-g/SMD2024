import React, { useContext } from "react";
import PostContentList from "./PostContentList";
import { appointmentContext } from "./stupidContext";

const PostContent1 = (props) => {

    const [appointments, setAppointments] = useContext(appointmentContext)

  return (
    <div className="flex w-full">
      <div>
            Total Appointments: {appointments.length}
            <PostContentList />
      </div>
    </div>
  );
};

export default PostContent1;
