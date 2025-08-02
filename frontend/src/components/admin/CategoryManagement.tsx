'use client';

import { useState } from 'react';
import { Category } from '../../types/database';
import { apiClient } from '../../lib/api-client';

interface CategoryManagementProps {
  categories: Category[];
  onCategoriesUpdate: (categories: Category[]) => void;
}

interface CategoryFormData {
  name: string;
  description: string;
  icon_url: string;
  color_code: string;
}

export default function CategoryManagement({ categories, onCategoriesUpdate }: CategoryManagementProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    icon_url: '📋',
    color_code: '#0066FF'
  });
  const [loading, setLoading] = useState(false);

  const categoryIcons = [
    '🛣️', '💡', '💧', '🧹', '🚨', '🚧', '🌳', '🚌', '🏠', '🏢', '🎯', '📋'
  ];

  const categoryColors = [
    '#0066FF', '#FF4081', '#00E6A0', '#A972FF', '#FF6B35', '#FFD93D',
    '#6BCF7F', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (editingCategory) {
        const response = await apiClient.updateCategory(editingCategory.id, formData);
        if (response.success && response.data) {
          const updatedCategories = categories.map(cat =>
            cat.id === editingCategory.id ? response.data! : cat
          );
          onCategoriesUpdate(updatedCategories);
        }
      } else {
        const response = await apiClient.createCategory(formData);
        if (response.success && response.data) {
          onCategoriesUpdate([...categories, response.data]);
        }
      }

      setShowForm(false);
      setEditingCategory(null);
      setFormData({ name: '', description: '', icon_url: '📋', color_code: '#0066FF' });
    } catch (error) {
      console.error('Failed to save category:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      icon_url: category.icon_url || '📋',
      color_code: category.color_code || '#0066FF'
    });
    setShowForm(true);
  };

  const handleDelete = async (categoryId: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      setLoading(true);
      const response = await apiClient.deleteCategory(categoryId);

      if (response.success) {
        const updatedCategories = categories.filter(cat => cat.id !== categoryId);
        onCategoriesUpdate(updatedCategories);
      }
    } catch (error) {
      console.error('Failed to delete category:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '', icon_url: '📋', color_code: '#0066FF' });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold gradient-text-charcoal mb-2">
          Category Management
        </h2>
        <p className="text-text-secondary">
          Manage issue categories and their properties
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-modern p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-bright-blue to-vibrant-pink rounded-xl flex items-center justify-center text-white text-xl">
              🏷️
            </div>
            <div>
              <h3 className="text-2xl font-bold gradient-text-accent">
                {categories.length}
              </h3>
              <p className="text-text-secondary text-sm">Total Categories</p>
            </div>
          </div>
        </div>

        <div className="card-modern p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-neon-green to-iridescent-purple rounded-xl flex items-center justify-center text-white text-xl">
              ✅
            </div>
            <div>
              <h3 className="text-2xl font-bold gradient-text-accent">
                {categories.filter(cat => cat.is_active).length}
              </h3>
              <p className="text-text-secondary text-sm">Active Categories</p>
            </div>
          </div>
        </div>

        <div className="card-modern p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-vibrant-pink to-bright-blue rounded-xl flex items-center justify-center text-white text-xl">
              📊
            </div>
            <div>
              <h3 className="text-2xl font-bold gradient-text-accent">
                {categories.filter(cat => !cat.is_active).length}
              </h3>
              <p className="text-text-secondary text-sm">Inactive Categories</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Category Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold gradient-text-charcoal">
          Categories ({categories.length})
        </h3>
        <button
          onClick={() => setShowForm(true)}
          className="btn-modern"
        >
          + Add Category
        </button>
      </div>

      {/* Category Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card-modern p-8 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold gradient-text-charcoal">
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h3>
              <button
                onClick={handleCancel}
                className="text-text-secondary hover:text-accent-primary"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-text-secondary text-sm">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-modern w-full"
                  required
                />
              </div>

              <div>
                <label className="text-text-secondary text-sm">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-modern w-full"
                  rows={3}
                />
              </div>

              <div>
                <label className="text-text-secondary text-sm">Icon</label>
                <div className="grid grid-cols-6 gap-2 mt-2">
                  {categoryIcons.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon_url: icon })}
                      className={`p-2 rounded-lg text-xl transition-all duration-300 ${formData.icon_url === icon
                          ? 'bg-accent-primary text-white'
                          : 'glass-surface border border-glass-border hover:border-accent-primary'
                        }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-text-secondary text-sm">Color</label>
                <div className="grid grid-cols-6 gap-2 mt-2">
                  {categoryColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color_code: color })}
                      className={`w-8 h-8 rounded-lg border-2 transition-all duration-300 ${formData.color_code === color ? 'border-white shadow-lg' : 'border-glass-border'
                        }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 btn-modern"
                >
                  {loading ? 'Saving...' : (editingCategory ? 'Update' : 'Create')}
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 glass-surface border border-glass-border px-4 py-2 rounded-xl text-text-secondary hover:text-accent-primary transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category List */}
      <div className="card-modern p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="glass-surface rounded-xl p-4 border border-glass-border hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl"
                  style={{ backgroundColor: category.color_code || '#0066FF' }}
                >
                  {category.icon_url || '📋'}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="px-3 py-1 text-xs glass-surface border border-glass-border rounded-lg text-text-secondary hover:text-accent-primary transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    disabled={loading}
                    className="px-3 py-1 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <h4 className="font-medium text-text-primary mb-1">
                {category.name}
              </h4>

              {category.description && (
                <p className="text-text-secondary text-sm mb-3">
                  {category.description}
                </p>
              )}

              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs border ${category.is_active
                    ? 'bg-green-500/20 text-green-500 border-green-500/30'
                    : 'bg-gray-500/20 text-gray-500 border-gray-500/30'
                  }`}>
                  {category.is_active ? 'Active' : 'Inactive'}
                </span>

                <span className="text-xs text-text-secondary">
                  ID: {category.id}
                </span>
              </div>
            </div>
          ))}

          {categories.length === 0 && (
            <div className="col-span-full text-center py-12">
              <div className="text-6xl mb-4">🏷️</div>
              <p className="text-text-secondary">
                No categories found. Create your first category to get started.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 