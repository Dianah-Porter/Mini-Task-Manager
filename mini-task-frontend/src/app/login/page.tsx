'use client';

import { useState } from "react";

export default function LoginPage(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>){
        event.preventDefault();

        try{
            const URL= 'http://localhost:3000/auth/login';
            const request = await fetch(URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });
            const data = await request.json();
            console.log('Login response: ', data);

            if(!request.ok){
                alert(data.message || "Invalid email or password!")
            }else{
                sessionStorage.setItem('access_token', data.access_token)
                
                alert("Logged in successfully!")
            }
        }
        catch(error){
            console.error("Something went wrong", error);
        }
        
    }

    return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
            <h1 className="mb-2 text-3xl font-bold text-gray-900">Login </h1>

            <form action="" onSubmit={handleSubmit} className="space-y-5">
                <div>
                <label htmlFor="">Email</label>
                <input 
                type="text"
                id="email"
                value={email}
                placeholder="you@example.com"
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
                </div>
                <div>
                <label htmlFor="">Password</label>
                <input 
                type="password"
                id="password"
                value={password}
                placeholder="Enter your password"
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
                </div>

                <div>
                    <button
                    type="submit"
                    className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
                    >LogIn</button>
                </div>

            </form>
        
        </div>
        
    </main>
    )
}