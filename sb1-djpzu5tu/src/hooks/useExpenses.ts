import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Expense, NewExpense, ExpenseFilter, ExpenseSummary } from '../types/expense';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = async (filter?: ExpenseFilter) => {
    try {
      setLoading(true);
      let query = supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });

      if (filter?.category) {
        query = query.eq('category', filter.category);
      }

      if (filter?.startDate) {
        query = query.gte('date', filter.startDate);
      }

      if (filter?.endDate) {
        query = query.lte('date', filter.endDate);
      }

      if (filter?.search) {
        query = query.ilike('description', `%${filter.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setExpenses(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (expense: NewExpense) => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert([{ ...expense, user_id: (await supabase.auth.getUser()).data.user?.id }])
        .select()
        .single();

      if (error) throw error;
      
      setExpenses(prev => [data, ...prev]);
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add expense';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    }
  };

  const updateExpense = async (id: string, expense: Partial<NewExpense>) => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .update(expense)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setExpenses(prev => prev.map(exp => exp.id === id ? data : exp));
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update expense';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setExpenses(prev => prev.filter(exp => exp.id !== id));
      return { error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete expense';
      setError(errorMessage);
      return { error: errorMessage };
    }
  };

  const getSummary = (): ExpenseSummary => {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const byCategory = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      total,
      byCategory,
      count: expenses.length,
    };
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return {
    expenses,
    loading,
    error,
    fetchExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
    getSummary,
  };
}