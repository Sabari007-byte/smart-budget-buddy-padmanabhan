
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from '@/contexts/UserContext';
import { CheckCircle, ArrowRight } from 'lucide-react';

const WelcomeScreen: React.FC = () => {
  const { profile, nextStep } = useUser();
  
  return (
    <Card className="w-full max-w-md mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-budget-primary">
          Welcome, {profile?.name}!
        </CardTitle>
        <CardDescription className="text-center">
          Your profile has been set up successfully
        </CardDescription>
      </CardHeader>
      
      <CardContent className="text-center">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle className="h-10 w-10 text-budget-secondary" />
          </div>
        </div>
        
        <h3 className="text-xl font-medium mb-4">
          Are you ready to start managing your expenses smartly?
        </h3>
        
        <p className="text-muted-foreground mb-6">
          We'll help you track your daily spending, save more, and achieve your financial goals.
        </p>
        
        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <div className="flex justify-between mb-2">
            <span className="font-medium">Monthly Income:</span>
            <span className="font-bold">${profile?.monthlyIncome.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Monthly Budget:</span>
            <span className="font-bold">${profile?.monthlyBudget.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-center">
        <Button 
          onClick={nextStep}
          className="w-full bg-budget-primary hover:bg-budget-secondary"
        >
          Yes, I'm Ready
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WelcomeScreen;
