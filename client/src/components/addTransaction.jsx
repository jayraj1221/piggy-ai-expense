import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { Input } from './input';
import { Label } from './label';
import Button from './button';
import { useUser } from '../context/UserContext';

export default function AddTransaction({ isOpen, onClose, onSuccess }) {
  const { user, token } = useUser();
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense', // Always expense
    category: 'other',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [emoji, setEmoji] = useState('💰');

  // Add backdrop effect when form is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.backgroundColor = '#f0f9ff'; // Light blue background
      document.body.style.transition = 'background-color 0.5s ease';
    } else {
      document.body.style.backgroundColor = '';
    }
    
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, [isOpen]);

  // Set emoji based on category
  useEffect(() => {
    const emojis = {
      food: '🍕',
      education: '📚',
      entertainment: '🎮',
      luxury: '💎',
      donation: '🤝',
      other: '💰',
    };
    setEmoji(emojis[formData.category] || '💰');
  }, [formData.category]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/ml/spend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          type: 'expense', // Ensure it's always expense
          amount: parseFloat(formData.amount),
          childId: user._id || user.id,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to add transaction');
      }

      setSuccess('Awesome! Your transaction was added! 🎉');
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = [
    { value: 'food', label: '🍕 Food' },
    { value: 'education', label: '📚 Education' },
    { value: 'entertainment', label: '🎮 Entertainment' },
    { value: 'luxury', label: '💎 Luxury' },
    { value: 'donation', label: '🤝 Donation' },
    { value: 'other', label: '💰 Other' }
  ];

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity" onClick={onClose} />
        
        <Dialog.Panel className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-md relative transform transition-all">
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-blue-500 rounded-full w-20 h-20 flex items-center justify-center text-4xl">
            {emoji}
          </div>
          
          <Dialog.Title className="text-2xl font-bold mb-6 mt-8 text-center">
            Spent Money
          </Dialog.Title>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div>
              <Label htmlFor="amount" className="text-lg font-medium mb-1">How much?</Label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xl">₹</span>
                <Input
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  className="w-full h-12 pl-8 text-xl"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="category" className="text-lg font-medium mb-1"> What's it for?</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {categoryOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, category: option.value }))}
                    className={`p-2 rounded-lg text-center transition-colors ${
                      formData.category === option.value
                        ? 'bg-blue-100 text-blue-600 border-2 border-blue-300'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <div className="text-2xl mb-1">{option.label.split(' ')[0]}</div>
                    <div className="text-xs">{option.label.split(' ')[1]}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-lg font-medium mb-1">Notes</Label>
              <Input
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full h-12"
                placeholder="What did you buy?"
              />
            </div>

            {error && <p className="text-red-500 text-sm p-2 bg-red-50 rounded">{error}</p>}
            {success && (
              <div className="text-green-500 text-center p-3 bg-green-50 rounded-lg">
                <span className="text-2xl">🎉</span>
                <p>{success}</p>
              </div>
            )}

            <div className="flex justify-between pt-2">
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-full text-lg"
              >
                {loading ? '⏳ Adding...' : '✅ Save It!'}
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="border border-gray-300 py-3 px-6 rounded-full text-lg"
              >
                ❌ Cancel
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}