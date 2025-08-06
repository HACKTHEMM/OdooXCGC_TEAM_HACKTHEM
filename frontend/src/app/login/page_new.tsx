'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LoginForm } from '../../types/database';
import { apiClient, isApiSuccess, formatApiError } from '../../lib/api-client';
import { setAuthData } from '../../lib/auth-utils';

export default function LoginPage() {
    const [formData, setFormData] = useState<LoginForm>({
        email: '',
        password: '',
        remember_me: false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, type, checked, value } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await apiClient.login(formData);

            if (isApiSuccess(response)) {
                // Store token and redirect
                setAuthData(response.data.token, response.data.user);

                // Redirect to dashboard or home page
                window.location.href = '/home';
            } else {
                setError(response.error || 'Login failed');
            }
        } catch (err) {
            setError(formatApiError(err instanceof Error ? err.message : 'Login failed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-midnight flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-neon-green/20 to-cyber-blue/20 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-20 right-10 w-64 h-64 bg-gradient-to-r from-magenta-rose/20 to-iridescent-purple/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyber-blue/10 to-neon-green/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>
            </div>

            <div className="relative z-10 w-full max-w-md">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <Link href="/" className="flex items-center space-x-3 group">
                        <span className="text-xl font-bold gradient-text-accent animate-glow">
                            CivicTrack
                        </span>
                    </Link>
                    <Link
                        href="/"
                        className="glass-surface border border-neon-green text-neon-green px-4 py-2 rounded-xl hover:shadow-neon transition-all duration-300 font-medium hover:scale-105"
                    >
                        Home
                    </Link>
                </div>

                {/* Login Form */}
                <div className="card-modern p-8 animate-slide-up">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold gradient-text-primary mb-2">
                            Welcome Back
                        </h2>
                        <p className="text-black">
                            Sign in to continue making a difference
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-pure-white text-sm font-medium mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="input-modern w-full"
                                placeholder="Enter your email"
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-pure-white text-sm font-medium mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="input-modern w-full"
                                placeholder="Enter your password"
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="remember_me"
                                    name="remember_me"
                                    checked={formData.remember_me}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-neon-green focus:ring-neon-green border-glass-border rounded bg-glass-surface"
                                    disabled={loading}
                                />
                                <label htmlFor="remember_me" className="ml-2 block text-sm text-black">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <Link href="/forgot-password" className="text-neon-green hover:text-cyber-blue transition-colors duration-300">
                                    Forgot your password?
                                </Link>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-magenta-rose/20 border border-magenta-rose/50 text-magenta-rose px-4 py-3 rounded-xl">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-modern w-full"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-midnight mr-2"></div>
                                    Signing in...
                                </div>
                            ) : (
                                'Sign In'
                            )}
                        </button>

                        {/* Sign Up Link */}
                        <div className="text-center">
                            <p className="text-black">
                                Don&apos;t have an account?{' '}
                                <Link href="/signup" className="text-neon-green hover:text-cyber-blue transition-colors duration-300 font-medium">
                                    Sign up here
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
