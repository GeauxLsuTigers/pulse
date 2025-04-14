import React from "react";

interface Props {
  onGetStarted: () => void;
}

export const CtaSection = ({ onGetStarted }: Props) => {
  return (
    <section className="container mx-auto px-4 py-16 relative z-10">
      <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden border border-blue-500/20 bg-gradient-to-br from-blue-900/20 to-indigo-900/10 backdrop-blur-sm p-12">
        <h2 className="text-3xl font-bold text-center mb-6">Ready to Transform Your Sales Prospecting?</h2>
        <p className="text-xl text-muted-foreground text-center max-w-2xl mx-auto mb-8">Join ProspectPulse and harness the power of AI to find the right prospects, connect with personalized messaging, and close more deals.</p>
        <div className="flex justify-center">
          <button 
            onClick={onGetStarted}
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium text-lg shadow-lg shadow-blue-700/20 hover:shadow-blue-700/30 transition-all">
            Get Started Now
          </button>
        </div>
      </div>
    </section>
  );
};