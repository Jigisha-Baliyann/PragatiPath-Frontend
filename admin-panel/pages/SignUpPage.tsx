
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/Card';
import { User, Mail, Lock } from '../components/shared/Icons';

interface SignUpPageProps {
  onSignUp: () => void;
  onNavigateToSignIn: () => void;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ onSignUp, onNavigateToSignIn }) => {
    const handleSignUp = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you would have validation and an API call here
        onSignUp();
    };
  
    return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">Create Admin Account</h1>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Admin Registration</CardTitle>
            <CardDescription>Fill in the details to create your admin account.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSignUp}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name">Full Name</label>
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <User className="h-5 w-5 text-gray-400" />
                    </span>
                    <input
                      id="name"
                      type="text"
                      placeholder="Admin User"
                      required
                      className="w-full py-2 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                    />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="email">Email</label>
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <Mail className="h-5 w-5 text-gray-400" />
                    </span>
                    <input
                      id="email"
                      type="email"
                      placeholder="admin@example.com"
                      required
                      className="w-full py-2 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                    />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="password">Password</label>
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <Lock className="h-5 w-5 text-gray-400" />
                    </span>
                    <input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      className="w-full py-2 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                    />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <button type="submit" className="w-full px-4 py-2 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Create Account
              </button>
              <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <button type="button" onClick={onNavigateToSignIn} className="font-medium text-blue-600 hover:underline">
                  Sign in
                </button>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default SignUpPage;
