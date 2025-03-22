
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ExpenseList from '@/components/expenses/ExpenseList';
import Summary from '@/components/dashboard/Summary';
import { ExpenseProvider } from '@/context/ExpenseContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, ListFilter } from 'lucide-react';

const Index = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Set up theme
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkTheme(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkTheme((prev) => {
      const newTheme = !prev;
      localStorage.setItem('theme', newTheme ? 'dark' : 'light');
      
      if (newTheme) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      return newTheme;
    });
  };

  // Don't render UI until after mount to prevent hydration mismatch
  if (!mounted) {
    return null;
  }
  
  return (
    <ExpenseProvider>
      <div className="flex min-h-screen flex-col bg-background text-foreground antialiased">
        <Header toggleTheme={toggleTheme} isDarkTheme={isDarkTheme} />
        
        <main className="flex-1 py-8">
          <div className="container max-w-5xl mx-auto">
            <Tabs defaultValue="expenses" className="space-y-8">
              <TabsList className="w-full max-w-xs mx-auto grid grid-cols-2">
                <TabsTrigger value="expenses" className="flex items-center gap-2">
                  <ListFilter size={16} />
                  <span>Expenses</span>
                </TabsTrigger>
                <TabsTrigger value="dashboard" className="flex items-center gap-2">
                  <BarChart size={16} />
                  <span>Dashboard</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="expenses" className="space-y-8">
                <ExpenseList />
              </TabsContent>
              
              <TabsContent value="dashboard" className="space-y-8">
                <Summary />
              </TabsContent>
            </Tabs>
          </div>
        </main>
        
        <Footer />
      </div>
    </ExpenseProvider>
  );
};

export default Index;
