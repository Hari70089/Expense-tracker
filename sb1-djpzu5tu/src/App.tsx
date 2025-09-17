import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { supabase, isConfigured } from './lib/supabase';
import { Auth } from './components/Auth';
import { Header } from './components/Header';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { ExpenseFilters } from './components/ExpenseFilters';
import { ExpenseSummary } from './components/ExpenseSummary';
import { useAuth } from './hooks/useAuth';
import { useExpenses } from './hooks/useExpenses';
import { Expense, ExpenseFilter } from './types/expense';

export default function App() {
  console.log('App component rendering...');
  console.log('Supabase configured:', isConfigured);
  
  const { user, loading: authLoading } = useAuth();
  const { 
    expenses, 
    loading: expensesLoading, 
    addExpense, 
    updateExpense, 
    deleteExpense, 
    fetchExpenses,
    getSummary 
  } = useExpenses();
  
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [filter, setFilter] = useState<ExpenseFilter>({});

  console.log('Auth loading:', authLoading, 'User:', user);
  // Apply filters when filter changes
  useEffect(() => {
    if (user) {
      fetchExpenses(filter);
    }
  }, [filter, user]);

  const handleAddExpense = async (expenseData: any) => {
    const result = await addExpense(expenseData);
    return result;
  };

  const handleUpdateExpense = async (expenseData: any) => {
    if (!editingExpense) return { data: null, error: 'No expense being edited' };
    
    const result = await updateExpense(editingExpense.id, expenseData);
    if (!result.error) {
      setEditingExpense(null);
    }
    return result;
  };

  const handleDeleteExpense = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      await deleteExpense(id);
    }
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
  };

  const handleClearFilters = () => {
    setFilter({});
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (!isConfigured) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Setup Required</h1>
            <p className="text-gray-600 mb-6">
              Please configure your Supabase credentials to use the Expense Tracker.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 text-left">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Step 1:</strong> Click "Connect to Supabase" in the top right
              </p>
              <p className="text-sm text-gray-700">
                <strong>Step 2:</strong> Update your .env file with your Supabase credentials
              </p>
            </div>
          </div>
        </div>
      );
    }
    return <Auth />;
  }

  const summary = getSummary();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Summary Cards */}
          <ExpenseSummary summary={summary} />

          {/* Expense Form */}
          <ExpenseForm 
            onSubmit={editingExpense ? handleUpdateExpense : handleAddExpense}
            editingExpense={editingExpense}
            onCancel={editingExpense ? handleCancelEdit : undefined}
          />

          {/* Filters */}
          <ExpenseFilters 
            filter={filter}
            onFilterChange={setFilter}
            onClearFilters={handleClearFilters}
          />

          {/* Expense List */}
          <ExpenseList
            expenses={expenses}
            onEdit={handleEditExpense}
            onDelete={handleDeleteExpense}
            loading={expensesLoading}
          />
        </div>
      </main>
    </div>
  );
}