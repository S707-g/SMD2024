import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import db from "./firebaseConfig"; // Import Firestore from the config file

const useAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "appointments"));
        const appointmentList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAppointments(appointmentList);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Add a new appointment
  const addAppointment = async (newAppointment) => {
    try {
      const docRef = await addDoc(
        collection(db, "appointments"),
        newAppointment
      );
      setAppointments((prev) => [
        ...prev,
        { id: docRef.id, ...newAppointment },
      ]);
    } catch (err) {
      setError(err.message);
    }
  };

  // Get a single appointment by ID
  const getAppointment = async (id) => {
    try {
      const docRef = doc(db, "appointments", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        throw new Error("No such document!");
      }
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  // Delete an appointment by ID
  const deleteAppointment = async (id) => {
    try {
      await deleteDoc(doc(db, "appointments", id));
      setAppointments((prev) =>
        prev.filter((appointment) => appointment.id !== id)
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // Update an existing appointment by ID
  const updateAppointment = async (id, updatedData) => {
    try {
      const docRef = doc(db, "appointments", id);
      await updateDoc(docRef, updatedData);
      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment.id === id
            ? { ...appointment, ...updatedData }
            : appointment
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  return {
    appointments,
    loading,
    error,
    addAppointment,
    getAppointment,
    deleteAppointment,
    updateAppointment,
  };
};

export default useAppointment;
