import React from "react";

export const Footer = () => {
  return (
    <footer className="container mx-auto px-4 py-8 border-t border-border/40 mt-12 relative z-10">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 mr-2">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <h1 className="text-xl font-bold">ProspectPulse</h1>
        </div>
        <p className="text-muted-foreground text-sm">© 2025 ProspectPulse. All rights reserved.</p>
      </div>
    </footer>
  );
};