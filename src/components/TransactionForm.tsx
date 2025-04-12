
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useUser, SpendingCategory } from '@/contexts/UserContext';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';

interface TransactionFormProps {
  onClose: () => void;
  categories: Record<SpendingCategory, number>;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onClose, categories }) => {
  const { currentDailyBudget, addTransaction } = useUser();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<SpendingCategory>('other');
  const [description, setDescription] = useState('');
  const [recipient, setRecipient] = useState('');
  
  const [showBufferRequest, setShowBufferRequest] = useState(false);
  const [bufferReason, setBufferReason] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    if (!category) {
      toast.error("Please select a category");
      return;
    }
    
    const transactionAmount = parseFloat(amount);
    
    if (!currentDailyBudget) {
      toast.error("No active daily budget");
      return;
    }
    
    // Check if transaction fits within category budget
    const categoryBudget = categories[category];
    const categorySpent = currentDailyBudget.transactions
      .filter(t => t.category === category)
      .reduce((sum, t) => sum + t.amount, 0);
    
    // Check if we've reached 80% of the daily limit
    const totalSpent = currentDailyBudget.spent;
    const is80PercentReached = totalSpent >= currentDailyBudget.usableAmount * 0.8;
    
    if (categorySpent + transactionAmount > categoryBudget || is80PercentReached) {
      // Need to use buffer
      setShowBufferRequest(true);
      return;
    }
    
    // Proceed with normal transaction
    submitTransaction(false);
  };
  
  const submitTransaction = (useBuffer: boolean) => {
    const transactionAmount = parseFloat(amount);
    
    addTransaction({
      amount: transactionAmount,
      category: category,
      description: description || `Expense for ${category}`,
      recipient: recipient || "Not specified"
    }, useBuffer);
    
    toast.success("Transaction added successfully!");
    onClose();
  };
  
  const handleBufferRequest = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bufferReason) {
      toast.error("Please provide a reason for using the buffer");
      return;
    }
    
    // Add the original description to the buffer reason
    const finalDescription = description 
      ? `${description} (Buffer used: ${bufferReason})`
      : `Expense for ${category} (Buffer used: ${bufferReason})`;
    
    setDescription(finalDescription);
    
    // Submit transaction with buffer
    submitTransaction(true);
  };
  
  return (
    <>
      <Dialog open={true} onOpenChange={() => onClose()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
            <DialogDescription>
              Log your spending to keep track of your budget
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Amount
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-8"
                    step="0.01"
                  />
                </div>
              </label>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Category
                <Select 
                  value={category} 
                  onValueChange={(value) => setCategory(value as SpendingCategory)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tiffin">Tiffin (Breakfast/Snacks)</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                    <SelectItem value="transport">Transport</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </label>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Description (optional)
                <Textarea
                  placeholder="What was this expense for?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1"
                />
              </label>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Recipient (optional)
                <Input
                  placeholder="Who did you pay?"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="mt-1"
                />
              </label>
            </div>
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-budget-primary hover:bg-budget-secondary">
                Add Expense
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showBufferRequest} onOpenChange={() => setShowBufferRequest(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-budget-warning">
              <AlertCircle className="h-5 w-5 mr-2" />
              Buffer Access Required
            </DialogTitle>
            <DialogDescription>
              This expense exceeds your category limit or you've reached 80% of your daily budget. 
              You need to use your buffer.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleBufferRequest} className="space-y-4 py-4">
            <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-amber-800 text-sm">
              <p>Please provide a valid reason for accessing your buffer funds.</p>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Reason for using buffer
                <Textarea
                  placeholder="Why do you need to use your buffer for this expense?"
                  value={bufferReason}
                  onChange={(e) => setBufferReason(e.target.value)}
                  className="mt-1"
                />
              </label>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => setShowBufferRequest(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-budget-warning hover:bg-budget-warning/90 text-white"
              >
                Use Buffer
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TransactionForm;
