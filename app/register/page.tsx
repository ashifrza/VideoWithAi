"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function RegisterPage() {
    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState(""); 

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();     
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }   
        
        try {
            // Call the registration API
            //  react query
            //loading state,error handling , data fetching, debouncing, caching
            const res =  await fetch("/api/auth/register", {
                method: "POST",
                headers: {           
                    "Content-Type": "application/json", 
                },                                  
                body: JSON.stringify({ email, password }),
            }); 

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Registration failed");
            };

            console.log(data);
            router.push("/login");


        } catch (error) {
            alert("Registration failed: " + (error as Error).message);
        }
    };



    return <div>
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
            <div>
                <label>Email:</label>
                <input          
                    placeholder="Enter your email"  
                    type="email"
                    value={email}   
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>  
            <div>
                <label>Password:</label>
                <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Confirm Password:</label>
                <input
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Register</button>
        </form>
        <div>   
            <p>Already have an account? <a href="/login">Login here</a>.</p>
        </div>
    </div>;
}

export default RegisterPage;