"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function LoginPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const [error, setError] = useState("");

        const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
    
            const result = await signIn("credentials", {
                redirect: false,
                email,  
                password,
            }).then((result) => {
                if (result?.error) {    
                    setError("Invalid email or password");
                } else {
                    router.push("/dashboard");
                }
            });
        };
    
        return (
            <div>
                <h1>Login Page</h1>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="Email"
                    />
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="Password"
                    />
                    {error && <p>{error}</p>}
                    <button type="submit">Login</button>
                </form>
                <div>   
                    dont have an account?
                     <button onClick={() => router.push("/register")}>Register</button> 
                </div>
            </div>
        );
    }
export default LoginPage;