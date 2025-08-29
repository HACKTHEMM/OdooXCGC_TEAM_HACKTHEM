"use client"

import { useState, useEffect } from 'react';
import { Camera, MapPin, X, Send } from 'lucide-react';
import Image from 'next/image';
import { CreateIssueForm, Category } from '../types/database';
import { apiClient, isApiSuccess } from '../lib/api-client';

interface ReportIssueFormProps {
  onSubmit: (issue: CreateIssueForm) => void;
  onCancel: () => void;
}

export default function ReportIssueForm({ onSubmit, onCancel }: ReportIssueFormProps) {
  const [form, setForm] = useState<CreateIssueForm>({
    title: '',
    description: '',
    category_id: 1,
    latitude: 0,
    longitude: 0,
    address: '',
    location_description: '',
    is_anonymous: false,
    photos: [],
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.getCategories();
        if (isApiSuccess(response) && response.data.length > 0) {
          setCategories(response.data);
          setForm(prev => ({ ...prev, category_id: response.data[0].id }));
        } else {
          // Fallback categories
          const fallbackCategories: Category[] = [
            { id: 1, name: "Roads", description: "Road issues", is_active: true, created_at: new Date() },
            { id: 2, name: "Lighting", description: "Lighting issues", is_active: true, created_at: new Date() },
            { id: 3, name: "Water Supply", description: "Water issues", is_active: true, created_at: new Date() },
            { id: 4, name: "Cleanliness", description: "Cleanliness issues", is_active: true, created_at: new Date() },
            { id: 5, name: "Public Safety", description: "Safety issues", is_active: true, created_at: new Date() },
            { id: 6, name: "Obstructions", description: "Obstruction issues", is_active: true, created_at: new Date() },
          ];
          setCategories(fallbackCategories);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (field: keyof CreateIssueForm, value: string | number | boolean | File[]) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0 && (form.photos?.length || 0) + files.length <= 3) {
      const newImages = [...(form.photos || []), ...files];
      setForm(prev => ({ ...prev, photos: newImages }));

      // Generate previews for new images
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          setImagePreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    } else if ((form.photos?.length || 0) + files.length > 3) {
      alert('You can upload maximum 3 images');
    }
  };

  const removeImage = (index: number) => {
    const newImages = (form.photos || []).filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setForm(prev => ({ ...prev, photos: newImages }));
    setImagePreviews(newPreviews);
  };

  const getCurrentLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setForm(prev => ({
            ...prev,
            latitude,
            longitude,
            address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          }));
          setLocationLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please enter manually.');
          setLocationLoading(false);
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
      setLocationLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validate form
    if (!form.title.trim() || !form.description.trim()) {
      setError('Please fill in title and description.');
      setIsSubmitting(false);
      return;
    }

    if (form.latitude === 0 || form.longitude === 0) {
      setError('Please provide a valid location.');
      setIsSubmitting(false);
      return;
    }

    try {
      await onSubmit(form);
      // Reset form
      setForm({
        title: '',
        description: '',
        category_id: categories[0]?.id || 1,
        latitude: 0,
        longitude: 0,
        address: '',
        location_description: '',
        is_anonymous: false,
        photos: [],
      });
      setImagePreviews([]);
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Failed to submit issue. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cloud-white via-blue-50/50 to-purple-50/30 dark:from-midnight dark:via-purple-900/10 dark:to-blue-900/10">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-bright-blue/20 to-vibrant-pink/20 dark:from-neon-green/20 dark:to-iridescent-purple/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-gradient-to-r from-vibrant-pink/20 to-bright-blue/20 dark:from-iridescent-purple/20 dark:to-neon-green/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card-modern p-8 animate-slide-up">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold gradient-text-charcoal mb-2">
                Report an Issue
              </h1>
              <p className="text-text-secondary">
                Help make your community better by reporting civic issues
              </p>
            </div>
            <button
              onClick={onCancel}
              className="p-3 text-text-secondary hover:text-accent-primary glass-surface rounded-xl border border-glass-border hover:shadow-lg transition-all duration-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-text-primary text-sm font-medium mb-2">
                Issue Title *
              </label>
              <input
                type="text"
                id="title"
                required
                value={form.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Brief description of the issue"
                className="input-modern w-full"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category_id" className="block text-text-primary text-sm font-medium mb-2">
                Category *
              </label>
              <select
                id="category_id"
                value={form.category_id}
                onChange={(e) => handleInputChange('category_id', parseInt(e.target.value))}
                className="input-modern w-full"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-text-primary text-sm font-medium mb-2">
                Description *
              </label>
              <textarea
                id="description"
                required
                rows={4}
                value={form.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Provide detailed information about the issue..."
                className="input-modern w-full resize-none"
              />
            </div>

            {/* Location Information */}
            <div>
              <label className="block text-text-primary text-sm font-medium mb-2">
                Location *
              </label>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter address or location"
                    value={form.address || ''}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="flex-1 input-modern"
                  />
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={locationLoading}
                    className="px-4 py-3 bg-accent-primary text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                  >
                    {locationLoading ? '📍' : <MapPin className="h-5 w-5" />}
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="Latitude"
                    step="any"
                    value={form.latitude || ''}
                    onChange={(e) => handleInputChange('latitude', parseFloat(e.target.value) || 0)}
                    className="input-modern"
                  />
                  <input
                    type="number"
                    placeholder="Longitude"
                    step="any"
                    value={form.longitude || ''}
                    onChange={(e) => handleInputChange('longitude', parseFloat(e.target.value) || 0)}
                    className="input-modern"
                  />
                </div>

                <input
                  type="text"
                  placeholder="Additional location details (optional)"
                  value={form.location_description || ''}
                  onChange={(e) => handleInputChange('location_description', e.target.value)}
                  className="w-full input-modern"
                />
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-text-primary text-sm font-medium mb-2">
                Photos (up to 3)
              </label>
              <div className="space-y-4">
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <Image
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          width={120}
                          height={120}
                          className="w-full h-24 object-cover rounded-xl"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {(form.photos?.length || 0) < 3 && (
                  <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-glass-border rounded-xl cursor-pointer hover:border-accent-primary transition-all duration-300">
                    <Camera className="h-8 w-8 text-text-secondary mb-2" />
                    <span className="text-sm text-text-secondary">
                      Add photos ({3 - (form.photos?.length || 0)} remaining)
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Anonymous Reporting */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_anonymous"
                  checked={form.is_anonymous}
                  onChange={(e) => handleInputChange('is_anonymous', e.target.checked)}
                  className="w-4 h-4 text-accent-primary bg-glass-bg border-glass-border rounded focus:ring-accent-primary focus:ring-2"
                />
                <label htmlFor="is_anonymous" className="text-text-primary text-sm font-medium">
                  Report anonymously
                </label>
              </div>
              <p className="text-xs text-text-secondary">
                When reporting anonymously, your personal information will not be shared publicly, but authorities may still contact you for clarification.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 glass-surface border border-glass-border text-text-primary py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 btn-modern py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Submit Issue
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
