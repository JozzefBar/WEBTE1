import { useLocalStorage } from './useLocalStorage';

const DEFAULT_CATEGORIES = [
  { id: 'summary', name: 'Hlavná úloha', color: '#10b981' },
  { id: 'task', name: 'Úloha', color: '#3b82f6' },
  { id: 'development', name: 'Vývoj', color: '#8b5cf6' },
  { id: 'testing', name: 'Testovanie', color: '#f59e0b' },
  { id: 'documentation', name: 'Dokumentácia', color: '#6b7280' }
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
    if (['summary', 'task'].includes(id)) {
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
