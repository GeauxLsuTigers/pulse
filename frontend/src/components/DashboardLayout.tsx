import React, { ReactNode } from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useCurrentUser } from "app";

interface Props {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: Props) => {
  const { user } = useCurrentUser();
  
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative">
      {/* Cosmic background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-5%] left-[10%] w-[30vw] h-[30vw] rounded-full bg-purple-700/10 blur-[100px]"></div>
        <div className="absolute top-[50%] right-[-5%] w-[25vw] h-[25vw] rounded-full bg-blue-700/10 blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[30%] w-[40vw] h-[20vw] rounded-full bg-indigo-700/10 blur-[100px]"></div>
      </div>

      <Header />

      <div className="flex h-[calc(100vh-81px)]">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};