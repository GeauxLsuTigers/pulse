import { ReactNode, useEffect } from "react";
import { useCurrentUser, firebaseAuth } from "app";
import { Toaster } from "@/components/ui/sonner";
import { useUserStore } from "../utils/userStore";
import { useProspectStore } from "../utils/prospectStore";

interface Props {
  children: ReactNode;
}

/**
 * A provider wrapping the whole app that handles global state and Firebase data subscriptions.
 *
 * This centralizes all data management for the app.
 */
export const AppProvider = ({ children }: Props) => {
  const { user, loading } = useCurrentUser();
  const initializeProfileListener = useUserStore(state => state.initializeProfileListener);
  const clearProfile = useUserStore(state => state.clearProfile);
  const clearProspects = useProspectStore(state => state.clearProspects);
  const initializeProspectsListener = useProspectStore(state => state.initializeProspectsListener);
  
  // Handle auth state changes
  useEffect(() => {
    if (loading) return;
    
    if (user) {
      // User is signed in, initialize data listeners
      initializeProfileListener();
      initializeProspectsListener(user.uid);
    } else {
      // User is signed out, clean up
      clearProfile();
      clearProspects();
    }
  }, [user, loading]);
  
  return (
    <>
      {children}
      <Toaster position="top-right" />
    </>
  );
};