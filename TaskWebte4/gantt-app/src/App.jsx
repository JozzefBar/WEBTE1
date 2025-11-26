import { useState, useCallback, useEffect } from 'react';
import { GanttChart } from './components/GanttChart';
import { getCurrentDateFormatted, getDefaultDateRange } from './utils/dateUtils';
import { useLocalStorage } from './hooks/useLocalStorage';

// Translations
const translations = {
  sk: {
    title: 'Gantt Diagram',
    from: 'Od',
    to: 'Do',
    zoom: 'Priblíženie',
    export: 'Export',
    import: 'Import',
    print: 'Tlačiť',
    taskName: 'Názov úlohy',
    startDate: 'Začiatok',
    days: 'Dni',
    addTask: 'Pridať úlohu',
    addFirstTask: 'Pridať prvú úlohu',
    noTasks: 'Žiadne úlohy.',
    tags: 'Štítky',
    allTags: 'Všetky',
    legend: 'Legenda',
    today: 'Dnes',
    undo: 'Späť',
    redo: 'Dopredu',
    mainTask: 'Hlavná úloha',
    task: 'Úloha',
    day: 'Deň',
    week: 'Týždeň',
    month: 'Mesiac',
    quarter: 'Štvrťrok',
    categories: 'Kategórie',
    manageCategories: 'Správa kategórií',
    addCategory: 'Pridať kategóriu',
    categoryName: 'Názov kategórie',
    confirmDeleteCategory: 'Naozaj chcete odstrániť túto kategóriu?',
    cannotDeleteDefault: 'Nemožno odstrániť predvolenú kategóriu.',
    confirmReset: 'Naozaj chcete obnoviť predvolené kategórie?',
    resetToDefaults: 'Obnoviť predvolené',
    done: 'Hotovo',
    showDatesInPrint: 'Zobraziť dátumy pri tlači',
    dayNames: ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'],
    monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'Máj', 'Jún', 'Júl', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'],
    weekPrefix: 'T',
    category_summary: 'Hlavná úloha',
    category_task: 'Úloha',
    category_goal: 'Cieľ',
    newTask: 'Nová úloha'
  },
  en: {
    title: 'Gantt Chart',
    from: 'From',
    to: 'To',
    zoom: 'Zoom',
    export: 'Export',
    import: 'Import',
    print: 'Print',
    taskName: 'Task name',
    startDate: 'Start',
    days: 'Days',
    addTask: 'Add task',
    addFirstTask: 'Add first task',
    noTasks: 'No tasks.',
    tags: 'Tags',
    allTags: 'All',
    legend: 'Legend',
    today: 'Today',
    undo: 'Undo',
    redo: 'Redo',
    mainTask: 'Summary task',
    task: 'Task',
    day: 'Day',
    week: 'Week',
    month: 'Month',
    quarter: 'Quarter',
    categories: 'Categories',
    manageCategories: 'Manage Categories',
    addCategory: 'Add category',
    categoryName: 'Category name',
    confirmDeleteCategory: 'Are you sure you want to delete this category?',
    cannotDeleteDefault: 'Cannot delete default category.',
    confirmReset: 'Are you sure you want to reset to default categories?',
    resetToDefaults: 'Reset to defaults',
    done: 'Done',
    showDatesInPrint: 'Show dates in print',
    dayNames: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    weekPrefix: 'W',
    category_summary: 'Summary task',
    category_task: 'Task',
    category_goal: 'Goal',
    newTask: 'New task'
  }
};

function App() {
  const [dateRange, setDateRange] = useLocalStorage('gantt-date-range', getDefaultDateRange());
  const [selectedTags, setSelectedTags] = useState([]);
  const [language, setLanguage] = useLocalStorage('gantt-language', 'sk');
  const [theme, setTheme] = useLocalStorage('gantt-theme', 'light');

  const t = translations[language];

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Export tasks
  const handleExport = useCallback(() => {
    const tasks = JSON.parse(localStorage.getItem('gantt-tasks') || '[]');
    const categories = JSON.parse(localStorage.getItem('gantt-categories') || '[]');
    const data = {
      tasks,
      categories,
      dateRange,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gantt-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [dateRange]);

  // Import tasks
  const handleImport = useCallback((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.tasks) {
          // Import tasks
          localStorage.setItem('gantt-tasks', JSON.stringify(data.tasks));

          // Import date range
          if (data.dateRange) {
            localStorage.setItem('gantt-date-range', JSON.stringify(data.dateRange));
          }

          // Import categories or auto-detect from tasks
          if (data.categories) {
            // Merge imported categories with existing ones
            const existingCategories = JSON.parse(localStorage.getItem('gantt-categories') || '[]');
            const existingIds = new Set(existingCategories.map(c => c.id));

            // Add imported categories that don't exist yet
            const newCategories = data.categories.filter(c => !existingIds.has(c.id));
            const mergedCategories = [...existingCategories, ...newCategories];

            localStorage.setItem('gantt-categories', JSON.stringify(mergedCategories));
          } else {
            // Auto-detect missing categories from tasks
            const existingCategories = JSON.parse(localStorage.getItem('gantt-categories') || '[]');
            const existingIds = new Set(existingCategories.map(c => c.id));
            const usedCategoryIds = new Set(data.tasks.map(t => t.category).filter(Boolean));

            // Create missing categories with default colors
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
        <h1 className="app__title">{t.title}</h1>
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
        {/* Gantt Chart */}
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
      </main>
    </div>
  );
}

export default App;
