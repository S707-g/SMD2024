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
// import BookmarkPage from './pages/BookmarkPage';
// import FriendsPage from './pages/FriendsPage';

function App() {
  return (
    <Router>
      <AuthProviderWithNavigate>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/feed" element={<Feed />} />
            <Route path="/profile" element={<Profile />} />
            {/* <Route path="/bookmarks" element={<BookmarkPage />} /> */}
            {/* <Route path="/friends" element={<FriendsPage />} /> */}
          </Route>
        </Routes>
      </AuthProviderWithNavigate>
    </Router>
  );
}

export default App;
