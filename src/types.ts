export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  createdAt: string;
  preferences: {
    currency: string;
    theme: 'light' | 'dark' | 'system';
  };
}

export interface Expense {
  id?: string;
  userId: string;
  rawText: string;
  amount: number;
  currency: string;
  category: string;
  description: string;
  date: string;
  timestamp: string;
  isAIProcessed: boolean;
  tags: string[];
}

export interface Insight {
  id?: string;
  userId: string;
  type: 'weekly_summary' | 'leak_detection' | 'pattern_alert' | 'coaching_nudge';
  title: string;
  content: string;
  data?: any;
  timestamp: string;
  read: boolean;
}

export interface Subscription {
  id?: string;
  userId: string;
  name: string;
  amount: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly';
  nextBillingDate: string;
  category: string;
  active: boolean;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}
