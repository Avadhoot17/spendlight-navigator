
import React from 'react';
import { useExpense } from '@/context/ExpenseContext';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  toggleTheme: () => void;
  isDarkTheme: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleTheme, isDarkTheme }) => {
  const { getTotal } = useExpense();
  
  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/80 backdrop-blur-md animate-fade-in">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative h-8 w-8 overflow-hidden rounded-full bg-primary/10">
            <div className="absolute inset-0 flex items-center justify-center text-primary">
              <span className="font-medium">$</span>
            </div>
          </div>
          <h1 className="text-xl font-semibold tracking-tight">Expense Tracker</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <div className="flex flex-col items-end">
              <span className="text-sm text-muted-foreground">Balance</span>
              <span className="font-medium">${getTotal().toLocaleString()}</span>
            </div>
          </div>
          
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="ml-2">
            {isDarkTheme ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
