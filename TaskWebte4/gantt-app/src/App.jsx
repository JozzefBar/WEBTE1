import { useState, useCallback, useEffect } from 'react';
import { GanttChart } from './components/GanttChart';
import { getCurrentDateFormatted, getDefaultDateRange } from './js/utils/dateUtils';
import { useLocalStorage } from './js/hooks/useLocalStorage';

function App() {
  const [dateRange, setDateRange] = useLocalStorage('gantt-date-range', getDefaultDateRange());
  const [selectedTags, setSelectedTags] = useState([]);
  const [language, setLanguage] = useLocalStorage('gantt-language', 'sk');
  const [theme, setTheme] = useLocalStorage('gantt-theme', 'light');
  const [t, setT] = useState(null);

  // Load translations
  useEffect(() => {
    const loadLocale = async () => {
      try {
        const res = await fetch(`./locales/${language}.json`);
        if (!res.ok) throw new Error('Locale fetch failed');
        const data = await res.json();
        setT(data);
      } catch (err) {
        console.error('Failed to load locale', language, err);
        setT({});
      }
    };
    loadLocale();
  }, [language]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleExport = useCallback(() => {
    const tasks = JSON.parse(localStorage.getItem('gantt-tasks') || '[]');
    const categories = JSON.parse(localStorage.getItem('gantt-categories') || '[]');
    const data = {
      tasks,
      categories,
      dateRange,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gantt-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [dateRange]);

  const handleImport = useCallback((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.tasks) {
          localStorage.setItem('gantt-tasks', JSON.stringify(data.tasks));

          if (data.dateRange) {
            localStorage.setItem('gantt-date-range', JSON.stringify(data.dateRange));
          }

          if (data.categories) {
            const existingCategories = JSON.parse(localStorage.getItem('gantt-categories') || '[]');
            const existingIds = new Set(existingCategories.map(c => c.id));
            const newCategories = data.categories.filter(c => !existingIds.has(c.id));
            const mergedCategories = [...existingCategories, ...newCategories];
            localStorage.setItem('gantt-categories', JSON.stringify(mergedCategories));
          } else {
            const existingCategories = JSON.parse(localStorage.getItem('gantt-categories') || '[]');
            const existingIds = new Set(existingCategories.map(c => c.id));
            const usedCategoryIds = new Set(data.tasks.map(t => t.category).filter(Boolean));
            const missingIds = Array.from(usedCategoryIds).filter(id => !existingIds.has(id));
            const defaultColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

            const newCategories = missingIds.map((id, index) => ({
              id,
              name: id.charAt(0).toUpperCase() + id.slice(1),
              color: defaultColors[index % defaultColors.length]
            }));

            if (newCategories.length > 0) {
              const mergedCategories = [...existingCategories, ...newCategories];
              localStorage.setItem('gantt-categories', JSON.stringify(mergedCategories));
            }
          }

          window.location.reload();
        }
      } catch (err) {
        alert('Neplatný JSON súbor');
      }
    };
    reader.readAsText(file);
  }, []);

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">{t?.title || 'gantt-app'}</h1>
        <div className="app__header-right">
          <span className="app__date">{getCurrentDateFormatted(language)}</span>
          <button
            className="app__theme-btn"
            onClick={toggleTheme}
            title={theme === 'light' ? 'Dark mode' : 'Light mode'}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <select
            className="app__lang-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="sk">SK</option>
            <option value="en">EN</option>
          </select>
        </div>
      </header>

      <main className="app__main">
        {t ? (
          <GanttChart
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            selectedTags={selectedTags}
            onTagToggle={(tag) => {
              setSelectedTags(prev =>
                prev.includes(tag)
                  ? prev.filter(t => t !== tag)
                  : [...prev, tag]
              );
            }}
            onExport={handleExport}
            onImport={handleImport}
            translations={t}
          />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '1.2rem', color: '#666' }}>
            Loading...
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
