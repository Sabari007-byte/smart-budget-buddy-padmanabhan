import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser, SpendingCategory, Transaction } from '@/contexts/UserContext';
import { Home, PlusCircle, ChevronDown, ArrowUpCircle, ArrowDownCircle, PieChart, Calendar, Clock, Receipt } from 'lucide-react';
import TransactionForm from './TransactionForm';
import SpendingBreakdown from './SpendingBreakdown';
import TransactionList from './TransactionList';

const Dashboard: React.FC = () => {
  const { 
    profile, 
    wallet, 
    currentDailyBudget, 
    totalSavings,
    closeDailyBudget
  } = useUser();
  
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const navigate = useNavigate();
  
  const getTodayDate = () => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date().toLocaleDateString(undefined, options);
  };
  
  const calculateUsedPercentage = () => {
    if (!currentDailyBudget) return 0;
    return (currentDailyBudget.spent / currentDailyBudget.usableAmount) * 100;
  };
  
  const getProgressBarColor = () => {
    const percentage = calculateUsedPercentage();
    if (percentage < 50) return 'bg-budget-primary';
    if (percentage < 80) return 'bg-budget-secondary';
    if (percentage < 100) return 'bg-budget-warning';
    return 'bg-budget-danger';
  };
  
  const handleEndDay = () => {
    if (confirm("Are you sure you want to end today's budget? This will lock all transactions for today.")) {
      closeDailyBudget();
    }
  };
  
  if (!currentDailyBudget) {
    return (
      <Card className="w-full max-w-3xl mx-auto animate-fade-in">
        <CardContent className="flex flex-col items-center justify-center py-10">
          <Calendar className="h-16 w-16 text-budget-primary mb-4" />
          <h3 className="text-xl font-medium mb-2">No Active Daily Budget</h3>
          <p className="text-muted-foreground mb-4 text-center">
            You have closed today's budget or haven't set one up yet.
          </p>
          <Button onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Home className="h-8 w-8 text-budget-primary mr-2" />
          <h1 className="text-2xl font-bold">Smart Budget</h1>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">{getTodayDate()}</div>
          <div className="font-medium">Hello, {profile?.name}</div>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>Daily Budget Overview</CardTitle>
          <CardDescription>
            Based on the 80-20 rule
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-1">Usable Amount (80%)</div>
              <div className="text-2xl font-bold text-budget-primary">
                ${currentDailyBudget.usableAmount.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Used: ${currentDailyBudget.spent.toFixed(2)} 
                ({calculateUsedPercentage().toFixed(0)}%)
              </div>
              <div className="budget-progress mt-2">
                <div 
                  className={`budget-progress-bar ${getProgressBarColor()}`}
                  style={{ width: `${Math.min(calculateUsedPercentage(), 100)}%` }}
                ></div>
              </div>
            </div>
            
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-1">Buffer Amount (20%)</div>
              <div className="text-2xl font-bold text-budget-accent">
                ${currentDailyBudget.bufferAmount.toFixed(2)}
              </div>
              <div className="text-sm mt-3">
                <div className="flex justify-between items-center">
                  <span>Total Budget:</span>
                  <span className="font-medium">${currentDailyBudget.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span>Total Savings:</span>
                  <span className="font-medium">${totalSavings.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button
              onClick={() => setShowTransactionForm(true)}
              className="bg-budget-primary hover:bg-budget-secondary"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Expense
            </Button>
            
            <Button
              variant="outline"
              onClick={handleEndDay}
            >
              End Today's Budget
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="breakdown" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="breakdown">
            <PieChart className="h-4 w-4 mr-2" />
            Breakdown
          </TabsTrigger>
          <TabsTrigger value="transactions">
            <Clock className="h-4 w-4 mr-2" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="remaining">
            <ArrowDownCircle className="h-4 w-4 mr-2" />
            Remaining
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="breakdown" className="animate-slide-up">
          <Card>
            <CardHeader>
              <CardTitle>Spending Breakdown</CardTitle>
              <CardDescription>
                Your spending by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SpendingBreakdown 
                categories={currentDailyBudget.categories} 
                transactions={currentDailyBudget.transactions} 
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="transactions" className="animate-slide-up">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Today's Transactions</CardTitle>
                <CardDescription>
                  A list of your expenses for today
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/transactions')}
                className="text-xs"
              >
                <Receipt className="h-3 w-3 mr-1" />
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <TransactionList transactions={currentDailyBudget.transactions} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="remaining" className="animate-slide-up">
          <Card>
            <CardHeader>
              <CardTitle>Remaining Budget</CardTitle>
              <CardDescription>
                What you can still spend today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(currentDailyBudget.categories).map(([category, amount]) => {
                  const spent = currentDailyBudget.transactions
                    .filter(t => t.category === category)
                    .reduce((sum, t) => sum + t.amount, 0);
                  
                  const remaining = Math.max(0, amount - spent);
                  const percentUsed = amount > 0 ? (spent / amount) * 100 : 0;
                  
                  return (
                    <div key={category} className="bg-gray-100 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium capitalize">{category}</span>
                        <span className="text-sm">${remaining.toFixed(2)} left</span>
                      </div>
                      <div className="budget-progress">
                        <div 
                          className={`budget-progress-bar ${
                            percentUsed < 80 ? 'bg-budget-primary' : 'bg-budget-warning'
                          }`}
                          style={{ width: `${Math.min(percentUsed, 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Budget: ${amount.toFixed(2)}</span>
                        <span>Used: ${spent.toFixed(2)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {showTransactionForm && (
        <TransactionForm 
          onClose={() => setShowTransactionForm(false)}
          categories={currentDailyBudget.categories}
        />
      )}
    </div>
  );
};

export default Dashboard;
