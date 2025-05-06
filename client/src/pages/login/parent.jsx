import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from "../../components/button";
import { Input } from "../../components/input";
import { Label } from "../../components/label";
import { Logo } from "../../components/logo";
import { useUser } from "../../context/UserContext"; // Import the user context

export default function ParentLoginPage() {
  const navigate = useNavigate();
  const { login } = useUser(); // Use the login function from context

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user, data.token); // Set user and token in context + localStorage
        navigate('/dashboard/parent');
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
            <Logo />
          </div>
          <h2 className="mt-6 text-center text-2xl font-bold">Parent Sign In</h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white dark:bg-gray-950 px-6 py-12 shadow sm:rounded-lg sm:px-12 border-2 border-primary">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='w-full h-10'
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='w-full h-10'
                />
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <div>
                <Button type="submit" className="w-full">
                  Sign in
                </Button>
              </div>
            </form>

            <div className="mt-10">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
                </div>
                <div className="relative flex justify-center text-sm font-medium leading-6">
                  <span className="bg-white dark:bg-gray-950 px-6 text-gray-500 dark:text-gray-400">
                    New to Piggy AI?
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/register/parent')}
                >
                  Create an account
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
