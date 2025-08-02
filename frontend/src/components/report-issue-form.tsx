"use client"

import { useState } from 'react';
import { Camera, MapPin, X, Send } from 'lucide-react';
import Image from 'next/image';

interface IssueForm {
  title: string;
  description: string;
  category: 'roads' | 'lighting' | 'water-supply' | 'cleanliness' | 'public-safety' | 'obstructions';
  priority: 'low' | 'medium' | 'high';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  images: File[]; // Up to 3 images
  reporterName: string;
  reporterContact: string;
  isAnonymous: boolean;
}

interface ReportIssueFormProps {
  onSubmit: (issue: IssueForm) => void;
  onCancel: () => void;
}

export default function ReportIssueForm({ onSubmit, onCancel }: ReportIssueFormProps) {
  const [form, setForm] = useState<IssueForm>({
    title: '',
    description: '',
    category: 'roads',
    priority: 'medium',
    location: {
      lat: 0,
      lng: 0,
      address: '',
    },
    images: [],
    reporterName: '',
    reporterContact: '',
    isAnonymous: false,
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const handleInputChange = (field: keyof IssueForm, value: string | File | undefined | boolean | File[]) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleLocationChange = (field: keyof IssueForm['location'], value: string | number) => {
    setForm(prev => ({
      ...prev,
      location: { ...prev.location, [field]: value }
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0 && form.images.length + files.length <= 3) {
      const newImages = [...form.images, ...files];
      setForm(prev => ({ ...prev, images: newImages }));

      // Generate previews for new images
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          setImagePreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    } else if (form.images.length + files.length > 3) {
      alert('You can upload maximum 3 images');
    }
  };

  const removeImage = (index: number) => {
    const newImages = form.images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setForm(prev => ({ ...prev, images: newImages }));
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
            location: {
              ...prev.location,
              lat: latitude,
              lng: longitude,
              address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
            }
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

    // Validate form
    if (!form.title.trim() || !form.description.trim()) {
      alert('Please fill in title and description.');
      setIsSubmitting(false);
      return;
    }

    if (!form.isAnonymous && !form.reporterName.trim()) {
      alert('Please provide your name or choose to report anonymously.');
      setIsSubmitting(false);
      return;
    }

    try {
      await onSubmit(form);
      // Reset form
      setForm({
        title: '',
        description: '',
        category: 'roads',
        priority: 'medium',
        location: { lat: 0, lng: 0, address: '' },
        images: [],
        reporterName: '',
        reporterContact: '',
        isAnonymous: false,
      });
      setImagePreviews([]);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit issue. Please try again.');
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
        <div className="glass-surface rounded-2xl p-8 border border-glass-light-hover dark:border-glass-dark-hover backdrop-blur-glass">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-charcoal to-slate-gray dark:from-white dark:to-soft-gray bg-clip-text text-transparent mb-2">Report an Issue</h2>
              <p className="text-slate-gray dark:text-soft-gray">Help improve your community by reporting municipal issues</p>
            </div>
            <button
              onClick={onCancel}
              className="p-3 text-slate-gray dark:text-soft-gray hover:text-bright-blue dark:hover:text-neon-green glass-surface rounded-xl border border-glass-light-hover dark:border-glass-dark-hover hover:shadow-neon transition-all duration-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Issue Title */}
            <div>
              <label htmlFor="title" className="block text-charcoal dark:text-white text-sm font-medium mb-3">
                Issue Title *
              </label>
              <input
                type="text"
                id="title"
                required
                value={form.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Brief description of the issue"
                className="w-full glass-surface border border-glass-light-hover dark:border-glass-dark-hover rounded-xl px-4 py-3 text-charcoal dark:text-white placeholder-slate-gray dark:placeholder-soft-gray focus:outline-none focus:border-bright-blue dark:focus:border-neon-green focus:ring-2 focus:ring-bright-blue/20 dark:focus:ring-neon-green/20 transition-all duration-300"
              />
            </div>

            {/* Issue Type and Priority */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-charcoal dark:text-white text-sm font-medium mb-3">
                  Issue Category
                </label>
                <select
                  id="category"
                  value={form.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full glass-surface border border-glass-light-hover dark:border-glass-dark-hover rounded-xl px-4 py-3 text-charcoal dark:text-white focus:outline-none focus:border-bright-blue dark:focus:border-neon-green focus:ring-2 focus:ring-bright-blue/20 dark:focus:ring-neon-green/20 transition-all duration-300"
                >
                  <option value="roads">🛣️ Smart Roads</option>
                  <option value="lighting">💡 IoT Lighting</option>
                  <option value="water-supply">💧 Water Systems</option>
                  <option value="cleanliness">🧹 Clean Tech</option>
                  <option value="public-safety">🚨 Public Safety</option>
                  <option value="obstructions">🚧 Obstructions</option>
                </select>
              </div>

              <div>
                <label htmlFor="priority" className="block text-charcoal dark:text-white text-sm font-medium mb-3">
                  Priority Level
                </label>
                <select
                  id="priority"
                  value={form.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                  className="w-full glass-surface border border-glass-light-hover dark:border-glass-dark-hover rounded-xl px-4 py-3 text-charcoal dark:text-white focus:outline-none focus:border-bright-blue dark:focus:border-neon-green focus:ring-2 focus:ring-bright-blue/20 dark:focus:ring-neon-green/20 transition-all duration-300"
                >
                  <option value="low">🟢 Low Priority</option>
                  <option value="medium">🟡 Medium Priority</option>
                  <option value="high">🔴 High Priority</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-charcoal dark:text-white text-sm font-medium mb-3">
                Description *
              </label>
              <textarea
                id="description"
                required
                rows={4}
                value={form.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Detailed description of the issue..."
                className="w-full glass-surface border border-glass-light-hover dark:border-glass-dark-hover rounded-xl px-4 py-3 text-charcoal dark:text-white placeholder-slate-gray dark:placeholder-soft-gray focus:outline-none focus:border-bright-blue dark:focus:border-neon-green focus:ring-2 focus:ring-bright-blue/20 dark:focus:ring-neon-green/20 transition-all duration-300 resize-none"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-charcoal dark:text-white text-sm font-medium mb-3">
                Location
              </label>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={form.location.address}
                    onChange={(e) => handleLocationChange('address', e.target.value)}
                    placeholder="Enter address or coordinates"
                    className="flex-1 glass-surface border border-glass-light-hover dark:border-glass-dark-hover rounded-xl px-4 py-3 text-charcoal dark:text-white placeholder-slate-gray dark:placeholder-soft-gray focus:outline-none focus:border-bright-blue dark:focus:border-neon-green focus:ring-2 focus:ring-bright-blue/20 dark:focus:ring-neon-green/20 transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={locationLoading}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-bright-blue to-vibrant-pink dark:from-neon-green dark:to-iridescent-purple text-white rounded-xl hover:shadow-neon dark:hover:shadow-purple transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <MapPin className="h-4 w-4" />
                    {locationLoading ? 'Getting...' : 'Current'}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    step="any"
                    value={form.location.lat || ''}
                    onChange={(e) => handleLocationChange('lat', parseFloat(e.target.value) || 0)}
                    placeholder="Latitude"
                    className="glass-surface border border-glass-light-hover dark:border-glass-dark-hover rounded-xl px-4 py-3 text-charcoal dark:text-white placeholder-slate-gray dark:placeholder-soft-gray focus:outline-none focus:border-bright-blue dark:focus:border-neon-green focus:ring-2 focus:ring-bright-blue/20 dark:focus:ring-neon-green/20 transition-all duration-300"
                  />
                  <input
                    type="number"
                    step="any"
                    value={form.location.lng || ''}
                    onChange={(e) => handleLocationChange('lng', parseFloat(e.target.value) || 0)}
                    placeholder="Longitude"
                    className="glass-surface border border-glass-light-hover dark:border-glass-dark-hover rounded-xl px-4 py-3 text-charcoal dark:text-white placeholder-slate-gray dark:placeholder-soft-gray focus:outline-none focus:border-bright-blue dark:focus:border-neon-green focus:ring-2 focus:ring-bright-blue/20 dark:focus:ring-neon-green/20 transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-charcoal dark:text-white text-sm font-medium mb-3">
                Photos (Up to 3) - Optional
              </label>

              {imagePreviews.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <Image
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          width={150}
                          height={120}
                          className="w-full h-24 object-cover rounded-xl border border-glass-light-hover dark:border-glass-dark-hover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 p-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full hover:shadow-neon transition-all duration-300 opacity-0 group-hover:opacity-100"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {form.images.length < 3 && (
                    <div className="glass-surface border-2 border-dashed border-bright-blue dark:border-neon-green rounded-xl p-6 text-center hover:shadow-neon transition-all duration-300">
                      <label htmlFor="additionalImages" className="cursor-pointer">
                        <span className="text-bright-blue dark:text-neon-green hover:text-vibrant-pink dark:hover:text-iridescent-purple font-medium">
                          Add more photos ({3 - form.images.length} remaining)
                        </span>
                      </label>
                      <input
                        type="file"
                        id="additionalImages"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="glass-surface border-2 border-dashed border-bright-blue dark:border-neon-green rounded-xl p-8 text-center hover:shadow-neon transition-all duration-300">
                  <Camera className="mx-auto h-12 w-12 text-bright-blue dark:text-neon-green mb-4 opacity-70" />
                  <label htmlFor="images" className="cursor-pointer">
                    <span className="block text-bright-blue dark:text-neon-green hover:text-vibrant-pink dark:hover:text-iridescent-purple font-medium mb-2">
                      Upload photos
                    </span>
                    <span className="text-slate-gray dark:text-soft-gray text-sm">PNG, JPG, GIF up to 10MB each</span>
                  </label>
                  <input
                    type="file"
                    id="images"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB each (max 3 photos)</p>
                </div>
              )}
            </div>

            {/* Anonymous Reporting Toggle */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                id="isAnonymous"
                checked={form.isAnonymous}
                onChange={(e) => handleInputChange('isAnonymous', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isAnonymous" className="text-sm font-medium text-gray-700">
                Report anonymously
              </label>
              <span className="text-xs text-gray-500 ml-auto">
                Your identity will not be shared
              </span>
            </div>

            {/* Anonymous Reporting Toggle */}
            <div className="glass-surface rounded-xl p-6 border border-glass-light-hover dark:border-glass-dark-hover">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isAnonymous}
                  onChange={(e) => handleInputChange('isAnonymous', e.target.checked)}
                  className="w-5 h-5 text-bright-blue dark:text-neon-green bg-glass-light dark:bg-glass-dark border-glass-light-hover dark:border-glass-dark-hover rounded focus:ring-bright-blue dark:focus:ring-neon-green focus:ring-2"
                />
                <div>
                  <span className="text-charcoal dark:text-white font-medium">Report Anonymously</span>
                  <p className="text-sm text-slate-gray dark:text-soft-gray">Your identity will be kept private</p>
                </div>
              </label>
            </div>

            {/* Reporter Information */}
            {!form.isAnonymous && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="reporterName" className="block text-charcoal dark:text-white text-sm font-medium mb-3">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="reporterName"
                    required={!form.isAnonymous}
                    value={form.reporterName}
                    onChange={(e) => handleInputChange('reporterName', e.target.value)}
                    placeholder="Full name"
                    className="w-full glass-surface border border-glass-light-hover dark:border-glass-dark-hover rounded-xl px-4 py-3 text-charcoal dark:text-white placeholder-slate-gray dark:placeholder-soft-gray focus:outline-none focus:border-bright-blue dark:focus:border-neon-green focus:ring-2 focus:ring-bright-blue/20 dark:focus:ring-neon-green/20 transition-all duration-300"
                  />
                </div>

                <div>
                  <label htmlFor="reporterContact" className="block text-charcoal dark:text-white text-sm font-medium mb-3">
                    Contact Info
                  </label>
                  <input
                    type="text"
                    id="reporterContact"
                    value={form.reporterContact}
                    onChange={(e) => handleInputChange('reporterContact', e.target.value)}
                    placeholder="Phone or email"
                    className="w-full glass-surface border border-glass-light-hover dark:border-glass-dark-hover rounded-xl px-4 py-3 text-charcoal dark:text-white placeholder-slate-gray dark:placeholder-soft-gray focus:outline-none focus:border-bright-blue dark:focus:border-neon-green focus:ring-2 focus:ring-bright-blue/20 dark:focus:ring-neon-green/20 transition-all duration-300"
                  />
                </div>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6 border-t border-glass-light-hover dark:border-glass-dark-hover">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 glass-surface border border-glass-light-hover dark:border-glass-dark-hover text-charcoal dark:text-white px-6 py-3 rounded-xl hover:shadow-neon transition-all duration-300 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-bright-blue to-vibrant-pink dark:from-neon-green dark:to-iridescent-purple text-white rounded-xl hover:shadow-neon dark:hover:shadow-purple transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                <Send className="h-5 w-5" />
                {isSubmitting ? 'Submitting...' : 'Submit Issue'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
