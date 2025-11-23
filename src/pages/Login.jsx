```
import React, { useState } from 'react';
import { User, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-brand-dark relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-brand-primary/20 rounded-full blur-[100px] animate-pulse-slow"></div>
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-brand-violet/20 rounded-full blur-[100px] animate-pulse-slow delay-700"></div>
      </div>

      <div className="max-w-md w-full space-y-8 glass p-10 rounded-3xl relative z-10">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-brand-primary to-brand-violet rounded-2xl flex items-center justify-center shadow-lg shadow-brand-primary/30 transform rotate-3">
            <User className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-display font-bold text-white">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to access your personalized routes
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400 group-focus-within:text-brand-primary transition-colors" />
              </div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-transparent transition-all"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-brand-violet transition-colors" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-violet/50 focus:border-transparent transition-all"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-brand-primary focus:ring-brand-primary border-slate-700 rounded bg-slate-800"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-300">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-brand-primary hover:text-brand-accent transition-colors">
                Forgot password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-brand-primary to-brand-violet hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-all shadow-lg shadow-brand-primary/25"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <ArrowRight className="h-5 w-5 text-white/70 group-hover:text-white transition-colors" />
              </span>
              Sign in
            </button>
          </div>
        </form>
        
        <p className="text-center text-sm text-slate-400">
          Don't have an account?{' '}
          <a href="#" className="font-medium text-brand-accent hover:text-brand-primary transition-colors">
            Sign up now
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
```
