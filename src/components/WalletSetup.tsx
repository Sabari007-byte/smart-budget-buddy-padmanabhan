
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';
import { Wallet, ArrowRight } from 'lucide-react';

const WalletSetup: React.FC = () => {
  const { profile, setupWallet } = useUser();
  const [amount, setAmount] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input
    const budgetAmount = parseFloat(amount);
    
    if (isNaN(budgetAmount) || budgetAmount <= 0) {
      toast.error("Please enter a valid budget amount");
      return;
    }
    
    const monthlyBudget = profile?.monthlyBudget || 0;
    if (budgetAmount > monthlyBudget) {
      toast.error(`Amount cannot exceed your monthly budget (${monthlyBudget.toFixed(2)})`);
      return;
    }
    
    setupWallet(budgetAmount);
    toast.success("Wallet setup complete!");
  };
  
  return (
    <Card className="w-full max-w-md mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-budget-primary">
          Set Up Your Budget Wallet
        </CardTitle>
        <CardDescription className="text-center">
          This will be your initial budget amount for the month
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-blue-100 p-3">
            <Wallet className="h-10 w-10 text-budget-accent" />
          </div>
        </div>
        
        <p className="text-muted-foreground mb-6 text-center">
          We'll divide your daily budget using the 80-20 rule: 80% will be available for daily spending, 
          and 20% will be kept as a buffer for unexpected expenses.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <Input
                type="number"
                placeholder="Budget Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          
          <div className="bg-gray-100 rounded-lg p-4 mb-2">
            <div className="flex justify-between mb-2">
              <span className="font-medium">Monthly Budget:</span>
              <span className="font-bold">${profile?.monthlyBudget.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Daily Budget (approx):</span>
              <span className="font-bold">${((profile?.monthlyBudget || 0) / 30).toFixed(2)}</span>
            </div>
          </div>
          
          <Button type="submit" className="w-full bg-budget-primary hover:bg-budget-secondary">
            Setup Wallet
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default WalletSetup;
