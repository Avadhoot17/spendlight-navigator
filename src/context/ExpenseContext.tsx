
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'sonner';

// Define types
export type ExpenseCategory = 
  | 'food' 
  | 'transportation' 
  | 'housing' 
  | 'entertainment' 
  | 'utilities' 
  | 'healthcare' 
  | 'education' 
  | 'personal' 
  | 'other';

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: string;
  createdAt: string;
}

export const CATEGORIES: {label: string; value: ExpenseCategory}[] = [
  { label: 'Food', value: 'food' },
  { label: 'Transportation', value: 'transportation' },
  { label: 'Housing', value: 'housing' },
  { label: 'Entertainment', value: 'entertainment' },
  { label: 'Utilities', value: 'utilities' },
  { label: 'Healthcare', value: 'healthcare' },
  { label: 'Education', value: 'education' },
  { label: 'Personal', value: 'personal' },
  { label: 'Other', value: 'other' },
];

interface ExpenseState {
  expenses: Expense[];
  filterCategory: ExpenseCategory | 'all';
  filterDateRange: { from: Date | undefined; to: Date | undefined } | null;
}

type ExpenseAction = 
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'UPDATE_EXPENSE'; payload: Expense }
  | { type: 'DELETE_EXPENSE'; payload: string }
  | { type: 'SET_FILTER_CATEGORY'; payload: ExpenseCategory | 'all' }
  | { type: 'SET_FILTER_DATE_RANGE'; payload: { from: Date | undefined; to: Date | undefined } | null }
  | { type: 'LOAD_EXPENSES'; payload: Expense[] };

interface ExpenseContextType extends ExpenseState {
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  updateExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  setFilterCategory: (category: ExpenseCategory | 'all') => void;
  setFilterDateRange: (range: { from: Date | undefined; to: Date | undefined } | null) => void;
  filteredExpenses: Expense[];
  getCategoryTotals: () => Record<ExpenseCategory, number>;
  getTotal: () => number;
}

const initialState: ExpenseState = {
  expenses: [],
  filterCategory: 'all',
  filterDateRange: null,
};

const expenseReducer = (state: ExpenseState, action: ExpenseAction): ExpenseState => {
  switch (action.type) {
    case 'ADD_EXPENSE':
      return {
        ...state,
        expenses: [action.payload, ...state.expenses],
      };
    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map((expense) => 
          expense.id === action.payload.id ? action.payload : expense
        ),
      };
    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter((expense) => expense.id !== action.payload),
      };
    case 'SET_FILTER_CATEGORY':
      return {
        ...state,
        filterCategory: action.payload,
      };
    case 'SET_FILTER_DATE_RANGE':
      return {
        ...state,
        filterDateRange: action.payload,
      };
    case 'LOAD_EXPENSES':
      return {
        ...state,
        expenses: action.payload,
      };
    default:
      return state;
  }
};

// Create context
const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(expenseReducer, initialState);

  // Load expenses from localStorage on initial render
  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses');
    if (savedExpenses) {
      dispatch({ type: 'LOAD_EXPENSES', payload: JSON.parse(savedExpenses) });
    }
  }, []);

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(state.expenses));
  }, [state.expenses]);

  // Filter expenses based on category and date range
  const filteredExpenses = state.expenses.filter((expense) => {
    // Filter by category
    if (state.filterCategory !== 'all' && expense.category !== state.filterCategory) {
      return false;
    }

    // Filter by date range
    if (state.filterDateRange && (state.filterDateRange.from || state.filterDateRange.to)) {
      const expenseDate = new Date(expense.date);
      
      if (state.filterDateRange.from && expenseDate < state.filterDateRange.from) {
        return false;
      }
      
      if (state.filterDateRange.to) {
        const toDateEnd = new Date(state.filterDateRange.to);
        toDateEnd.setHours(23, 59, 59, 999);
        if (expenseDate > toDateEnd) {
          return false;
        }
      }
    }

    return true;
  });

  // Add a new expense
  const addExpense = (expenseData: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    
    dispatch({ type: 'ADD_EXPENSE', payload: newExpense });
    toast.success('Expense added successfully');
  };

  // Update an existing expense
  const updateExpense = (expense: Expense) => {
    dispatch({ type: 'UPDATE_EXPENSE', payload: expense });
    toast.success('Expense updated successfully');
  };

  // Delete an expense
  const deleteExpense = (id: string) => {
    dispatch({ type: 'DELETE_EXPENSE', payload: id });
    toast.success('Expense deleted successfully');
  };

  // Set filter category
  const setFilterCategory = (category: ExpenseCategory | 'all') => {
    dispatch({ type: 'SET_FILTER_CATEGORY', payload: category });
  };

  // Set filter date range
  const setFilterDateRange = (range: { from: Date | undefined; to: Date | undefined } | null) => {
    dispatch({ type: 'SET_FILTER_DATE_RANGE', payload: range });
  };

  // Get totals by category
  const getCategoryTotals = () => {
    const totals = CATEGORIES.reduce((acc, category) => {
      acc[category.value] = 0;
      return acc;
    }, {} as Record<ExpenseCategory, number>);

    state.expenses.forEach((expense) => {
      totals[expense.category] += expense.amount;
    });

    return totals;
  };

  // Get total amount
  const getTotal = () => {
    return state.expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  return (
    <ExpenseContext.Provider
      value={{
        ...state,
        addExpense,
        updateExpense,
        deleteExpense,
        setFilterCategory,
        setFilterDateRange,
        filteredExpenses,
        getCategoryTotals,
        getTotal,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

// Custom hook to use the expense context
export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
};
