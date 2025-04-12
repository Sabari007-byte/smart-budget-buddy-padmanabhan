import React from 'react';
import { Transaction, SpendingCategory } from '@/contexts/UserContext';
import { Coffee, Utensils, Bus, Wallet, Shield } from 'lucide-react';
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  const getCategoryIcon = (category: SpendingCategory) => {
    switch(category) {
      case 'tiffin':
        return <Coffee className="h-4 w-4" />;
      case 'lunch':
      case 'dinner':
        return <Utensils className="h-4 w-4" />;
      case 'transport':
        return <Bus className="h-4 w-4" />;
      default:
        return <Wallet className="h-4 w-4" />;
    }
  };
  
  const formatTime = (date: Date) => {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDate = (date: Date) => {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    
    // If date is today, just return "Today"
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    
    // If date is yesterday, return "Yesterday"
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    // Otherwise, return the date in a readable format
    return date.toLocaleDateString(undefined, { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  if (transactions.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">
          No transactions recorded yet. Add your first expense.
        </p>
      </div>
    );
  }
  
  // Sort transactions by timestamp, newest first
  const sortedTransactions = [...transactions].sort((a, b) => {
    const dateA = new Date(a.timestamp);
    const dateB = new Date(b.timestamp);
    return dateB.getTime() - dateA.getTime();
  });
  
  // Group transactions by date
  const groupedTransactions: Record<string, Transaction[]> = {};
  
  sortedTransactions.forEach(transaction => {
    const date = new Date(transaction.timestamp);
    const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD
    
    if (!groupedTransactions[dateString]) {
      groupedTransactions[dateString] = [];
    }
    
    groupedTransactions[dateString].push(transaction);
  });
  
  return (
    <div className="space-y-4">
      {Object.entries(groupedTransactions).map(([dateStr, dayTransactions]) => (
        <div key={dateStr}>
          <div className="text-sm font-medium text-muted-foreground mb-2">
            {formatDate(new Date(dateStr))}
          </div>
          
          <div className="space-y-2">
            {dayTransactions.map((transaction) => (
              <HoverCard key={transaction.id}>
                <HoverCardTrigger asChild>
                  <div 
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${
                      transaction.useBuffer ? 'bg-amber-50 border border-amber-100' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full mr-3 ${
                        transaction.useBuffer ? 'bg-amber-100 text-amber-600' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {getCategoryIcon(transaction.category)}
                      </div>
                      <div>
                        <div className="font-medium flex items-center">
                          {transaction.description || `${transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)} expense`}
                          {transaction.useBuffer && (
                            <Shield className="h-4 w-4 ml-2 text-amber-500" />
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {transaction.recipient ? `Paid to: ${transaction.recipient}` : ''} • {formatTime(transaction.timestamp)}
                        </div>
                      </div>
                    </div>
                    <div className={`font-bold ${transaction.useBuffer ? 'text-amber-600' : 'text-gray-700'}`}>
                      -${transaction.amount.toFixed(2)}
                    </div>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Transaction Details</h4>
                    <div className="grid grid-cols-2 gap-1 text-sm">
                      <span className="text-muted-foreground">Amount:</span>
                      <span className="font-medium">${transaction.amount.toFixed(2)}</span>
                      
                      <span className="text-muted-foreground">Category:</span>
                      <span className="font-medium capitalize">{transaction.category}</span>
                      
                      <span className="text-muted-foreground">Date:</span>
                      <span className="font-medium">
                        {new Date(transaction.timestamp).toLocaleDateString()}
                      </span>
                      
                      <span className="text-muted-foreground">Time:</span>
                      <span className="font-medium">
                        {formatTime(transaction.timestamp)}
                      </span>
                      
                      <span className="text-muted-foreground">Recipient:</span>
                      <span className="font-medium">
                        {transaction.recipient || "Not specified"}
                      </span>
                      
                      <span className="text-muted-foreground">Buffer Used:</span>
                      <span className="font-medium">
                        {transaction.useBuffer ? "Yes" : "No"}
                      </span>
                    </div>
                    
                    {transaction.description && (
                      <div className="pt-2 text-sm">
                        <span className="text-muted-foreground">Description:</span>
                        <p className="font-medium mt-1">{transaction.description}</p>
                      </div>
                    )}
                  </div>
                </HoverCardContent>
              </HoverCard>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
