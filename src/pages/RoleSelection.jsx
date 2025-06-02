import React from "react";
import roleImage from "../assets/Computer image.avif";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

const RoleSelection = () => {
    const navigate = useNavigate();

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

                {/* Buttons */}
                <div className="flex gap-6">
                    <button
                        onClick={() => {
                            localStorage.setItem("selectedRole", "student");
                            navigate("/login");
                        }}
                        className="bg-[#2525AD] border border-black text-white px-6 py-3 rounded-md font-semibold shadow hover:scale-105 transition"
                    >
                        Login as a Student
                    </button>

                    <button
                        onClick={() => {
                            localStorage.setItem("selectedRole", "teacher");
                            navigate("/login");
                        }}
                        className="border border-black text-black px-6 py-3 rounded-md font-semibold hover:scale-105 transition"
                    >
                        Login as a Teacher
                    </button>
                </div>
            </div>

            {/* Right Section */}
            <div className="w-1/2 relative flex justify-center items-center bg-gradient-to-br from-[#4A63A3] to-[#42868F] z-0 overflow-hidden">
                {/* Curved SVG Edge on Left of Right Section */}
                <div className="absolute top-0 left-[-100px] h-full w-[200px] z-20">
                    <svg
                        viewBox="0 0 200 800"
                        preserveAspectRatio="none"
                        className="h-full w-full"
                    >
                        <path
                            d="M200,0 C150,200 150,600 200,800 L0,800 L0,0 Z"
                            fill="#FAF7F7"
                        />
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
                        Choose your role and dive into a personalized learning experience with EduLearn.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RoleSelection;
