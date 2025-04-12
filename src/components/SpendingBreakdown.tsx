
import React from 'react';
import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { SpendingCategory, Transaction } from '@/contexts/UserContext';

interface SpendingBreakdownProps {
  categories: Record<SpendingCategory, number>;
  transactions: Transaction[];
}

const SpendingBreakdown: React.FC<SpendingBreakdownProps> = ({ categories, transactions }) => {
  const COLORS = ['#2dd4bf', '#10b981', '#0ea5e9', '#f59e0b', '#64748b'];
  
  const getCategorySpending = () => {
    const result: { name: string; value: number; }[] = [];
    
    // Group transactions by category
    const spendingByCategory: Record<string, number> = {};
    
    transactions.forEach(transaction => {
      const category = transaction.category;
      spendingByCategory[category] = (spendingByCategory[category] || 0) + transaction.amount;
    });
    
    // Convert to format needed for pie chart
    Object.entries(spendingByCategory).forEach(([category, amount], index) => {
      result.push({
        name: category.charAt(0).toUpperCase() + category.slice(1), // Capitalize first letter
        value: amount
      });
    });
    
    return result;
  };
  
  const data = getCategorySpending();
  
  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
  
  // If no transactions yet, show placeholder message
  if (totalSpent === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">
          No spending recorded yet. Add your first transaction to see the breakdown.
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Amount']}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="bg-gray-100 rounded-lg p-3 text-center">
          <div className="text-sm text-muted-foreground">Total Spent</div>
          <div className="text-xl font-bold">₹{totalSpent.toFixed(2)}</div>
        </div>
        
        {data.map((item, index) => (
          <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
            <div className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></div>
              <span>{item.name}</span>
            </div>
            <div className="font-medium">₹{item.value.toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpendingBreakdown;
