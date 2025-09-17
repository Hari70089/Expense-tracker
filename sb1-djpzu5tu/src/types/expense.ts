export interface Expense {
  id: string;
  amount: number;
  category: 'Food' | 'Travel' | 'Shopping' | 'Other';
  description: string;
  date: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface NewExpense {
  amount: number;
  category: 'Food' | 'Travel' | 'Shopping' | 'Other';
  description: string;
  date: string;
}

export interface ExpenseFilter {
  category?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface ExpenseSummary {
  total: number;
  byCategory: Record<string, number>;
  count: number;
}