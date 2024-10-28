import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Feed from "./components/feedpage/Feed.jsx";
import Layout from "./components/layout/Layout.jsx";
import Profile from "./components/profilePage/Profile.jsx";
import ChatList from "./components/Chat/ChatList.jsx";
import ChatWindow from "./components/Chat/ChatWindow.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { NavigationProvider } from "./context/NavigationContext.jsx";
import Bookmark from "./components/bookmarkPage/Bookmark";

// Wrapper component to provide `navigate` to `AuthProvider`
function AuthProviderWithNavigate({ children }) {
  const navigate = useNavigate();
  return <AuthProvider navigate={navigate}>{children}</AuthProvider>;
}

function App() {
  return (
    <Router>
      <NavigationProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="/" element={<Feed />} />
              <Route path="bookmarks" element={<Bookmark />} /> 
            <Route path="/chat" element={<ChatList />} />
              <Route path="/chat/:chatId" element={<ChatWindow />} />
              <Route path="/profile/:username" element={<Profile />} />
            </Route>
          </Routes>
        </AuthProvider>
      </NavigationProvider>
    </Router>
  );
}

export default App;
