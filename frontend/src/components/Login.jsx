//skeleton level login page, just submit and name form

import { useState } from "react";

const Login = () => {
    const [name, setName] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault(); //This is used to prevent page reload (default state)
    

    //Sending form data to flask backend

    const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {"Content-type": "application/json"},
        body: JSON.stringify({ nm: name})
    });

    if (response.ok) {
        const data = await response.json(); //Get response
        alert (`Success! Hello ${data.name}`);
    } 
    else {
        alert ("Login failed!"); 
    }
};

return (
    <div>
        <h2>Login page</h2>
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
            />
            <button type="submit">Submit</button>
        </form>
    </div>
);
}
export default Login;