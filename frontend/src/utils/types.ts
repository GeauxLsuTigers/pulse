export interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  templateType: 'email' | 'linkedin';
  variables: string[];
  userId: string;
  isDefault: boolean;
  createdAt: number;
  updatedAt: number;
}

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
  website?: string;
  phone?: string;
  notes?: string;
  status: 'new' | 'contacted' | 'responded' | 'qualified' | 'disqualified';
  tags: string[];
  createdAt: number;
  updatedAt: number;
}