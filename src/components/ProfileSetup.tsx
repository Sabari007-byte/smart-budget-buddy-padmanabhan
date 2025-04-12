
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';
import { User, Mail, Phone, DollarSign, Calculator } from 'lucide-react';

const ProfileSetup: React.FC = () => {
  const { completeSetup } = useUser();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [contact, setContact] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [monthlyBudget, setMonthlyBudget] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!name || !age || !contact || !monthlyIncome || !monthlyBudget) {
      toast.error("Please fill out all fields");
      return;
    }
    
    const incomeValue = parseFloat(monthlyIncome);
    const budgetValue = parseFloat(monthlyBudget);
    
    if (isNaN(incomeValue) || incomeValue <= 0) {
      toast.error("Please enter a valid monthly income");
      return;
    }
    
    if (isNaN(budgetValue) || budgetValue <= 0) {
      toast.error("Please enter a valid monthly budget");
      return;
    }
    
    if (budgetValue > incomeValue) {
      toast.error("Budget cannot be greater than income");
      return;
    }
    
    completeSetup({
      name,
      age: parseInt(age),
      contact,
      monthlyIncome: incomeValue,
      monthlyBudget: budgetValue
    });
    
    toast.success("Profile setup complete!");
  };
  
  return (
    <Card className="w-full max-w-md mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-budget-primary">
          Complete Your Profile
        </CardTitle>
        <CardDescription className="text-center">
          Tell us a bit about yourself to get started
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                type="number"
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Contact Number"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                type="number"
                placeholder="Monthly Income"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="relative">
              <Calculator className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                type="number"
                placeholder="Monthly Budget"
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full bg-budget-primary hover:bg-budget-secondary">
            Continue
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileSetup;
