import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ activeTab }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        localStorage.removeItem("token");
        navigate('/login');
      } else {
        // handle error if needed
        alert('Logout failed');
      }
    } catch (error) {
      alert('An error occurred during logout');
    }
  };

  const navItems = [
    "Dashboard",
    "GPT",
    "Support",
    "Feedback",
    "Docs",
    "Log Out",
  ];

  return (
    <nav className="bg-black text-white flex justify-between px-6 py-4 items-center">
      <div className="text-xl font-bold">DEXKOR</div>
      <div className="flex gap-6">
        {navItems.map((item) => (
          <button
            key={item}
            onClick={() => item === "Log Out" ? handleLogout() : null}
            className={`px-2 py-1 transition-all duration-200 ${
              activeTab === item
                ? "underline underline-offset-8 decoration-4 decoration-blue-500 text-white font-semibold"
                : "text-gray-300 hover:text-white"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
