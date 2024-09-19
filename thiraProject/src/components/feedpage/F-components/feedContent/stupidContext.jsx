import { createContext, useState } from "react";

export const appointmentContext = createContext();

export const AppointmentProvider = (props) =>{
    const [appointments, setAppointments] = useState([]);

    return (
        <appointmentContext.Provider value={[appointments, setAppointments]}>
            {props.children}
        </appointmentContext.Provider>
    )

}