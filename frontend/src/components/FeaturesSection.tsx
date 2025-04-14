import React from "react";

export const FeaturesSection = () => {
  return (
    <section className="container mx-auto px-4 py-20 relative z-10">
      <h2 className="text-3xl font-bold text-center mb-16">Supercharge Your Prospecting Workflow</h2>
      
      <div className="grid grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="flex">
            <div className="mr-4 mt-1">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Smart ICP Definition</h3>
              <p className="text-muted-foreground">Define your ideal customer profile with detailed criteria including industry, location, company size, and job titles to target the right prospects.</p>
            </div>
          </div>
          
          <div className="flex">
            <div className="mr-4 mt-1">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/></svg>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Prospect Sourcing</h3>
              <p className="text-muted-foreground">Easily upload your prospect lists via CSV or add them manually. Sort, filter, and organize your prospects based on your ICP criteria.</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-8">
          <div className="flex">
            <div className="mr-4 mt-1">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Messages</h3>
              <p className="text-muted-foreground">Generate personalized outreach messages tailored to each prospect using advanced AI. Create templates for emails and LinkedIn messages.</p>
            </div>
          </div>
          
          <div className="flex">
            <div className="mr-4 mt-1">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-red-600 flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Campaign Management</h3>
              <p className="text-muted-foreground">Create and track outbound campaigns, schedule follow-ups, and monitor key performance metrics to optimize your sales prospecting efforts.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};