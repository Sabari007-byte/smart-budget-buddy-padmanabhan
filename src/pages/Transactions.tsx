
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, Transaction, SpendingCategory } from '@/contexts/UserContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  Filter, 
  Search, 
  SlidersHorizontal, 
  Calendar,
  Receipt
} from 'lucide-react';
import TransactionList from '@/components/TransactionList';

const TransactionsPage: React.FC = () => {
  const { 
    currentDailyBudget, 
    pastBudgets 
  } = useUser();
  const navigate = useNavigate();
  
  // Get all transactions from current and past budgets
  const allTransactions: Transaction[] = [
    ...(currentDailyBudget?.transactions || []),
    ...pastBudgets.flatMap(budget => budget.transactions)
  ];

  // State for filtering and searching
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  // Filter transactions based on search and filters
  const filteredTransactions = allTransactions.filter(transaction => {
    // Search term filter (description or recipient)
    const searchMatch = searchTerm === '' || 
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.recipient.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Category filter
    const categoryMatch = categoryFilter === 'all' || transaction.category === categoryFilter;
    
    // Date filter logic
    let dateMatch = true;
    if (dateFilter === 'today') {
      const today = new Date().toISOString().split('T')[0];
      const transactionDate = new Date(transaction.timestamp).toISOString().split('T')[0];
      dateMatch = today === transactionDate;
    } else if (dateFilter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      dateMatch = new Date(transaction.timestamp) >= weekAgo;
    } else if (dateFilter === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      dateMatch = new Date(transaction.timestamp) >= monthAgo;
    }
    
    return searchMatch && categoryMatch && dateMatch;
  });

  // Sort transactions by date (newest first)
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  return (
    <div className="w-full max-w-3xl mx-auto py-6 px-4 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
        <div className="flex items-center">
          <Receipt className="h-6 w-6 text-budget-primary mr-2" />
          <h1 className="text-2xl font-bold">Transactions</h1>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            Search and filter your past transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Search input */}
            <div className="relative col-span-1 md:col-span-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Filters */}
            <div>
              <Select
                value={categoryFilter}
                onValueChange={setCategoryFilter}
              >
                <SelectTrigger className="w-full">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <span>Category</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="tiffin">Tiffin</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="dinner">Dinner</SelectItem>
                  <SelectItem value="transport">Transport</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select
                value={dateFilter}
                onValueChange={setDateFilter}
              >
                <SelectTrigger className="w-full">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Time Period</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Button variant="outline" className="w-full">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                More Filters
              </Button>
            </div>
          </div>
          
          {/* Transaction list */}
          <div>
            {sortedTransactions.length > 0 ? (
              <>
                <h3 className="font-medium mb-3">
                  {sortedTransactions.length} transactions found
                </h3>
                <TransactionList transactions={sortedTransactions} />
              </>
            ) : (
              <div className="text-center py-10">
                <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-medium mb-1">No transactions found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsPage;
