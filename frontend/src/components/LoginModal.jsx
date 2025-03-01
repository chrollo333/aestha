import React, { useState } from "react";
import styles from "../components/Modal.module.css";

const LoginModal = ({ isOpen, onClose, onLogin }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {  "Content-Type": "application/json"},
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();

        if (data.token) {
            localStorage.setItem("token", data.token) //sets token in local storage
            onLogin(); //calls the onLogin function (declared in Navbar.jsx)
            onClose(); //closes the modal
        } else {
            alert("Invalid credentials.")
        }


    };

if (!isOpen) return null;



return (
    <div className={styles.modalContainer}>
        <div className={styles.modalContent}>
            <button onClick={onClose} className={styles.closeButton}>X</button>
            <h2>LOGIN</h2>
            <form onSubmit={handleSubmit}>
                <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Email" />
                <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Password" />
                <button type="submit">Login</button>
            </form>
        </div>
    </div>
);
};

export default LoginModal;