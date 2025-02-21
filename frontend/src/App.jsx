import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Home from "./pages/Home"
import Explore from "./pages/Explore"





const App = () =>{
    return (
        <Router>
                <Routes>
                    
                    <Route path="/"  element={<Home />} /> 
                    <Route path="/login" element={<Login />} />
                    <Route path="/explore" element={<Explore />} />
                </Routes>
        </Router>
    );
}
export default App;