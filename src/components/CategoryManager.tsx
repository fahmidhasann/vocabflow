import { useState, useCallback } from 'react';
import { useVocabulary } from '../hooks/useVocabulary';
import { motion } from 'motion/react';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { Category, CategoryColor } from '../types';

const COLOR_OPTIONS: CategoryColor[] = ['emerald', 'blue', 'purple', 'red', 'amber', 'pink', 'cyan'];

const COLOR_MAP: Record<CategoryColor, string> = {
  emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-100',
  blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100',
  purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-100',
  red: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100',
  amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-100',
  pink: 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-100',
  cyan: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-100',
};

interface CategoryFormData {
  name: string;
  description: string;
  color: CategoryColor;
}

export function CategoryManager() {
  const { categories, addCategory, updateCategory, deleteCategory, getCategoryStats } =
    useVocabulary();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    color: 'emerald',
  });

  const handleAddCategory = useCallback(() => {
    if (!formData.name.trim()) return;
    addCategory(formData.name, formData.description, formData.color);
    setFormData({ name: '', description: '', color: 'emerald' });
    setIsAdding(false);
  }, [formData, addCategory]);

  const handleSaveEdit = useCallback(() => {
    if (!editingId || !formData.name.trim()) return;
    updateCategory(editingId, {
      name: formData.name,
      description: formData.description,
      color: formData.color,
    });
    setEditingId(null);
    setFormData({ name: '', description: '', color: 'emerald' });
  }, [editingId, formData, updateCategory]);

  const startEdit = (category: Category) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      description: category.description || '',
      color: category.color || 'emerald',
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', description: '', color: 'emerald' });
  };

  const cancelAdd = () => {
    setIsAdding(false);
    setFormData({ name: '', description: '', color: 'emerald' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Categories</h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Category
          </button>
        )}
      </div>

      {/* Add Category Form */}
      {isAdding && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-zinc-800 p-6 rounded-lg border border-zinc-200 dark:border-zinc-700"
        >
          <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-50">
            Create New Category
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Business Vocabulary"
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
                Description (optional)
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="e.g., Vocabulary for work presentations"
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
                Color
              </label>
              <div className="flex gap-2 flex-wrap">
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-10 h-10 rounded-lg ${COLOR_MAP[color]} ${
                      formData.color === color ? 'ring-2 ring-offset-2 ring-zinc-400' : ''
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={cancelAdd}
                className="px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Categories List */}
      <div className="grid gap-4">
        {categories.length === 0 ? (
          <div className="text-center py-12 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
            <p className="text-zinc-500 dark:text-zinc-400">No categories yet. Create one to get started!</p>
          </div>
        ) : (
          categories.map((category) => {
            const stats = getCategoryStats(category.id);
            const color = category.color || 'emerald';

            return (
              <motion.div
                key={category.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white dark:bg-zinc-800 p-6 rounded-lg border border-zinc-200 dark:border-zinc-700"
              >
                {editingId === category.id ? (
                  // Edit Form
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
                        Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
                        Description
                      </label>
                      <input
                        type="text"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
                        Color
                      </label>
                      <div className="flex gap-2 flex-wrap">
                        {COLOR_OPTIONS.map((c) => (
                          <button
                            key={c}
                            onClick={() => setFormData({ ...formData, color: c })}
                            className={`w-10 h-10 rounded-lg ${COLOR_MAP[c]} ${
                              formData.color === c ? 'ring-2 ring-offset-2 ring-zinc-400' : ''
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={cancelEdit}
                        className="px-3 py-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        className="px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  // Display Mode
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-4 h-4 rounded-full ${COLOR_MAP[color].split(' ')[0]}`} />
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                          {category.name}
                        </h3>
                      </div>
                      {category.description && (
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                          {category.description}
                        </p>
                      )}
                      <div className="flex gap-4 text-sm">
                        <div>
                          <span className="text-zinc-600 dark:text-zinc-400">Total: </span>
                          <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                            {stats.total}
                          </span>
                        </div>
                        <div>
                          <span className="text-zinc-600 dark:text-zinc-400">Learning: </span>
                          <span className="font-semibold text-blue-600 dark:text-blue-400">
                            {stats.learning}
                          </span>
                        </div>
                        <div>
                          <span className="text-zinc-600 dark:text-zinc-400">Mastered: </span>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            {stats.mastered}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => startEdit(category)}
                        className="p-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => deleteCategory(category.id)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
