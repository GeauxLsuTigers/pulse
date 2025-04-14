import React from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  onGetStarted: () => void;
}

export const HeroSection = ({ onGetStarted }: Props) => {
  return (
    <div className="container mx-auto px-4 pt-16 pb-24 flex flex-col items-center relative z-10">
      <h2 className="text-5xl font-bold text-center max-w-3xl leading-tight mb-6">
        Transform Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">Sales Prospecting</span> With AI
      </h2>
      <p className="text-xl text-muted-foreground text-center max-w-2xl mb-12">
        Harness the power of AI to identify ideal prospects, generate personalized outreach, and optimize your sales campaigns.
      </p>
      <button 
        onClick={onGetStarted}
        className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium text-lg shadow-lg shadow-blue-700/20 hover:shadow-blue-700/30 transition-all">
        Get Started
      </button>
    </div>
  );
};