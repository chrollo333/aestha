import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import News from "./pages/News";
import Navbar from "./components/Navbar";





const App = () => {

    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

    return (
        <Router>
            <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/explore" element={<Explore isLoggedIn={isLoggedIn} />} />
                <Route path="/news" element={<News />} />
            </Routes>
        </Router>
    );
}

export default App;