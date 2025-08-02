"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/header';

interface IssueFormData {
    title: string;
    category: string;
    priority: string;
    location: string;
    description: string;
    contactInfo: string;
}

export default function ReportIssuePage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<IssueFormData>({
        title: '',
        category: '',
        priority: 'medium',
        location: '',
        description: '',
        contactInfo: ''
    });

    const categories = [
        'Roads',
        'Lighting',
        'Water Supply',
        'Cleanliness',
        'Public Safety',
        'Obstructions',
        'Other'
    ];

    const priorities = [
        { value: 'low', label: 'Low', description: 'Minor issue, not urgent' },
        { value: 'medium', label: 'Medium', description: 'Moderate issue requiring attention' },
        { value: 'high', label: 'High', description: 'Important issue, needs prompt attention' },
        { value: 'urgent', label: 'Urgent', description: 'Critical issue requiring immediate action' }
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Here you would typically send the data to your backend API
            console.log('Submitting issue:', formData);

            // Show success message and redirect
            alert('Issue reported successfully! Thank you for helping improve your community.');
            router.push('/issues');
        } catch (error) {
            console.error('Error submitting issue:', error);
            alert('Error submitting issue. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid = formData.title && formData.category && formData.location && formData.description;

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Report an Issue</h1>
                    <p className="text-lg text-gray-600">
                        Help improve your community by reporting municipal issues. Your report will be reviewed and addressed by local authorities.
                    </p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-lg shadow-sm">
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Issue Title */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                Issue Title *
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="Brief description of the issue"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>

                        {/* Category and Priority */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                                    Category *
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">Select a category</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                                    Priority Level
                                </label>
                                <select
                                    id="priority"
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    {priorities.map(priority => (
                                        <option key={priority.value} value={priority.value}>
                                            {priority.label} - {priority.description}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                                Location *
                            </label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                placeholder="Street address, intersection, or landmark"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                Be as specific as possible to help authorities locate the issue quickly
                            </p>
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Detailed Description *
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={5}
                                placeholder="Provide a detailed description of the issue, including when you first noticed it, how it affects the community, and any other relevant information..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>

                        {/* Contact Information */}
                        <div>
                            <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700 mb-2">
                                Contact Information (Optional)
                            </label>
                            <input
                                type="text"
                                id="contactInfo"
                                name="contactInfo"
                                value={formData.contactInfo}
                                onChange={handleInputChange}
                                placeholder="Email or phone number for follow-up (optional)"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                Providing contact info helps authorities reach you for additional details if needed
                            </p>
                        </div>

                        {/* Photo Upload Section (placeholder) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Photos (Optional)
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div className="mt-4">
                                    <label htmlFor="file-upload" className="cursor-pointer">
                                        <span className="mt-2 block text-sm font-medium text-gray-900">
                                            Upload photos of the issue
                                        </span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple accept="image/*" />
                                    </label>
                                    <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                                </div>
                            </div>
                        </div>

                        {/* Guidelines */}
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                            <h3 className="text-sm font-medium text-blue-800 mb-2">Reporting Guidelines</h3>
                            <ul className="text-sm text-blue-700 space-y-1">
                                <li>• Be specific and accurate in your description</li>
                                <li>• Include photos when possible to help illustrate the issue</li>
                                <li>• Report only legitimate municipal issues</li>
                                <li>• For emergencies, contact emergency services directly</li>
                                <li>• Check if the issue has already been reported</li>
                            </ul>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!isFormValid || isSubmitting}
                                className={`px-6 py-2 rounded-md transition-colors ${isFormValid && !isSubmitting
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                                        Submitting...
                                    </div>
                                ) : (
                                    'Submit Report'
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Additional Information */}
                <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">What Happens Next?</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-blue-600 font-bold">1</span>
                            </div>
                            <h3 className="font-medium text-gray-900 mb-2">Review</h3>
                            <p className="text-sm text-gray-600">Your report is reviewed by municipal authorities within 24 hours</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-blue-600 font-bold">2</span>
                            </div>
                            <h3 className="font-medium text-gray-900 mb-2">Assignment</h3>
                            <p className="text-sm text-gray-600">The issue is assigned to the appropriate department for resolution</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-blue-600 font-bold">3</span>
                            </div>
                            <h3 className="font-medium text-gray-900 mb-2">Resolution</h3>
                            <p className="text-sm text-gray-600">You'll receive updates as the issue progresses toward resolution</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
