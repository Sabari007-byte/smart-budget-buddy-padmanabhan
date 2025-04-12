
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUser } from '@/contexts/UserContext';
import { User, Mail, Phone, DollarSign, ArrowLeft, PenLine } from 'lucide-react';
import { toast } from 'sonner';

const UserProfile: React.FC = () => {
  const { profile, logout } = useUser();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  
  if (!profile) {
    return (
      <Card className="w-full max-w-md mx-auto animate-fade-in">
        <CardContent className="flex flex-col items-center justify-center py-10">
          <User className="h-16 w-16 text-budget-primary mb-4" />
          <h3 className="text-xl font-medium mb-2">Profile Not Found</h3>
          <p className="text-muted-foreground mb-4 text-center">
            Please complete the setup process first.
          </p>
          <Button onClick={() => navigate('/')}>
            Go to Setup
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      logout();
      toast.success("Logged out successfully");
      navigate('/');
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="min-h-screen py-10 px-4 bg-gray-50">
      <div className="w-full max-w-3xl mx-auto animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate('/')} className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
        
        <Card className="w-full">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold text-budget-primary">
                User Profile
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-1"
              >
                <PenLine className="h-4 w-4" />
                Edit Profile
              </Button>
            </div>
            <CardDescription>
              Your personal information and settings
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pb-8">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="flex flex-col items-center">
                <Avatar className="h-32 w-32 mb-2">
                  <AvatarFallback className="text-3xl bg-budget-primary text-white">
                    {getInitials(profile.name)}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="flex items-start">
                      <User className="h-5 w-5 text-budget-primary mt-0.5 mr-2" />
                      <div>
                        <div className="text-sm text-muted-foreground">Full Name</div>
                        <div className="font-medium">{profile.name}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 text-budget-primary mt-0.5 mr-2" />
                      <div>
                        <div className="text-sm text-muted-foreground">Age</div>
                        <div className="font-medium">{profile.age} years</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 text-budget-primary mt-0.5 mr-2" />
                      <div>
                        <div className="text-sm text-muted-foreground">Contact</div>
                        <div className="font-medium">{profile.contact}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-100 rounded-lg p-4 mt-4">
                  <div className="text-sm font-medium mb-2">Financial Information</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-budget-primary mr-2" />
                      <div>
                        <div className="text-sm text-muted-foreground">Monthly Income</div>
                        <div className="font-medium">₹{profile.monthlyIncome.toFixed(2)}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-budget-primary mr-2" />
                      <div>
                        <div className="text-sm text-muted-foreground">Monthly Budget</div>
                        <div className="font-medium">₹{profile.monthlyBudget.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="border-t pt-6 bg-gray-50">
            <div className="flex flex-col sm:flex-row justify-between items-center w-full gap-3">
              <Link to="/transactions">
                <Button variant="outline">View Transactions</Button>
              </Link>
              
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">Smart Budget:</span> Managing your expenses wisely
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
