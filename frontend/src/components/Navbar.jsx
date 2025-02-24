import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../components/Navbar.module.css"; // Import CSS module
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal"






const Navbar = () => {

    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  
    const handleLogout = () => {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
    };
    

    const handleLoginOpen = () => {
      setIsLoginOpen(true);
      setIsRegisterOpen(false);
    };

    const handleRegisterOpen = () => {
      setIsRegisterOpen(true);
      setIsLoginOpen(false);
    };

  return (
    <nav className={styles.navbar}>
      <Link to="/">HOME</Link>
      <span> | </span>
      <Link to="/explore">EXPLORE</Link>
      <span> | </span>
      <Link to="/news">NEWS</Link>
      {isLoggedIn ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
       <>
        <button onClick={handleLoginOpen}>Login</button>
        <button onClick={handleRegisterOpen}>Register</button>
        </> 
      )}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onLogin={() => setIsLoggedIn(true)} />
      <RegisterModal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} onRegister={() => setIsLoggedIn(true)} />
    </nav>
  );
};

export default Navbar;