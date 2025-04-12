
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser, SpendingCategory } from '@/contexts/UserContext';
import { toast } from 'sonner';
import { Coffee, Utensils, Bus, Wallet } from 'lucide-react';

const HabitsSetup: React.FC = () => {
  const { profile, setDailyHabits } = useUser();
  const [habits, setHabits] = useState<Record<SpendingCategory, string>>({
    tiffin: '',
    lunch: '',
    dinner: '',
    transport: '',
    other: ''
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs - all fields should have numerical values
    const validateFields = Object.entries(habits).every(([_, value]) => {
      const num = parseFloat(value);
      return !isNaN(num) && num >= 0;
    });
    
    if (!validateFields) {
      toast.error("Please enter valid amounts for all categories");
      return;
    }
    
    // Convert string values to numbers
    const habitsWithNumbers: Record<SpendingCategory, number> = {
      tiffin: parseFloat(habits.tiffin) || 0,
      lunch: parseFloat(habits.lunch) || 0,
      dinner: parseFloat(habits.dinner) || 0,
      transport: parseFloat(habits.transport) || 0,
      other: parseFloat(habits.other) || 0
    };
    
    // Calculate total daily spending
    const totalDaily = Object.values(habitsWithNumbers).reduce((sum, val) => sum + val, 0);
    
    // Ensure daily spending doesn't exceed budget
    const dailyBudget = (profile?.monthlyBudget || 0) / 30;
    if (totalDaily > dailyBudget) {
      toast.error(`Total daily spending (${totalDaily.toFixed(2)}) exceeds your daily budget (${dailyBudget.toFixed(2)})`);
      return;
    }
    
    setDailyHabits(habitsWithNumbers);
    toast.success("Daily habits saved successfully!");
  };
  
  const handleInputChange = (category: SpendingCategory, value: string) => {
    setHabits(prev => ({
      ...prev,
      [category]: value
    }));
  };
  
  return (
    <Card className="w-full max-w-md mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-budget-primary">
          Daily Spending Habits
        </CardTitle>
        <CardDescription className="text-center">
          Tell us how much you typically spend each day
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              <div className="flex items-center mb-2">
                <Coffee className="h-5 w-5 mr-2 text-budget-secondary" />
                <span>Tiffin (Breakfast/Snacks)</span>
              </div>
              <Input
                type="number"
                placeholder="Daily amount"
                value={habits.tiffin}
                onChange={(e) => handleInputChange('tiffin', e.target.value)}
              />
            </label>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              <div className="flex items-center mb-2">
                <Utensils className="h-5 w-5 mr-2 text-budget-secondary" />
                <span>Lunch</span>
              </div>
              <Input
                type="number"
                placeholder="Daily amount"
                value={habits.lunch}
                onChange={(e) => handleInputChange('lunch', e.target.value)}
              />
            </label>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              <div className="flex items-center mb-2">
                <Utensils className="h-5 w-5 mr-2 text-budget-secondary" />
                <span>Dinner</span>
              </div>
              <Input
                type="number"
                placeholder="Daily amount"
                value={habits.dinner}
                onChange={(e) => handleInputChange('dinner', e.target.value)}
              />
            </label>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              <div className="flex items-center mb-2">
                <Bus className="h-5 w-5 mr-2 text-budget-secondary" />
                <span>Transport</span>
              </div>
              <Input
                type="number"
                placeholder="Daily amount"
                value={habits.transport}
                onChange={(e) => handleInputChange('transport', e.target.value)}
              />
            </label>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              <div className="flex items-center mb-2">
                <Wallet className="h-5 w-5 mr-2 text-budget-secondary" />
                <span>Other Expenses</span>
              </div>
              <Input
                type="number"
                placeholder="Daily amount"
                value={habits.other}
                onChange={(e) => handleInputChange('other', e.target.value)}
              />
            </label>
          </div>
          
          <Button type="submit" className="w-full bg-budget-primary hover:bg-budget-secondary">
            Set Up Daily Budget
          </Button>
        </form>
      </CardContent>
      
      <CardFooter className="text-sm text-center text-muted-foreground">
        Your daily budget will be approximately ${((profile?.monthlyBudget || 0) / 30).toFixed(2)}
      </CardFooter>
    </Card>
  );
};

export default HabitsSetup;
