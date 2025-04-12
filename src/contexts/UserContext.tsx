
import React, { createContext, useContext, useState, useEffect } from 'react';

export type SpendingCategory = 'tiffin' | 'lunch' | 'dinner' | 'transport' | 'other';

export type Transaction = {
  id: string;
  amount: number;
  category: SpendingCategory;
  description: string;
  recipient: string;
  timestamp: Date;
  useBuffer: boolean;
};

export type DailyBudget = {
  date: string;
  totalAmount: number;
  usableAmount: number; // 80%
  bufferAmount: number; // 20%
  categories: Record<SpendingCategory, number>;
  spent: number;
  transactions: Transaction[];
  isClosed: boolean;
};

export type UserProfile = {
  name: string;
  age: number;
  contact: string;
  monthlyIncome: number;
  monthlyBudget: number;
};

interface UserContextType {
  isAuthenticated: boolean;
  isSetupComplete: boolean;
  currentStep: number;
  profile: UserProfile | null;
  dailyHabits: Record<SpendingCategory, number> | null;
  wallet: { balance: number } | null;
  currentDailyBudget: DailyBudget | null;
  pastBudgets: DailyBudget[];
  totalSavings: number;
  login: () => void;
  logout: () => void;
  completeSetup: (profile: UserProfile) => void;
  setDailyHabits: (habits: Record<SpendingCategory, number>) => void;
  setupWallet: (amount: number) => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp' | 'useBuffer'>, useBuffer?: boolean) => void;
  closeDailyBudget: () => void;
  nextStep: () => void;
  prevStep: () => void;
  resetStep: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [dailyHabits, setDailyHabits] = useState<Record<SpendingCategory, number> | null>(null);
  const [wallet, setWallet] = useState<{ balance: number } | null>(null);
  const [currentDailyBudget, setCurrentDailyBudget] = useState<DailyBudget | null>(null);
  const [pastBudgets, setPastBudgets] = useState<DailyBudget[]>([]);
  const [totalSavings, setTotalSavings] = useState(0);

  useEffect(() => {
    // Load user data from localStorage when component mounts
    const userData = localStorage.getItem('budgetAppUser');
    if (userData) {
      const parsedData = JSON.parse(userData);
      setIsAuthenticated(parsedData.isAuthenticated || false);
      setIsSetupComplete(parsedData.isSetupComplete || false);
      setProfile(parsedData.profile || null);
      setDailyHabits(parsedData.dailyHabits || null);
      setWallet(parsedData.wallet || null);
      setCurrentDailyBudget(parsedData.currentDailyBudget || null);
      setPastBudgets(parsedData.pastBudgets || []);
      setTotalSavings(parsedData.totalSavings || 0);
      setCurrentStep(parsedData.currentStep || 1);
    }
  }, []);

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('budgetAppUser', JSON.stringify({
        isAuthenticated,
        isSetupComplete,
        profile,
        dailyHabits,
        wallet,
        currentDailyBudget,
        pastBudgets,
        totalSavings,
        currentStep,
      }));
    }
  }, [isAuthenticated, isSetupComplete, profile, dailyHabits, wallet, currentDailyBudget, pastBudgets, totalSavings, currentStep]);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsSetupComplete(false);
    setProfile(null);
    setDailyHabits(null);
    setWallet(null);
    setCurrentDailyBudget(null);
    setPastBudgets([]);
    setTotalSavings(0);
    setCurrentStep(1);
    localStorage.removeItem('budgetAppUser');
  };

  const completeSetup = (newProfile: UserProfile) => {
    setProfile(newProfile);
    nextStep();
  };

  const setUserDailyHabits = (habits: Record<SpendingCategory, number>) => {
    setDailyHabits(habits);
    setIsSetupComplete(true);
    nextStep();
  };

  const setupWallet = (amount: number) => {
    setWallet({ balance: amount });
    
    // Create a new daily budget based on the user's settings
    if (profile && dailyHabits) {
      const dailyBudgetAmount = profile.monthlyBudget / 30; // Simple calculation for daily budget
      const usableAmount = dailyBudgetAmount * 0.8; // 80% of daily budget
      const bufferAmount = dailyBudgetAmount * 0.2; // 20% of daily budget
      
      // Calculate category budgets based on habits
      const totalHabitsAmount = Object.values(dailyHabits).reduce((sum, val) => sum + val, 0);
      
      const categories = {} as Record<SpendingCategory, number>;
      
      // Distribute the usable amount proportionally
      if (totalHabitsAmount > 0) {
        for (const category in dailyHabits) {
          const typedCategory = category as SpendingCategory;
          categories[typedCategory] = (dailyHabits[typedCategory] / totalHabitsAmount) * usableAmount;
        }
      } else {
        // Equal distribution if no habits set
        const defaultAmount = usableAmount / 5; // 5 categories
        categories.tiffin = defaultAmount;
        categories.lunch = defaultAmount;
        categories.dinner = defaultAmount;
        categories.transport = defaultAmount;
        categories.other = defaultAmount;
      }
      
      setCurrentDailyBudget({
        date: new Date().toISOString().split('T')[0],
        totalAmount: dailyBudgetAmount,
        usableAmount,
        bufferAmount,
        categories,
        spent: 0,
        transactions: [],
        isClosed: false
      });
    }
    
    nextStep();
  };

  const addTransaction = (
    transaction: Omit<Transaction, 'id' | 'timestamp' | 'useBuffer'>, 
    useBuffer: boolean = false
  ) => {
    if (!currentDailyBudget || currentDailyBudget.isClosed) return;
    
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      timestamp: new Date(),
      useBuffer
    };
    
    const updatedBudget = {
      ...currentDailyBudget,
      spent: currentDailyBudget.spent + transaction.amount,
      transactions: [...currentDailyBudget.transactions, newTransaction]
    };
    
    setCurrentDailyBudget(updatedBudget);
  };

  const closeDailyBudget = () => {
    if (!currentDailyBudget || currentDailyBudget.isClosed) return;
    
    // Calculate savings (unused buffer + underspent categories)
    const usedFromBuffer = currentDailyBudget.transactions
      .filter(t => t.useBuffer)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const bufferSavings = currentDailyBudget.bufferAmount - usedFromBuffer;
    
    // Close the budget and add it to past budgets
    const closedBudget = {
      ...currentDailyBudget,
      isClosed: true
    };
    
    setPastBudgets([closedBudget, ...pastBudgets]);
    setCurrentDailyBudget(null);
    
    // Add buffer savings to total savings
    setTotalSavings(prevSavings => prevSavings + bufferSavings);
    
    // Create new budget for the next day
    if (profile && dailyHabits) {
      setupWallet(wallet?.balance || 0);
    }
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => (prev > 1 ? prev - 1 : 1));
  };

  const resetStep = () => {
    setCurrentStep(1);
  };

  const value = {
    isAuthenticated,
    isSetupComplete,
    currentStep,
    profile,
    dailyHabits,
    wallet,
    currentDailyBudget,
    pastBudgets,
    totalSavings,
    login,
    logout,
    completeSetup,
    setDailyHabits: setUserDailyHabits,
    setupWallet,
    addTransaction,
    closeDailyBudget,
    nextStep,
    prevStep,
    resetStep,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
