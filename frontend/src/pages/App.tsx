import React from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "app";
// Import components with full paths
import { HeroSection } from "../components/HeroSection";
import { DashboardPreview } from "../components/DashboardPreview";
import { FeaturesSection } from "../components/FeaturesSection";
import { CtaSection } from "../components/CtaSection";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export default function App() {
  const navigate = useNavigate();

  const { user } = useCurrentUser();
  
  const handleGetStarted = () => {
    if (user) {
      navigate("/Dashboard");
    } else {
      navigate("/Login");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative">
      {/* Cosmic background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-5%] left-[10%] w-[30vw] h-[30vw] rounded-full bg-purple-700/10 blur-[100px]"></div>
        <div className="absolute top-[50%] right-[-5%] w-[25vw] h-[25vw] rounded-full bg-blue-700/10 blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[30%] w-[40vw] h-[20vw] rounded-full bg-indigo-700/10 blur-[100px]"></div>
      </div>

      <Header />

      {/* Main content */}
      <main className="relative z-10">
        <HeroSection onGetStarted={handleGetStarted} />
        <DashboardPreview />
        <FeaturesSection />
        <CtaSection onGetStarted={handleGetStarted} />
      </main>

      <Footer />
    </div>
  );
}
