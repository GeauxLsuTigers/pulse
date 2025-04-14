import React from "react";

export const DashboardPreview = () => {
  return (
    <div className="mt-24 w-full max-w-5xl mx-auto relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-transparent z-10 h-8"></div>
      <div className="rounded-lg border border-border/40 bg-card/30 backdrop-blur-sm p-6 shadow-xl overflow-hidden">
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-lg p-4 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold">Define Your ICP</h3>
            <p className="text-muted-foreground mt-2">Create detailed ideal customer profiles to target the right prospects</p>
          </div>
          
          <div className="bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 border border-indigo-500/20 rounded-lg p-4 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H2v7"/><path d="M2 12c0 4.97 4.03 9 9 9s9-4.03 9-9"/><path d="M13 19c4.97 0 9-4.03 9-9v-7h-7"/><path d="M21 5a9 9 0 0 0-9 9"/></svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold">Source Prospects</h3>
            <p className="text-muted-foreground mt-2">Easily upload and manage your prospect lists with powerful filtering</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-lg p-4 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold">AI Message Generation</h3>
            <p className="text-muted-foreground mt-2">Create personalized outreach messages with powerful AI assistance</p>
          </div>
        </div>
        
        <div className="flex space-x-6 mb-4">
          <div className="w-1/2 bg-card/50 rounded-lg border border-border/40 p-4">
            <h3 className="text-lg font-medium mb-3">Campaign Performance</h3>
            <div className="flex space-x-4">
              <div className="flex-1 bg-gradient-to-b from-blue-500/5 to-blue-500/10 rounded-lg p-3 border border-blue-500/10">
                <p className="text-sm text-muted-foreground">Total Prospects</p>
                <p className="text-2xl font-bold">687</p>
              </div>
              <div className="flex-1 bg-gradient-to-b from-indigo-500/5 to-indigo-500/10 rounded-lg p-3 border border-indigo-500/10">
                <p className="text-sm text-muted-foreground">Messages Sent</p>
                <p className="text-2xl font-bold">354</p>
              </div>
              <div className="flex-1 bg-gradient-to-b from-purple-500/5 to-purple-500/10 rounded-lg p-3 border border-purple-500/10">
                <p className="text-sm text-muted-foreground">Responses</p>
                <p className="text-2xl font-bold">92</p>
              </div>
            </div>
          </div>
          
          <div className="w-1/2 bg-card/50 rounded-lg border border-border/40 p-4">
            <h3 className="text-lg font-medium mb-3">Response Rate</h3>
            <div className="relative h-28 flex items-center justify-center">
              <div className="w-28 h-28 rounded-full border-8 border-blue-500/20 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border-8 border-blue-500/50 flex items-center justify-center text-2xl font-bold">
                  26%
                </div>
              </div>
              <div className="absolute top-0 right-4 bottom-0 flex flex-col justify-center space-y-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-sm">LinkedIn</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></div>
                  <span className="text-sm">Email</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-card/50 rounded-lg border border-border/40 p-4">
          <h3 className="text-lg font-medium mb-3">Recent Campaigns</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-500/5 to-transparent rounded-lg p-3 border border-blue-500/10">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">Tech Startups Q2</h4>
                <span className="px-2 py-1 text-xs rounded-full bg-green-500/10 text-green-400 border border-green-500/20">Active</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">142 prospects</p>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{width: "65%"}}></div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-indigo-500/5 to-transparent rounded-lg p-3 border border-indigo-500/10">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">Finance Leaders</h4>
                <span className="px-2 py-1 text-xs rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">In Progress</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">98 prospects</p>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{width: "40%"}}></div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500/5 to-transparent rounded-lg p-3 border border-purple-500/10">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">Healthcare Innovators</h4>
                <span className="px-2 py-1 text-xs rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">Draft</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">215 prospects</p>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{width: "15%"}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background to-transparent z-10 h-20"></div>
    </div>
  );
};