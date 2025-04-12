
import React from 'react';
import { Transaction, SpendingCategory } from '@/contexts/UserContext';
import { Coffee, Utensils, Bus, Wallet, Shield } from 'lucide-react';

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
  
  return (
    <div className="space-y-3">
      {sortedTransactions.map((transaction) => (
        <div 
          key={transaction.id} 
          className={`flex items-center justify-between p-3 rounded-lg ${
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
      ))}
    </div>
  );
};

export default TransactionList;
