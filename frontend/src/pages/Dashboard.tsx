import React from "react";
import { useUserGuardContext } from "app";
import { DashboardLayout } from "../components/DashboardLayout";

export default function Dashboard() {
  const { user } = useUserGuardContext();
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold mb-8">Welcome, {user.displayName || user.email}!</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-card/30 backdrop-blur-sm border border-border/40 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
            <p className="text-muted-foreground mb-4">Configure your sales prospecting workflow by defining your Ideal Customer Profile, setting up campaigns, and managing your prospects.</p>
            <button className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium hover:opacity-90 transition-all">
              Set Up Your ICP
            </button>
          </div>
          
          <div className="bg-card/30 backdrop-blur-sm border border-border/40 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Import Prospects</h2>
            <p className="text-muted-foreground mb-4">Upload your existing prospects database or manually add new prospects to start building your sales pipeline.</p>
            <button className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium hover:opacity-90 transition-all">
              Import Prospects
            </button>
          </div>
          
          <div className="bg-card/30 backdrop-blur-sm border border-border/40 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Create Campaign</h2>
            <p className="text-muted-foreground mb-4">Set up your first outreach campaign with AI-generated personalized messages tailored to your prospects.</p>
            <button className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium hover:opacity-90 transition-all">
              Create Campaign
            </button>
          </div>
        </div>
        
        <div className="bg-card/30 backdrop-blur-sm border border-border/40 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-500/5 to-blue-500/10 rounded-lg p-4 border border-blue-500/10">
              <p className="text-sm text-muted-foreground">Prospects</p>
              <p className="text-2xl font-bold">0</p>
            </div>
            <div className="bg-gradient-to-br from-indigo-500/5 to-indigo-500/10 rounded-lg p-4 border border-indigo-500/10">
              <p className="text-sm text-muted-foreground">Campaigns</p>
              <p className="text-2xl font-bold">0</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500/5 to-purple-500/10 rounded-lg p-4 border border-purple-500/10">
              <p className="text-sm text-muted-foreground">Messages Sent</p>
              <p className="text-2xl font-bold">0</p>
            </div>
            <div className="bg-gradient-to-br from-pink-500/5 to-pink-500/10 rounded-lg p-4 border border-pink-500/10">
              <p className="text-sm text-muted-foreground">Response Rate</p>
              <p className="text-2xl font-bold">0%</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};