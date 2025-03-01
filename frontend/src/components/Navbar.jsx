import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../components/Navbar.module.css"; 
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal"






const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  
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
    console.log("setIsLoggedIn in Navbar:", setIsLoggedIn);

  return (
    <nav className={styles.navbar}>
      <Link to="/">HOME</Link>
      <span> | </span>
      <Link to="/explore">EXPLORE</Link>
      <span> | </span>
      <Link to="/news">NEWS</Link>
      <div className={styles.navbarButtons}>
        {isLoggedIn ? (
          <button onClick={handleLogout}>LOGOUT</button>
        ) : (
          <>
            <button onClick={handleLoginOpen}>LOGIN</button>
            <button onClick={handleRegisterOpen}>REGISTER</button>
          </>
        )}
      </div>
      <LoginModal 
      isOpen={isLoginOpen} 
      onClose={() => setIsLoginOpen(false)} 
      onLogin={() => setIsLoggedIn(true)} />
      <RegisterModal 
      isOpen={isRegisterOpen} 
      onClose={() => setIsRegisterOpen(false)} 
      onRegister={() => setIsLoggedIn(true)} />
    </nav>
  );
};

export default Navbar;