import React, { useState } from 'react';
import { Dialog } from '@headlessui/react'; // optional, or use your own modal component
import { Input } from './input';
import { Label } from './label';
import Button from './button';
import { useUser } from '../context/UserContext';

export default function AddChildModal({ isOpen, onClose, onSuccess }) {
  const { user, token } = useUser();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
      const res = await fetch('http://localhost:5000/auth/register/child', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          parent: {
            id: user._id || user.id,  // use correct key from your backend
            name: user.name,
            email: user.email,
            role: user.role,
            parentId: user.parentId || null,
          }
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to add child');
      }

      setSuccess('Child account created!');
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50">
      <div className="fixed inset-0" style={{ pointerEvents: 'none' }} aria-hidden="true" />
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Panel className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md w-full max-w-md">
          <Dialog.Title className="text-xl font-bold mb-4">Add Child</Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input name="name" value={formData.name} onChange={handleChange} required className='w-full h-10' autoFocus/>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input type="email" name="email" value={formData.email} onChange={handleChange} required className='w-full h-10'/>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input type="password" name="password" value={formData.password} onChange={handleChange} required  className='w-full h-10'/>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}

            <div className="flex justify-between">
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Child'}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
