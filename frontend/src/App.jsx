import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home"
import Explore from "./pages/Explore"
//<Route path="/login" element={<Login />} />




const App = () =>{
    return (
        <Router>
                <Routes>
                    
                    <Route path="/"  element={<Home />} /> 
                    <Route path="/explore" element={<Explore />} />
                </Routes>
        </Router>
    );
}
export default App;