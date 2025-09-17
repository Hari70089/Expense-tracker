import React from 'react';
import { DollarSign, TrendingUp, Calendar, PieChart } from 'lucide-react';
import { ExpenseSummary as Summary } from '../types/expense';

interface ExpenseSummaryProps {
  summary: Summary;
}

export function ExpenseSummary({ summary }: ExpenseSummaryProps) {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const categoryColors = {
    Food: 'bg-green-500',
    Travel: 'bg-blue-500',
    Shopping: 'bg-purple-500',
    Other: 'bg-gray-500',
  };

  const totalCategoryAmount = Object.values(summary.byCategory).reduce((sum, amount) => sum + amount, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Spent</p>
            <p className="text-2xl font-bold text-gray-900">{formatAmount(summary.total)}</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Expenses</p>
            <p className="text-2xl font-bold text-gray-900">{summary.count}</p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Average per Expense</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatAmount(summary.count > 0 ? summary.total / summary.count : 0)}
            </p>
          </div>
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <Calendar className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-gray-600">By Category</p>
          </div>
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <PieChart className="w-6 h-6 text-orange-600" />
          </div>
        </div>
        <div className="space-y-2">
          {Object.entries(summary.byCategory).map(([category, amount]) => (
            <div key={category} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full ${categoryColors[category as keyof typeof categoryColors]}`}
                ></div>
                <span className="text-sm text-gray-600">{category}</span>
              </div>
              <div className="text-sm font-medium text-gray-900">
                {formatAmount(amount)}
                <span className="text-xs text-gray-500 ml-1">
                  ({totalCategoryAmount > 0 ? Math.round((amount / totalCategoryAmount) * 100) : 0}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}