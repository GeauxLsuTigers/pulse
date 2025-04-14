import React from "react";
import { useNavigate } from "react-router-dom";
import { useUserGuardContext, firebaseAuth } from "app";
import { DashboardLayout } from "../components/DashboardLayout";

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useUserGuardContext();
  
  const handleSignOut = async () => {
    try {
      await firebaseAuth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="max-w-2xl mx-auto bg-card/30 backdrop-blur-sm border border-border/40 rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-8">User Profile</h1>
          
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{user.displayName || "User"}</h2>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>
            
            <div className="pt-6 border-t border-border/40">
              <h3 className="text-lg font-medium mb-4">Account Settings</h3>
              
              <div className="space-y-4">
                <button 
                  onClick={() => navigate("/Dashboard")}
                  className="w-full px-4 py-3 rounded-lg bg-card border border-border hover:bg-muted transition-all text-left flex justify-between items-center">
                  <span>Dashboard</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </button>
                
                <button 
                  className="w-full px-4 py-3 rounded-lg bg-card border border-border hover:bg-muted transition-all text-left flex justify-between items-center">
                  <span>Edit Profile</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </button>
                
                <button 
                  className="w-full px-4 py-3 rounded-lg bg-card border border-border hover:bg-muted transition-all text-left flex justify-between items-center">
                  <span>Notification Settings</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </button>
                
                <button 
                  onClick={handleSignOut}
                  className="w-full px-4 py-3 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-all text-left flex justify-between items-center">
                  <span>Sign Out</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};