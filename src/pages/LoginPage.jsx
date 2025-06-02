import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import roleImage from "../assets/Computer image.avif";
import logo from "../assets/logo.png";

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const selectedRole = localStorage.getItem("selectedRole");
        if (!selectedRole) {
            navigate("/"); // Redirect if no role selected
        } else {
            setRole(selectedRole);
        }
    }, [navigate]);

    const handleLogin = async () => {
        const selectedRole = localStorage.getItem("selectedRole"); // get it directly at the time of login

        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password, role: selectedRole }), // use localStorage directly
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Login failed");
                return;
            }

            // Store token and role
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);
            localStorage.setItem("userId", data.userId);

            navigate(data.role === "teacher" ? "/DashboardTeacher" : "/Dashboard");
        } catch (error) {
            alert("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="flex h-screen w-full font-sans overflow-hidden relative">
            {/* Left Section */}
            <div className="w-1/2 bg-[#FAF7F7] flex flex-col justify-center items-center relative z-10">
                {/* Logo */}
                <div className="flex items-center mb-10">
                    <img src={logo} alt="EduLearn Logo" className="w-20 h-20" />
                    <h1 className="ml-4 text-4xl font-bold leading-tight">
                        <span className="text-[#D62828]">D</span>exkor <br /> Learn
                    </h1>
                </div>

                {/* Form */}
                <div className="flex flex-col gap-4 w-[80%] max-w-md">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border border-black px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2525AD]"
                    />
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border border-black px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#2525AD]"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-sm text-gray-600"
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>

                    {/* Sign In Button */}
                    <button
                        onClick={handleLogin}
                        className="bg-[#2525AD] text-white px-5 py-2 rounded-md font-semibold shadow hover:scale-105 transition"
                    >
                        Sign In
                    </button>
                    <p className="text-sm text-gray-600 mt-2 text-center">
                        Don’t have an account?{" "}
                        <span
                            className="text-[#2525AD] font-semibold cursor-pointer hover:underline"
                            onClick={() => navigate("/register")}
                        >
                            Register
                        </span>
                    </p>

                </div>
            </div>

            {/* Right Section */}
            <div className="w-1/2 relative flex justify-center items-center bg-gradient-to-br from-[#4A63A3] to-[#42868F] z-0 overflow-hidden">
                {/* Curved Edge */}
                <div className="absolute top-0 left-[-100px] h-full w-[200px] z-20">
                    <svg viewBox="0 0 200 800" preserveAspectRatio="none" className="h-full w-full">
                        <path d="M200,0 C150,200 150,600 200,800 L0,800 L0,0 Z" fill="#FAF7F7" />
                    </svg>
                </div>

                {/* Background Ellipse */}
                <div
                    className="absolute w-[600px] h-[600px] -top-24 -left-32 z-0 opacity-50"
                    style={{
                        background:
                            "linear-gradient(179.2deg, #4A63A3 0.69%, rgba(66, 134, 143, 0) 151.24%)",
                        borderRadius: "50%",
                    }}
                ></div>

                {/* Image Card */}
                <div className="relative z-10 bg-white bg-opacity-90 backdrop-blur-sm shadow-xl rounded-xl p-6 flex flex-col items-center max-w-[350px]">
                    <img
                        src={roleImage}
                        alt="Visual"
                        className="w-full h-auto object-contain rounded-md mb-4"
                    />
                    <p className="text-center text-gray-700 text-sm">
                        Welcome back! Sign in to access your learning dashboard.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
