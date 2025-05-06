import React, { useState } from 'react';
import Button from '../../components/button';
import { Input } from '../../components/input';
import { Label } from '../../components/label';
import { Logo } from '../../components/logo';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext'; // Import context hook

export default function RegisterParentPage() {
  const navigate = useNavigate();
  const { login } = useUser(); // Get login method from context

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5000/auth/register/parent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      // Login through context: stores user and token
      login(data.user, data.token);
      navigate('/dashboard/parent');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <Logo />
          </div>
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight">
            Create Parent Account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white dark:bg-gray-950 px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  onChange={handleChange}
                  value={formData.name}
                />
              </div>

              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  onChange={handleChange}
                  value={formData.email}
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  onChange={handleChange}
                  value={formData.password}
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  onChange={handleChange}
                  value={formData.confirmPassword}
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating...' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              Already have an account?{' '}
              <Link to="/" className="text-blue-500 underline">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
