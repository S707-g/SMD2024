import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/loginpage/Login.jsx";
import Feed from "./components/feedpage/Feed.jsx";
import { AppointmentProvider } from "./components/feedpage/F-components/feedContent/stupidContext.jsx";
import Layout from "./components/layout/Layout.jsx";
import Profile from "./components/profilePage/Profile.jsx";

function App() {
  return (
    <AppointmentProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route path="/feed" element={<Feed />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </Router>
    </AppointmentProvider>
  );
}

export default App;
