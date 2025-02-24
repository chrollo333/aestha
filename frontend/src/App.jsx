import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home"
import Explore from "./pages/Explore"
import Login from "./components/LoginModal"
//<Route path="/login" element={<Login />} />




const App = () =>{
    return (
        <Router>
                <Routes>
                    
                    <Route path="/"  element={<Home />} /> 
                    <Route path="/explore" element={<Explore />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
        </Router>
    );
}
export default App;