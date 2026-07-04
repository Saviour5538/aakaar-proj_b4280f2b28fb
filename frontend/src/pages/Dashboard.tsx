import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSummary } from '../api/client';
import { SummaryResponse } from '../types';
import { toast } from 'react-toastify';

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getSummary();
        setSummary(response);
      } catch (err: any) {
        setError('Failed to fetch summary data.');
        toast.error('Error fetching summary data.');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && summary && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-lg font-semibold">Total Categories</h2>
              <p className="text-2xl font-bold">{summary.total_categories}</p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-lg font-semibold">Total Expenses</h2>
              <p className="text-2xl font-bold">{summary.total_expenses}</p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-lg font-semibold">Total Amount Spent</h2>
              <p className="text-2xl font-bold">${summary.total_amount_spent.toFixed(2)}</p>
            </div>
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Recent Expenses</h2>
            <div className="bg-white shadow-md rounded-lg p-4">
              {summary.recent_expenses.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {summary.recent_expenses.map((expense) => (
                    <li key={expense.id} className="py-2 flex justify-between">
                      <span>{expense.name}</span>
                      <span>${expense.amount.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No recent expenses found.</p>
              )}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                onClick={() => handleNavigate('/categories')}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600"
              >
                Manage Categories
              </button>
              <button
                onClick={() => handleNavigate('/expenses')}
                className="bg-green-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-600"
              >
                Add Expense
              </button>
              <button
                onClick={() => handleNavigate('/summary')}
                className="bg-purple-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-purple-600"
              >
                View Summary
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;