import React from "react";
import { SignInOrUpForm } from "app";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export default function Login() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative">
      {/* Cosmic background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-5%] left-[10%] w-[30vw] h-[30vw] rounded-full bg-purple-700/10 blur-[100px]"></div>
        <div className="absolute top-[50%] right-[-5%] w-[25vw] h-[25vw] rounded-full bg-blue-700/10 blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[30%] w-[40vw] h-[20vw] rounded-full bg-indigo-700/10 blur-[100px]"></div>
      </div>

      <Header />

      <main className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[70vh] relative z-10">
        <div className="max-w-md w-full bg-card/30 backdrop-blur-sm border border-border/40 rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">Welcome Back</h1>
          <p className="text-muted-foreground mb-8">Sign in to access your sales prospecting tools</p>
          
          <SignInOrUpForm signInOptions={{ 
            google: true,
            emailAndPassword: true 
          }} />
        </div>
      </main>

      <Footer />
    </div>
  );
}