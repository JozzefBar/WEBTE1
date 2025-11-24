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
    dayNames: ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'],
    monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'Máj', 'Jún', 'Júl', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'],
    weekPrefix: 'T'
  },
  en: {
    title: 'Gantt Chart',
    from: 'From',
    to: 'To',
    zoom: 'Zoom',
    export: 'Export',
    import: 'Import',
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
    dayNames: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    weekPrefix: 'W'
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
    const data = {
      tasks,
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

  // Import tasks
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
