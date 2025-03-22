
import React from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { Expense, ExpenseCategory, CATEGORIES } from '@/context/ExpenseContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ExpenseItemProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const getCategoryLabel = (category: ExpenseCategory) => {
  return CATEGORIES.find(c => c.value === category)?.label || 'Other';
};

const ExpenseItem: React.FC<ExpenseItemProps> = ({ expense, onEdit, onDelete }) => {
  return (
    <div 
      className="expense-card group hover-scale"
      style={{ '--category-color': `var(--expense-${expense.category})` } as React.CSSProperties}
    >
      <div 
        className="absolute top-0 left-0 h-full w-1 rounded-l-lg"
        style={{ backgroundColor: `var(--expense-${expense.category})` }}
      ></div>
      
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span 
              className="inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium"
              style={{ 
                backgroundColor: `var(--expense-${expense.category})20`,
                color: `var(--expense-${expense.category})` 
              }}
            >
              {getCategoryLabel(expense.category)}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatDate(expense.date)}
            </span>
          </div>
          
          <h4 className="font-medium truncate">{expense.description}</h4>
        </div>
        
        <div className="flex items-center justify-between sm:justify-end gap-4">
          <div className="flex flex-col sm:items-end">
            <span className="text-lg font-semibold">${expense.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          
          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(expense)}
              className="h-8 w-8"
            >
              <Pencil size={16} />
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                >
                  <Trash2 size={16} />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete this expense. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(expense.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseItem;
