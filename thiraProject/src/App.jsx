import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Feed from "./components/feedpage/Feed.jsx";
import Layout from "./components/layout/Layout.jsx";
import Profile from "./components/profilePage/Profile.jsx";
import MessageList from "./components/messagePage/messageList.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

// Wrapper component to provide `navigate` to `AuthProvider`
function AuthProviderWithNavigate({ children }) {
  const navigate = useNavigate();
  return <AuthProvider navigate={navigate}>{children}</AuthProvider>;
}

function App() {
  return (
    <Router>
      <AuthProviderWithNavigate>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Feed />} />
            <Route path="/message" element={<MessageList />} />
            <Route path="/profile/:username" element={<Profile />} />
          </Route>
        </Routes>
      </AuthProviderWithNavigate>
    </Router>
  );
}

export default App;
