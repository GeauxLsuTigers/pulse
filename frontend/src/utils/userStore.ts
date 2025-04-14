import { create } from 'zustand';
import { firebaseAuth, firebaseApp } from 'app';
import { 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot,
  Unsubscribe,
  getFirestore 
} from 'firebase/firestore';

const db = getFirestore(firebaseApp);

export interface UserProfile {
  userId: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: number;
  lastLoginAt: number;
  settings?: {
    emailNotifications?: boolean;
    theme?: 'light' | 'dark' | 'system';
  };
}

interface UserState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: Error | null;
  unsubscribe: Unsubscribe | null;
  
  // Initialize profile listener
  initializeProfileListener: () => Promise<void>;
  
  // Actions
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  clearProfile: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  profile: null,
  isLoading: true,
  error: null,
  unsubscribe: null,
  
  initializeProfileListener: async () => {
    const currentUser = firebaseAuth.currentUser;
    
    // Clear any existing subscription
    if (get().unsubscribe) {
      get().unsubscribe();
    }
    
    if (!currentUser) {
      set({ profile: null, isLoading: false });
      return;
    }
    
    const userId = currentUser.uid;
    const userRef = doc(db, 'users', userId);
    
    try {
      // Check if user document exists
      const docSnap = await getDoc(userRef);
      
      if (!docSnap.exists()) {
        // Create new user profile
        const newProfile: UserProfile = {
          userId,
          email: currentUser.email || '',
          displayName: currentUser.displayName || undefined,
          photoURL: currentUser.photoURL || undefined,
          createdAt: Date.now(),
          lastLoginAt: Date.now(),
        };
        
        await setDoc(userRef, newProfile);
      } else {
        // Update last login
        await setDoc(userRef, { lastLoginAt: Date.now() }, { merge: true });
      }
      
      // Set up real-time listener
      const unsubscribe = onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
          set({ profile: doc.data() as UserProfile, isLoading: false });
        } else {
          set({ error: new Error('User profile not found'), isLoading: false });
        }
      }, (error) => {
        set({ error, isLoading: false });
      });
      
      set({ unsubscribe });
    } catch (error) {
      set({ error: error as Error, isLoading: false });
    }
  },
  
  updateProfile: async (data) => {
    const userId = get().profile?.userId;
    if (!userId) return;
    
    try {
      // Optimistic update
      set({ profile: { ...get().profile!, ...data } });
      
      // Update in Firestore
      await setDoc(doc(db, 'users', userId), data, { merge: true });
    } catch (error) {
      set({ error: error as Error });
      throw error;
    }
  },
  
  clearProfile: () => {
    // Clear any existing subscription
    if (get().unsubscribe) {
      get().unsubscribe();
    }
    
    set({ profile: null, unsubscribe: null, isLoading: false, error: null });
  }
}));