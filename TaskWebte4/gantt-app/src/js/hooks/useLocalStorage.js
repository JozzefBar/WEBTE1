import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
  // Get initial value from localStorage or use provided initial value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Save to localStorage whenever value changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('localStorageChange', {
        detail: { key, value: storedValue }
      }));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Listen for changes from other components
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.detail && e.detail.key === key) {
        try {
          const item = window.localStorage.getItem(key);
          if (item) {
            const newValue = JSON.parse(item);
            // Only update if the value actually changed to prevent infinite loops
            setStoredValue(prev => {
              if (JSON.stringify(prev) !== JSON.stringify(newValue)) {
                return newValue;
              }
              return prev;
            });
          }
        } catch (error) {
          console.error(`Error reading localStorage key "${key}":`, error);
        }
      }
    };

    window.addEventListener('localStorageChange', handleStorageChange);

    return () => {
      window.removeEventListener('localStorageChange', handleStorageChange);
    };
  }, [key]);

  return [storedValue, setStoredValue];
};

export default useLocalStorage;
