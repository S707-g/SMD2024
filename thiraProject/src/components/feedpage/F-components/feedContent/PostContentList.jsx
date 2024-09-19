import Appointments from "./Appointments";
import { useContext, useEffect } from "react";
import { appointmentContext } from "./stupidContext";

export default function PostContentList(){
    const [appointments, setAppointments] = useContext(appointmentContext)

    useEffect(() =>{
       fetch('https://jsonplaceholder.typicode.com/todos')
        .then(res => res.json())
        .then(data => {
            setAppointments(data)
        })
    },[])

    return (
        <>
            {appointments.map(appointment => <Appointments key={appointment.id} title={appointment.title} date={appointment.completed}/>)}
        </>
    )
}