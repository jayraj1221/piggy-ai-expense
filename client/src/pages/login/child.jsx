import React, { useState } from 'react';
import Button from "../../components/button";
import { Input } from "../../components/input";
import { Label } from "../../components/label";
import { Logo } from "../../components/logo";
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext'; 

export default function ChildLoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useUser(); // 👈 get login method from context
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    try {
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        login(data.user, data.token); // Set user + token in context
        navigate('/dashboard/child');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };
  

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <Logo variant="child" />
          </div>
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight">Kid Sign In</h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white dark:bg-gray-950 px-6 py-12 shadow sm:rounded-lg sm:px-12 border-2 border-secondary">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="email">Username or Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full h-10"
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full h-10"
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div>
                <Button type="submit" variant="secondary" className="w-full" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign in'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
