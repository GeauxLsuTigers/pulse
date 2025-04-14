import { create } from 'zustand';
import { collection, doc, addDoc, updateDoc, deleteDoc, onSnapshot, query, where, orderBy, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { MessageTemplate } from './types';

interface MessageState {
  templates: MessageTemplate[];
  isLoading: boolean;
  error: Error | null;
  unsubscribe: (() => void) | null;
  
  // Listener
  initializeTemplatesListener: (userId: string) => void;
  
  // CRUD operations
  addTemplate: (template: Omit<MessageTemplate, 'id' | 'createdAt' | 'updatedAt' | 'variables'>) => Promise<string>;
  updateTemplate: (id: string, data: Partial<MessageTemplate>) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  
  // Clean up
  cleanup: () => void;
}

export const useMessageStore = create<MessageState>((set, get) => ({
  templates: [],
  isLoading: true,
  error: null,
  unsubscribe: null,
  
  initializeTemplatesListener: (userId: string) => {
    // Clear any existing subscription
    if (get().unsubscribe) {
      get().unsubscribe();
    }
    
    const templatesRef = collection(db, 'messageTemplates');
    const templatesQuery = query(
      templatesRef, 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(templatesQuery, (querySnapshot) => {
      const templates = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MessageTemplate[];
      
      set({ templates, isLoading: false });
    }, (error) => {
      console.error("Error listening to templates:", error);
      set({ error, isLoading: false });
    });
    
    set({ unsubscribe });
  },
  
  addTemplate: async (template) => {
    try {
      // Extract variables from content
      const variables = extractVariables(template.content);
      
      const timestamp = Date.now();
      const templatesRef = collection(db, 'messageTemplates');
      const docRef = await addDoc(templatesRef, {
        ...template,
        variables,
        createdAt: timestamp,
        updatedAt: timestamp
      });
      
      return docRef.id;
    } catch (error) {
      console.error("Error adding template:", error);
      throw error;
    }
  },
  
  updateTemplate: async (id, data) => {
    try {
      // If content is being updated, extract variables
      let updatedData = { ...data };
      if (data.content) {
        updatedData.variables = extractVariables(data.content);
      }
      
      updatedData.updatedAt = Date.now();
      
      const templateRef = doc(db, 'messageTemplates', id);
      await updateDoc(templateRef, updatedData);
    } catch (error) {
      console.error("Error updating template:", error);
      throw error;
    }
  },
  
  deleteTemplate: async (id) => {
    try {
      const templateRef = doc(db, 'messageTemplates', id);
      await deleteDoc(templateRef);
    } catch (error) {
      console.error("Error deleting template:", error);
      throw error;
    }
  },
  
  cleanup: () => {
    if (get().unsubscribe) {
      get().unsubscribe();
      set({ unsubscribe: null });
    }
  }
}));

// Helper function to extract variables from template content
function extractVariables(content: string): string[] {
  const pattern = /\{\{([\w_]+)\}\}/g;
  const matches = [];
  let match;
  
  while ((match = pattern.exec(content)) !== null) {
    matches.push(match[1]);
  }
  
  return [...new Set(matches)]; // Return unique variables
}
