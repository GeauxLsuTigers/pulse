import React from "react";
import { DashboardLayout } from "../components/DashboardLayout";

export default function Campaigns() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Campaigns</h1>
          <p className="text-muted-foreground">Manage your outreach campaigns</p>
        </div>
        
        <div className="bg-card/30 backdrop-blur-sm border border-border/40 rounded-lg p-8 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Campaign Management Coming Soon</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            The campaign management feature is coming in a future update. Stay tuned!
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}