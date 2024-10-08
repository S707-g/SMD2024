import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Feed from "./components/feedpage/Feed.jsx";
import Layout from "./components/layout/Layout.jsx";
import Profile from "./components/profilePage/Profile.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Feed />} />
          <Route path="/profile/:username" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
