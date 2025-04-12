
import React from 'react';
import { UserProvider, useUser } from '@/contexts/UserContext';
import AuthForm from '@/components/AuthForm';
import ProfileSetup from '@/components/ProfileSetup';
import WelcomeScreen from '@/components/WelcomeScreen';
import HabitsSetup from '@/components/HabitsSetup';
import WalletSetup from '@/components/WalletSetup';
import Dashboard from '@/components/Dashboard';

const AppContent = () => {
  const { isAuthenticated, currentStep } = useUser();
  
  if (!isAuthenticated) {
    return <AuthForm />;
  }
  
  // Authenticated flow
  switch (currentStep) {
    case 1:
      return <ProfileSetup />;
    case 2:
      return <WelcomeScreen />;
    case 3:
      return <HabitsSetup />;
    case 4:
      return <WalletSetup />;
    case 5:
    default:
      return <Dashboard />;
  }
};

const Index = () => {
  return (
    <div className="min-h-screen py-10 px-4 bg-gray-50">
      <UserProvider>
        <div className="w-full max-w-4xl mx-auto">
          <AppContent />
        </div>
      </UserProvider>
    </div>
  );
};

export default Index;
