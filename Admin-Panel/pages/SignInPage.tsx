
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/Card';
import { Mail, Lock } from '../components/shared/Icons';

interface SignInPageProps {
  onSignIn: () => void;
  onNavigateToSignUp: () => void;
}

const SignInPage: React.FC<SignInPageProps> = ({ onSignIn, onNavigateToSignUp }) => {
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would have validation and an API call here
    onSignIn();
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">Welcome to PragatiPath</h1>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Admin Sign In</CardTitle>
            <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSignIn}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
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
                Sign In
              </button>
              <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <button type="button" onClick={onNavigateToSignUp} className="font-medium text-blue-600 hover:underline">
                  Sign up
                </button>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default SignInPage;
