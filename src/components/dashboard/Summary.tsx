
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CATEGORIES, useExpense } from '@/context/ExpenseContext';
import { ArrowDownCircle, BadgeDollarSign, PieChart } from 'lucide-react';
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const Summary: React.FC = () => {
  const { getTotal, getCategoryTotals, expenses } = useExpense();
  const total = getTotal();
  const categoryTotals = getCategoryTotals();
  
  // Create data for pie chart
  const pieData = CATEGORIES.map((category) => ({
    name: category.label,
    value: categoryTotals[category.value],
    color: `var(--expense-${category.value})`,
  })).filter((item) => item.value > 0);
  
  // Calculate recent expenses
  const recentExpenses = expenses
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
  
  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-semibold tracking-tight">Dashboard</h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <BadgeDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {expenses.length} expense{expenses.length !== 1 && 's'} total
            </p>
          </CardContent>
        </Card>
        
        {expenses.length > 0 && (
          <Card className="hover-scale md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Spending by Category</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-1">
              <div className="h-[200px]">
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']}
                        contentStyle={{
                          borderRadius: '0.375rem',
                          border: '1px solid var(--border)',
                          backgroundColor: 'var(--background)'
                        }}
                      />
                      <Legend
                        layout="horizontal"
                        verticalAlign="bottom"
                        align="center"
                        formatter={(value) => <span className="text-xs">{value}</span>}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-sm text-muted-foreground">No data to display</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      {expenses.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Recent Expenses</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-3 p-3">
              {recentExpenses.map((expense) => {
                const category = CATEGORIES.find(c => c.value === expense.category);
                return (
                  <div 
                    key={expense.id}
                    className="flex items-center justify-between rounded-lg border p-3 text-sm transition-all hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="flex h-9 w-9 items-center justify-center rounded-full" 
                        style={{ backgroundColor: `var(--expense-${expense.category})20` }}
                      >
                        <ArrowDownCircle
                          className="h-5 w-5"
                          style={{ color: `var(--expense-${expense.category})` }}
                        />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium">{expense.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {category?.label} • {new Date(expense.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="font-medium">
                      -${expense.amount.toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Summary;
