import './App.css';

// App.js - główny plik aplikacji

import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage/Home';
import LoginPage from './components/LoginPage/Login';
import RegisterPage from './components/RegisterPage/Register';
import MyAccountPage from './components/MyAccountPage/MyAccount';
import LogoutPage from './components/LogoutPage/Logout';
import TaggedSongInfo from "./components/TaggedSongInfo/TaggedSongInfo";

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage setUser={setUser} />} />
        <Route path="/register" element={<RegisterPage setUser={setUser} />} />
        <Route path="/my-account" element={<MyAccountPage user={user} />} />
        <Route path="/tagged-song-info" element={<TaggedSongInfo />} />
        <Route path="/logout" component={LogoutPage} />
        <Route path="/" element={<HomePage user={user} />} />
      </Routes>
    </Router>
  );
}

export default App;