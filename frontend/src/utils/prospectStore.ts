import { create } from 'zustand';
import { firebaseApp } from 'app';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  Unsubscribe,
  Timestamp,
  orderBy
} from 'firebase/firestore';

const db = getFirestore(firebaseApp);

export interface Prospect {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  position: string;
  location?: string;
  linkedin?: string;
  notes?: string;
  status: 'new' | 'contacted' | 'responded' | 'qualified' | 'disqualified';
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

interface ProspectState {
  prospects: Prospect[];
  isLoading: boolean;
  error: Error | null;
  unsubscribe: Unsubscribe | null;
  
  // Initialize prospects listener
  initializeProspectsListener: (userId: string) => void;
  
  // CRUD operations
  addProspect: (prospect: Omit<Prospect, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateProspect: (id: string, data: Partial<Prospect>) => Promise<void>;
  deleteProspect: (id: string) => Promise<void>;
  
  // Cleanup
  clearProspects: () => void;
}

export const useProspectStore = create<ProspectState>((set, get) => ({
  prospects: [],
  isLoading: true,
  error: null,
  unsubscribe: null,
  
  initializeProspectsListener: (userId: string) => {
    // Clear any existing subscription
    if (get().unsubscribe) {
      console.log("Clearing existing prospects subscription");
      get().unsubscribe();
    }
    
    console.log("Setting up Firestore listener for prospects with userId:", userId);
    const prospectsRef = collection(db, 'prospects');
    console.log("Collection reference:", prospectsRef);
    
    // Use a simpler query to avoid requiring composite indexes
    const prospectsQuery = query(
      prospectsRef, 
      where('userId', '==', userId)
      // Removed orderBy to prevent requiring composite index
    );
    console.log("Query created:", prospectsQuery);
    
    try {
      const unsubscribe = onSnapshot(prospectsQuery, (querySnapshot) => {
        console.log("Firestore snapshot received with", querySnapshot.docs.length, "documents");
        
        const prospects = querySnapshot.docs.map(doc => {
          console.log("Processing doc:", doc.id, doc.data());
          return {
            id: doc.id,
            ...doc.data()
          };
        }) as Prospect[];
        
        console.log("Setting prospect state with", prospects.length, "prospects");
        set({ prospects, isLoading: false });
      }, (error) => {
        console.error("Firestore snapshot error:", error);
        set({ error: error as Error, isLoading: false });
      });
      
      console.log("Firestore listener set up successfully");
      set({ unsubscribe });
    } catch (err) {
      console.error("Error setting up Firestore listener:", err);
      set({ error: err as Error, isLoading: false });
    }
  },
  
  addProspect: async (prospect) => {
    try {
      const timestamp = Date.now();
      const newProspect = {
        ...prospect,
        createdAt: timestamp,
        updatedAt: timestamp
      };
      
      const docRef = await addDoc(collection(db, 'prospects'), newProspect);
      return docRef.id;
    } catch (error) {
      set({ error: error as Error });
      throw error;
    }
  },
  
  updateProspect: async (id, data) => {
    try {
      await updateDoc(doc(db, 'prospects', id), {
        ...data,
        updatedAt: Date.now()
      });
    } catch (error) {
      set({ error: error as Error });
      throw error;
    }
  },
  
  deleteProspect: async (id) => {
    try {
      await deleteDoc(doc(db, 'prospects', id));
    } catch (error) {
      set({ error: error as Error });
      throw error;
    }
  },
  
  clearProspects: () => {
    // Clear any existing subscription
    if (get().unsubscribe) {
      get().unsubscribe();
    }
    
    set({ prospects: [], unsubscribe: null, isLoading: false, error: null });
  }
}));