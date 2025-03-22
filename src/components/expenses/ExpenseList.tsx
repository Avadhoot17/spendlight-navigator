
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CATEGORIES, Expense, ExpenseCategory, useExpense } from '@/context/ExpenseContext';
import ExpenseItem from './ExpenseItem';
import ExpenseForm from './ExpenseForm';
import { 
  CalendarIcon, 
  FilterX, 
  Plus,
  SlidersHorizontal 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ExpenseList: React.FC = () => {
  const { 
    filteredExpenses, 
    deleteExpense, 
    filterCategory, 
    setFilterCategory,
    filterDateRange,
    setFilterDateRange 
  } = useExpense();
  
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const handleEdit = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsEditDialogOpen(true);
  };
  
  const handleEditClose = () => {
    setSelectedExpense(null);
    setIsEditDialogOpen(false);
  };
  
  const handleDelete = (id: string) => {
    deleteExpense(id);
  };
  
  const clearFilters = () => {
    setFilterCategory('all');
    setFilterDateRange(null);
  };
  
  const hasActiveFilters = filterCategory !== 'all' || 
    (filterDateRange && (filterDateRange.from || filterDateRange.to));
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Expenses</h2>
          <p className="text-sm text-muted-foreground">
            {filteredExpenses.length} expense{filteredExpenses.length !== 1 && 's'}
            {hasActiveFilters && ' (filtered)'}
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 self-stretch sm:self-auto">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-1">
                <SlidersHorizontal size={16} />
                <span className="hidden sm:inline">Filters</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72" align="end">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Category</h4>
                  <Select 
                    value={filterCategory} 
                    onValueChange={(value) => setFilterCategory(value as ExpenseCategory | 'all')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
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
                  <h4 className="font-medium text-sm">Date Range</h4>
                  <div className="grid gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "justify-start text-left font-normal",
                            !filterDateRange?.from && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {filterDateRange?.from ? (
                            filterDateRange.to ? (
                              <>
                                {format(filterDateRange.from, "LLL dd, y")} -{" "}
                                {format(filterDateRange.to, "LLL dd, y")}
                              </>
                            ) : (
                              format(filterDateRange.from, "LLL dd, y")
                            )
                          ) : (
                            <span>Pick a date range</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={filterDateRange?.from}
                          selected={{
                            from: filterDateRange?.from,
                            to: filterDateRange?.to,
                          }}
                          onSelect={setFilterDateRange}
                          numberOfMonths={1}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                {hasActiveFilters && (
                  <Button 
                    variant="outline" 
                    className="w-full mt-2" 
                    onClick={clearFilters}
                    size="sm"
                  >
                    <FilterX className="mr-2 h-4 w-4" />
                    Clear Filters
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="h-9 gap-1">
                <Plus size={16} />
                <span>Add Expense</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <ExpenseForm onClose={() => setIsAddDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredExpenses.length > 0 ? (
          filteredExpenses.map((expense) => (
            <ExpenseItem
              key={expense.id}
              expense={expense}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-3 mb-3">
              <SlidersHorizontal className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">No expenses found</h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              {hasActiveFilters
                ? "Try changing your filters to see more expenses."
                : "Add your first expense to get started."}
            </p>
            {hasActiveFilters ? (
              <Button variant="outline" onClick={clearFilters}>
                <FilterX className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
            ) : (
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Expense
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px]">
                  <ExpenseForm onClose={() => setIsAddDialogOpen(false)} />
                </DialogContent>
              </Dialog>
            )}
          </div>
        )}
      </div>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          {selectedExpense && (
            <ExpenseForm
              expense={selectedExpense}
              onClose={handleEditClose}
              isEditing
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExpenseList;
