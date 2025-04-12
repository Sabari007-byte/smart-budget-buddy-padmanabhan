
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';
import { Mail, Lock, LogIn } from 'lucide-react';

const AuthForm: React.FC = () => {
  const { login } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!email || !password) {
      toast.error("Please fill out all fields");
      return;
    }
    
    // In a real app, we would authenticate with a backend service here
    // For now, we'll just simulate successful login/signup
    
    if (isSignUp) {
      toast.success("Account created successfully!");
    }
    
    login();
    toast.success("Logged in successfully!");
  };
  
  return (
    <Card className="w-full max-w-md mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-budget-primary">
          {isSignUp ? "Create an Account" : "Welcome Back"}
        </CardTitle>
        <CardDescription className="text-center">
          {isSignUp 
            ? "Sign up to start managing your budget smartly" 
            : "Sign in to continue managing your budget"}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full bg-budget-primary hover:bg-budget-secondary">
            <LogIn className="mr-2 h-4 w-4" />
            {isSignUp ? "Sign Up" : "Sign In"}
          </Button>
        </form>
      </CardContent>
      
      <CardFooter className="flex justify-center">
        <Button 
          variant="link" 
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-budget-accent"
        >
          {isSignUp 
            ? "Already have an account? Sign In" 
            : "Don't have an account? Sign Up"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
