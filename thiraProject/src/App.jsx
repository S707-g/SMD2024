import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./pages/login";
import HomePage from "./pages/homePage";

function App() {
  return( <Router>
    <Routes>
      <Route path="/" element={<Login/>}/>
      <Route path="/homepage" element={<HomePage/>} />
    </Routes>
  </Router>
  )
}

export default App;
