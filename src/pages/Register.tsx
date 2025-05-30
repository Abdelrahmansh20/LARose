import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Mail, Lock, User, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signUpWithEmail, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword || !username) {
      setErrorMessage('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    
    try {
      setErrorMessage('');
      setIsSubmitting(true);
      
      // First, create the auth user
      const { data, error } = await signUpWithEmail(email, password);
      
      if (error) {
        throw error;
      }
      
      if (!data?.user) {
        throw new Error('Failed to create user account');
      }

      // Then, create the user profile
      const { error: dbError } = await supabase
        .from('users')
        .insert([
          {
            email,
            username,
            password,
            wishlist: [],
            cart: [],
            created_at: new Date().toISOString(),
          }
        ])
        .select();
      
      if (dbError) {
        console.error('Error creating user profile:', dbError);
        throw dbError;
      }
      
      // If everything is successful, navigate to home
      navigate('/');
    } catch (error: unknown) {
      console.error('Registration error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to create account');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    try {
      setErrorMessage('');
      setIsSubmitting(true);
      
      const { error } = await signInWithGoogle();
      
      if (error) {
        throw error;
      }
    } catch (error: unknown) {
      console.error('Google login error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to sign in with Google');
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="pt-24 pb-20 min-h-screen bg-beige-50">
      <div className="container">
        <div className="max-w-md mx-auto">
          <motion.div 
            className="bg-white rounded-lg shadow-sm p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-8">
              <h1 className="font-serif text-3xl text-brown-800 mb-2">Create Account</h1>
              <p className="text-brown-600">Join LaRose to discover your perfect scent</p>
            </div>
            
            {errorMessage && (
              <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-md flex items-start">
                <AlertCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
                <p>{errorMessage}</p>
              </div>
            )}
            
            <form onSubmit={handleRegister} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-brown-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    className="input pl-10 w-full"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Mail 
                    size={18} 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-500" 
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-brown-700 mb-1">
                  Username
                </label>
                <div className="relative">
                  <input
                    id="username"
                    type="text"
                    className="input pl-10 w-full"
                    placeholder="Your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <User 
                    size={18} 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-500" 
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-brown-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    className="input pl-10 w-full"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Lock 
                    size={18} 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-500" 
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-brown-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type="password"
                    className="input pl-10 w-full"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <Lock 
                    size={18} 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-500" 
                  />
                </div>
              </div>
              
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isSubmitting}
              >
                Create Account
              </Button>
            </form>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-beige-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-brown-600">Or continue with</span>
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  type="button"
                  className="btn btn-outline w-full flex items-center justify-center"
                  onClick={handleGoogleLogin}
                  disabled={isSubmitting}
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                      <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                      <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                      <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                      <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                    </g>
                  </svg>
                  Google
                </button>
              </div>
            </div>
            
            <p className="mt-8 text-center text-sm text-brown-600">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="font-medium text-brown-800 hover:text-brown-900"
              >
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}