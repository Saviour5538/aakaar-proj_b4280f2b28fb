import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createExpense, listExpenses as getExpenses } from '../api/client';

interface ExpenseFormValues {
  description: string;
  amount: number;
  category: string;
  date: string;
}

const ExpensesForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [formValues, setFormValues] = useState<ExpenseFormValues>({
    description: '',
    amount: 0,
    category: '',
    date: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const fetchExpense = async () => {
        setLoading(true);
        setError(null);
        try {
          const expenses = await getExpenses();
          const expense = expenses.find((e) => e.id === parseInt(id));
          if (expense) {
            setFormValues({
              description: expense.description,
              amount: expense.amount,
              category: expense.category,
              date: expense.date,
            });
          }
        } catch (err) {
          setError('Failed to fetch expense details.');
        } finally {
          setLoading(false);
        }
      };

      fetchExpense();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createExpense(formValues);
      navigate('/expenses');
    } catch (err) {
      setError('Failed to save expense.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Expense' : 'Add New Expense'}</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <input
            type="text"
            name="description"
            value={formValues.description}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Amount</label>
          <input
            type="number"
            name="amount"
            value={formValues.amount}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Category</label>
          <input
            type="text"
            name="category"
            value={formValues.category}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Date</label>
          <input
            type="date"
            name="date"
            value={formValues.date}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
};

export default ExpensesForm;