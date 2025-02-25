import React, { useState } from "react";
import styles from "../components/Modal.module.css";

const RegisterModal = ({ isOpen, onClose, onRegister }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:5000/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, username}), 
        });
        const data = await response.json();

        if (data.success) {
            onRegister(); //calls onRegister if data succesful
            onClose(); //closes the modal
        } else {
            alert(data.message || "Registration failed.");
        }

};

if (!isOpen) return null;


return (
    <div className={styles.modalContainer}>
        <div className={styles.modalContent}>
            <button onClick={ onClose } className={styles.closeButton}>X</button>
            <h2>Register</h2>
            <form onSubmit={ handleSubmit }>
                <input type="text" value={ username } onChange={(e) => setUsername(e.target.value)} placeholder="Username"/>
                <input type="email" value={ email } onChange={(e) => setEmail(e.target.value)} placeholder="E-mail"/>
                <input type="password" value={ password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"/>
                <button type="submit">Register</button>
            </form>
        </div>
    </div>
);
};

export default RegisterModal;