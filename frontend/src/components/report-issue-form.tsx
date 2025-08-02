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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Report an Issue</h2>
            <button
              onClick={onCancel}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Issue Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Issue Title *
              </label>
              <input
                type="text"
                id="title"
                required
                value={form.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Brief description of the issue"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Issue Type and Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Issue Category
                </label>
                <select
                  id="category"
                  value={form.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="roads">🛣️ Roads (potholes, obstructions)</option>
                  <option value="lighting">💡 Lighting (broken or flickering lights)</option>
                  <option value="water-supply">💧 Water Supply (leaks, low pressure)</option>
                  <option value="cleanliness">🗑️ Cleanliness (overflowing bins, garbage)</option>
                  <option value="public-safety">⚠️ Public Safety (open manholes, exposed wiring)</option>
                  <option value="obstructions">🚧 Obstructions (fallen trees, debris)</option>
                </select>
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  id="priority"
                  value={form.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                id="description"
                required
                rows={4}
                value={form.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Detailed description of the issue..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.location.address}
                    onChange={(e) => handleLocationChange('address', e.target.value)}
                    placeholder="Enter address or coordinates"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={locationLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
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
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    step="any"
                    value={form.location.lng || ''}
                    onChange={(e) => handleLocationChange('lng', parseFloat(e.target.value) || 0)}
                    placeholder="Longitude"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Photos (Up to 3) - Optional
              </label>
              
              {imagePreviews.length > 0 ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <Image
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          width={150}
                          height={120}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 text-xs"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  {form.images.length < 3 && (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <label htmlFor="additionalImages" className="cursor-pointer">
                        <span className="text-blue-600 hover:text-blue-700 font-medium text-sm">
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
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Camera className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <label htmlFor="images" className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-700 font-medium">
                      Upload photos
                    </span>
                    <span className="text-gray-500"> or drag and drop</span>
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

            {/* Reporter Information */}
            {!form.isAnonymous && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="reporterName" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="reporterName"
                    required={!form.isAnonymous}
                    value={form.reporterName}
                    onChange={(e) => handleInputChange('reporterName', e.target.value)}
                    placeholder="Full name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="reporterContact" className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Info
                  </label>
                  <input
                    type="text"
                    id="reporterContact"
                    value={form.reporterContact}
                    onChange={(e) => handleInputChange('reporterContact', e.target.value)}
                    placeholder="Phone or email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                {isSubmitting ? 'Submitting...' : 'Submit Issue'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
