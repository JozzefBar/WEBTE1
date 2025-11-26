import { useLocalStorage } from './useLocalStorage';

// Default categories without name - names come from translations
// When user edits a category, the name field is set and overrides translation
const DEFAULT_CATEGORIES = [
  { id: 'summary', color: '#10b981' },
  { id: 'task', color: '#3b82f6' },
  { id: 'goal', color: '#f97316' }
];

export const useCategories = () => {
  const [categories, setCategories] = useLocalStorage('gantt-categories', DEFAULT_CATEGORIES);

  const addCategory = (name, color) => {
    const newCategory = {
      id: `category-${Date.now()}`,
      name,
      color
    };
    setCategories([...categories, newCategory]);
    return newCategory;
  };

  const updateCategory = (id, updates) => {
    setCategories(categories.map(cat =>
      cat.id === id ? { ...cat, ...updates } : cat
    ));
  };

  const deleteCategory = (id) => {
    // Don't allow deleting default categories
    if (['summary', 'task', 'goal'].includes(id)) {
      return false;
    }
    setCategories(categories.filter(cat => cat.id !== id));
    return true;
  };

  const getCategoryById = (id) => {
    return categories.find(cat => cat.id === id);
  };

  const resetToDefaults = () => {
    setCategories(DEFAULT_CATEGORIES);
  };

  return {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
    resetToDefaults
  };
};

export default useCategories;
