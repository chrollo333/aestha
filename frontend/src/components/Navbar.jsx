import React from "react";
import { Link } from "react-router-dom";
import styles from "../components/Navbar.module.css"; // Import CSS module


const Navbar = () => {
    return(
        <nav className={styles.navbar}>
        <Link to="/">HOME</Link>
        <span> | </span>
        <Link to="/explore">EXPLORE</Link>
        <span> | </span>
        <Link to="/news">NEWS</Link>
      </nav>
    );
};

export default Navbar