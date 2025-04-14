import React from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "app";

export const Header = () => {
  const navigate = useNavigate();
  const { user, loading } = useCurrentUser();

  return (
    <header className="w-full py-6 px-8 flex justify-between items-center relative z-10">
      <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 mr-3">
          <span className="text-white font-bold text-xl">P</span>
        </div>
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">ProspectPulse</h1>
      </div>
      <div>
        {loading ? (
          <div className="w-20 h-10 bg-muted/20 animate-pulse rounded-lg"></div>
        ) : user ? (
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate("/dashboard")}
              className="px-6 py-2 rounded-lg bg-card border border-border hover:bg-muted transition-all">
              Dashboard
            </button>
            <button 
              onClick={() => navigate("/profile")}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium hover:opacity-90 transition-all">
              Profile
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate("/login")}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium hover:opacity-90 transition-all">
              Sign In
            </button>
          </div>
        )}
      </div>
    </header>
  );
};