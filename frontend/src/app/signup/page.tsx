'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CreateUserForm } from '../../types/database';
import { apiClient, isApiSuccess, formatApiError } from '../../lib/api-client';
import { setAuthData } from '../../lib/auth-utils';

interface SignupFormData extends CreateUserForm {
    confirm_password: string;
    accept_terms: boolean;
}

export default function SignupPage() {
    const [formData, setFormData] = useState<SignupFormData>({
        user_name: '',
        email: '',
        password: '',
        confirm_password: '',
        phone: '',
        accept_terms: false
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

        // Validation
        if (formData.password !== formData.confirm_password) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (!formData.accept_terms) {
            setError('Please accept the terms and conditions');
            setLoading(false);
            return;
        }

        try {
            // Create the user data without confirm_password and accept_terms
            const userData: CreateUserForm = {
                user_name: formData.user_name,
                email: formData.email,
                password: formData.password,
                phone: formData.phone || undefined
            };

            const response = await apiClient.register(userData);

            if (isApiSuccess(response)) {
                // Store token and redirect to home instead of login
                setAuthData(response.data.token, response.data.user);

                // Show success message and redirect to home
                alert('Account created successfully! Welcome!');
                window.location.href = '/home';
            } else {
                setError(response.error || 'Registration failed');
            }
        } catch (err) {
            setError(formatApiError(err instanceof Error ? err.message : 'Registration failed'));
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
                        href="/login"
                        className="glass-surface border border-neon-green text-neon-green px-4 py-2 rounded-xl hover:shadow-neon transition-all duration-300 font-medium hover:scale-105"
                    >
                        Sign In
                    </Link>
                </div>

                {/* Signup Form */}
                <div className="card-modern p-8 animate-slide-up">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold gradient-text-primary mb-2">
                            Join CivicTrack
                        </h2>
                        <p className="text-soft-gray">
                            Create your account to start making a difference
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Username Field */}
                        <div>
                            <label htmlFor="user_name" className="block text-pure-white text-sm font-medium mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                id="user_name"
                                name="user_name"
                                value={formData.user_name}
                                onChange={handleChange}
                                className="input-modern w-full"
                                placeholder="Enter your username"
                                required
                                disabled={loading}
                            />
                        </div>

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

                        {/* Phone Field */}
                        <div>
                            <label htmlFor="phone" className="block text-pure-white text-sm font-medium mb-2">
                                Phone Number (Optional)
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="input-modern w-full"
                                placeholder="Enter your phone number"
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

                        {/* Confirm Password Field */}
                        <div>
                            <label htmlFor="confirm_password" className="block text-pure-white text-sm font-medium mb-2">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirm_password"
                                name="confirm_password"
                                value={formData.confirm_password}
                                onChange={handleChange}
                                className="input-modern w-full"
                                placeholder="Confirm your password"
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* Terms and Conditions */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="accept_terms"
                                name="accept_terms"
                                checked={formData.accept_terms}
                                onChange={handleChange}
                                className="h-4 w-4 text-neon-green focus:ring-neon-green border-glass-border rounded bg-glass-surface"
                                disabled={loading}
                                required
                            />
                            <label htmlFor="accept_terms" className="ml-2 block text-sm text-soft-gray">
                                I accept the{' '}
                                <Link href="/terms" className="text-neon-green hover:text-cyber-blue transition-colors duration-300">
                                    Terms and Conditions
                                </Link>
                                {' '}and{' '}
                                <Link href="/privacy" className="text-neon-green hover:text-cyber-blue transition-colors duration-300">
                                    Privacy Policy
                                </Link>
                            </label>
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
                                    Creating account...
                                </div>
                            ) : (
                                'Create Account'
                            )}
                        </button>

                        {/* Sign In Link */}
                        <div className="text-center">
                            <p className="text-soft-gray">
                                Already have an account?{' '}
                                <Link href="/login" className="text-neon-green hover:text-cyber-blue transition-colors duration-300 font-medium">
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}