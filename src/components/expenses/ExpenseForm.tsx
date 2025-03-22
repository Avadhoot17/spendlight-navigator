
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CATEGORIES, Expense, ExpenseCategory, useExpense } from '@/context/ExpenseContext';
import { X } from 'lucide-react';

interface ExpenseFormProps {
  expense?: Expense;
  onClose?: () => void;
  isEditing?: boolean;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ expense, onClose, isEditing = false }) => {
  const { addExpense, updateExpense } = useExpense();
  const [formData, setFormData] = useState<{
    amount: string;
    category: ExpenseCategory;
    description: string;
    date: string;
  }>({
    amount: '',
    category: 'other',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (expense) {
      setFormData({
        amount: expense.amount.toString(),
        category: expense.category,
        description: expense.description,
        date: expense.date,
      });
    }
  }, [expense]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const expenseData = {
      amount: Number(formData.amount),
      category: formData.category,
      description: formData.description.trim(),
      date: formData.date,
    };
    
    if (isEditing && expense) {
      updateExpense({
        ...expenseData,
        id: expense.id,
        createdAt: expense.createdAt,
      });
    } else {
      addExpense(expenseData);
    }
    
    resetForm();
    if (onClose) onClose();
  };

  const resetForm = () => {
    if (!isEditing) {
      setFormData({
        amount: '',
        category: 'other',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
    }
    setErrors({});
  };

  return (
    <Card className="w-full animate-fade-in border p-6 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">{isEditing ? 'Edit Expense' : 'Add New Expense'}</h3>
          {onClose && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X size={16} />
            </Button>
          )}
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className={`pl-7 ${errors.amount ? 'border-destructive' : ''}`}
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                />
              </div>
              {errors.amount && <p className="text-xs text-destructive">{errors.amount}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                className={errors.date ? 'border-destructive' : ''}
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
              {errors.date && <p className="text-xs text-destructive">{errors.date}</p>}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value as ExpenseCategory })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="h-3 w-3 rounded-full" 
                        style={{ backgroundColor: `var(--expense-${category.value})` }}
                      ></div>
                      {category.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="What was this expense for?"
              className={`resize-none ${errors.description ? 'border-destructive' : ''}`}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
          </div>
        </div>
        
        <div className="flex justify-end gap-3">
          {isEditing && (
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          )}
          <Button type="submit" className="min-w-24">
            {isEditing ? 'Update' : 'Add Expense'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ExpenseForm;
