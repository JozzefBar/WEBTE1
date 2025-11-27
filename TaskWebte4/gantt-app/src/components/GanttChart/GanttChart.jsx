import { useState, useRef, useEffect, useMemo } from 'react';
import GanttRow from './GanttRow';
import DependencyArrows from './DependencyArrows';
import { CategoryManager } from '../CategoryManager';
import { generateTimelineUnits } from '../../utils/dateUtils';
import { useTasks } from '../../hooks/useTasks';
import { useCategories } from '../../hooks/useCategories';

const ZOOM_LEVELS = [
  { id: 'day', days: 1 },
  { id: 'week', days: 7 },
  { id: 'month', days: 30 },
  { id: 'quarter', days: 90 }
];

const GanttChart = ({ dateRange, onDateRangeChange, selectedTags, onTagToggle, onExport, onImport, translations: t }) => {
  const {
    editingTaskId,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    toggleExpand,
    getVisibleTasks,
    getTaskDepth,
    hasChildren,
    getAllTags,
    startEditing,
    stopEditing,
    addDependency,
    removeDependency,
    undo,
    redo,
    canUndo,
    canRedo,
    tasks
  } = useTasks(t);

  const { categories, getCategoryById } = useCategories();
  const allTags = useMemo(() => getAllTags(), [getAllTags]);

  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [zoomLevel, setZoomLevel] = useState('month');
  const [tableWidth, setTableWidth] = useState(520);
  const [isResizingSplit, setIsResizingSplit] = useState(false);
  const [linkingFromTask, setLinkingFromTask] = useState(null);
  const [hoveredTaskId, setHoveredTaskId] = useState(null);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showToolbar, setShowToolbar] = useState(true);
  const [viewMode, setViewMode] = useState('both'); // 'both', 'table-only', 'chart-only'
  const [columnWidths, setColumnWidths] = useState({
    name: 180,
    date: 90,
    duration: 50,
    progress: 50,
    actions: 50
  });
  const [hiddenColumns, setHiddenColumns] = useState([]);
  const tableBodyContentRef = useRef(null);
  const DEFAULT_COLUMN_WIDTHS = {
    name: 180,
    date: 90,
    duration: 50,
    progress: 50,
    actions: 50
  };
  const [resizingColumn, setResizingColumn] = useState(null);

  // Refs for scroll sync
  const containerRef = useRef(null);
  const tableHeaderRef = useRef(null);
  const tableBodyRef = useRef(null);
  const timelineHeaderRef = useRef(null);
  const chartBodyRef = useRef(null);

  // Click outside to cancel editing
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (editingTaskId && !e.target.closest('.gantt__table-row')) {
        stopEditing();
      }
    };

    if (editingTaskId) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editingTaskId, stopEditing]);

  // Click outside to cancel linking mode
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Cancel linking if clicked outside dependency targets
      // Use 'click' instead of 'mousedown' to allow onClick handlers to complete first
      if (linkingFromTask && !e.target.closest('.gantt__dependency-target')) {
        setLinkingFromTask(null);
      }
    };

    if (linkingFromTask) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [linkingFromTask]);

  // Handle responsive view mode based on screen width
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;

      // If mobile and currently in 'both' mode, switch to table-only
      if (isMobile && viewMode === 'both') {
        setViewMode('table-only');
      }
    };

    // Check on mount
    handleResize();

    // Listen to resize events
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [viewMode]);

  // Generate timeline based on zoom level
  const timelineUnits = generateTimelineUnits(dateRange, zoomLevel, t);
  const visibleTasks = getVisibleTasks();

  // Filter tasks by tags and date range
  const filteredTasks = visibleTasks.filter(task => {
    // Filter by tags
    if (selectedTags && selectedTags.length > 0) {
      if (!task.tags || !task.tags.some(tag => selectedTags.includes(tag))) {
        return false;
      }
    }

    // Filter by date range - hide tasks completely outside the range
    const taskStart = new Date(task.startDate);
    const taskEnd = new Date(task.endDate);
    const rangeStart = new Date(dateRange.start);
    const rangeEnd = new Date(dateRange.end);

    // Task is outside range if it ends before range starts OR starts after range ends
    if (taskEnd < rangeStart || taskStart > rangeEnd) {
      return false;
    }

    // Filter by search query (ignore diacritics)
    if (searchQuery && searchQuery.trim()) {
      // Normalize strings to remove diacritics
      const normalize = (str) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      const query = normalize(searchQuery);
      const taskName = normalize(task.name || '');
      if (!taskName.includes(query)) {
        return false;
      }
    }

    return true;
  });

  // Get category display name (translation or custom name)
  const getCategoryName = (category) => {
    if (!category) return '';
    // If category has custom name, use it
    if (category.name) {
      return category.name;
    }
    // Otherwise use translation for default categories
    if (t && t[`category_${category.id}`]) {
      return t[`category_${category.id}`];
    }
    // Fallback to ID
    return category.id;
  };

  // Get unique categories used in visible filtered tasks
  const usedCategories = useMemo(() => {
    const categoryIds = new Set(filteredTasks.map(task => task.category || 'task'));
    return Array.from(categoryIds)
      .map(id => getCategoryById(id))
      .filter(cat => cat !== undefined);
  }, [filteredTasks, getCategoryById]);

  const getTodayPosition = () => {
    const today = new Date();
    const rangeStart = new Date(dateRange.start);
    const rangeEnd = new Date(dateRange.end);

    if (today < rangeStart || today > rangeEnd) return null;

    const totalDays = (rangeEnd - rangeStart) / (1000 * 60 * 60 * 24);
    const todayOffset = (today - rangeStart) / (1000 * 60 * 60 * 24);

    return (todayOffset / totalDays) * 100;
  };

  const todayPosition = getTodayPosition();

  // Drag handlers
  const handleDragStart = (e, taskId) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetTaskId) => {
    e.preventDefault();
    if (draggedTaskId && draggedTaskId !== targetTaskId) {
      moveTask(draggedTaskId, targetTaskId);
    }
    setDraggedTaskId(null);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
  };

  // Handle split resize - NO minimum width restriction
  const handleSplitMouseDown = (e) => {
    e.preventDefault();
    setIsResizingSplit(true);

    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        let newWidth = e.clientX - containerRect.left;
        // Allow very small width (50px min) up to 800px
        newWidth = Math.max(50, Math.min(800, newWidth));
        setTableWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizingSplit(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Handle split resize - Touch support
  const handleSplitTouchStart = (e) => {
    e.preventDefault();
    setIsResizingSplit(true);

    const handleTouchMove = (e) => {
      if (containerRef.current && e.touches[0]) {
        const containerRect = containerRef.current.getBoundingClientRect();
        let newWidth = e.touches[0].clientX - containerRect.left;
        newWidth = Math.max(50, Math.min(800, newWidth));
        setTableWidth(newWidth);
      }
    };

    const handleTouchEnd = () => {
      setIsResizingSplit(false);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchcancel', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('touchcancel', handleTouchEnd);
  };

  // Sync scroll: chart body -> timeline header (horizontal) + table body (vertical)
  // Chart body is the MASTER for vertical scroll
  const handleChartBodyScroll = (e) => {
    // Sync horizontal to timeline header (both have same width, so direct sync)
    if (timelineHeaderRef.current) {
      timelineHeaderRef.current.scrollLeft = e.target.scrollLeft;
    }
    // Sync vertical to table body (chart is master, table follows)
    if (tableBodyRef.current) {
      tableBodyRef.current.scrollTop = e.target.scrollTop;
    }
  };

  // Sync horizontal scroll: timeline header -> chart body
  const handleTimelineHeaderScroll = (e) => {
    if (chartBodyRef.current) {
      chartBodyRef.current.scrollLeft = e.target.scrollLeft;
    }
  };


  // Sync scroll: table body -> table header (horizontal) + chart body (vertical)
  const handleTableBodyScroll = (e) => {
    // Sync horizontal to table header
    if (tableHeaderRef.current) {
      tableHeaderRef.current.scrollLeft = e.target.scrollLeft;
    }
    // Sync vertical to chart body (bidirectional sync)
    if (chartBodyRef.current && chartBodyRef.current.scrollTop !== e.target.scrollTop) {
      chartBodyRef.current.scrollTop = e.target.scrollTop;
    }
  };

  // Handle column resize for a single column (standard behavior).
  // Dragging the resizer adjusts only the targeted column's width.
  const handleColumnResize = (column, e) => {
    e.preventDefault();
    setResizingColumn(column);
    const startX = e.clientX;
    const startWidth = columnWidths[column] || DEFAULT_COLUMN_WIDTHS[column] || 60;

    let finalWidth = startWidth;
    const MIN_WIDTH = 30;
    const HIDE_THRESHOLD = 40;

    const handleMouseMove = (ev) => {
      const deltaX = ev.clientX - startX;
      const newWidth = Math.max(0, Math.round(startWidth + deltaX));
      finalWidth = newWidth;
      setColumnWidths(prev => ({ ...prev, [column]: Math.max(MIN_WIDTH, newWidth) }));
    };

    const handleMouseUp = () => {
      setResizingColumn(null);

      if (finalWidth < HIDE_THRESHOLD) {
        setHiddenColumns(prev => prev.includes(column) ? prev : [...prev, column]);
        setColumnWidths(prev => ({ ...prev, [column]: 0 }));
      }

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Handle column resize - Touch support
  const handleColumnTouchStart = (column, e) => {
    e.preventDefault();
    setResizingColumn(column);
    const startX = e.touches[0].clientX;
    const startWidth = columnWidths[column] || DEFAULT_COLUMN_WIDTHS[column] || 60;

    let finalWidth = startWidth;
    const MIN_WIDTH = 30;
    const HIDE_THRESHOLD = 40;

    const handleTouchMove = (ev) => {
      if (ev.touches[0]) {
        const deltaX = ev.touches[0].clientX - startX;
        const newWidth = Math.max(0, Math.round(startWidth + deltaX));
        finalWidth = newWidth;
        setColumnWidths(prev => ({ ...prev, [column]: Math.max(MIN_WIDTH, newWidth) }));
      }
    };

    const handleTouchEnd = () => {
      setResizingColumn(null);

      if (finalWidth < HIDE_THRESHOLD) {
        setHiddenColumns(prev => prev.includes(column) ? prev : [...prev, column]);
        setColumnWidths(prev => ({ ...prev, [column]: 0 }));
      }

      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchcancel', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('touchcancel', handleTouchEnd);
  };

  // (resizing now handled by full-height resizer overlays rendered in the table body)

  // Handle overlay boundary resize between two adjacent columns (leftCol, rightCol).
  // This adjusts the left and right columns inversely so the boundary moves.
  const handleOverlayBoundaryResize = (leftCol, rightCol, e) => {
    e.preventDefault();
    setResizingColumn(`${leftCol}-${rightCol}`);
    const startX = e.clientX;
    const startLeft = leftCol ? (columnWidths[leftCol] || DEFAULT_COLUMN_WIDTHS[leftCol] || 60) : 0;
    const startRight = rightCol ? (columnWidths[rightCol] || DEFAULT_COLUMN_WIDTHS[rightCol] || 60) : 0;

    let finalLeft = startLeft;
    let finalRight = startRight;
    const MIN_WIDTH = 30;
    const HIDE_THRESHOLD = 40;

    const handleMouseMove = (ev) => {
      const deltaX = ev.clientX - startX;
      let newLeft = startLeft + (leftCol ? deltaX : 0);
      let newRight = startRight - (rightCol ? deltaX : 0);

      // enforce minimums and transfer overflow
      if (leftCol && newLeft < MIN_WIDTH) {
        const diff = MIN_WIDTH - newLeft;
        newLeft = MIN_WIDTH;
        newRight -= diff;
      }
      if (rightCol && newRight < MIN_WIDTH) {
        const diff = MIN_WIDTH - newRight;
        newRight = MIN_WIDTH;
        newLeft -= diff;
      }

      finalLeft = Math.max(0, Math.round(newLeft));
      finalRight = Math.max(0, Math.round(newRight));

      setColumnWidths(prev => ({ ...prev, ...(leftCol ? { [leftCol]: finalLeft } : {}), ...(rightCol ? { [rightCol]: finalRight } : {}) }));
    };

    const handleMouseUp = () => {
      setResizingColumn(null);

      if (leftCol && finalLeft < HIDE_THRESHOLD) {
        setHiddenColumns(prev => prev.includes(leftCol) ? prev : [...prev, leftCol]);
        setColumnWidths(prev => ({ ...prev, [leftCol]: 0 }));
      }
      if (rightCol && finalRight < HIDE_THRESHOLD) {
        setHiddenColumns(prev => prev.includes(rightCol) ? prev : [...prev, rightCol]);
        setColumnWidths(prev => ({ ...prev, [rightCol]: 0 }));
      }

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Calculate minimum width for timeline
  const getTimelineMinWidth = () => {
    const numUnits = timelineUnits.length;
    const minWidthPerUnit = 60;
    return numUnits * minWidthPerUnit;
  };

  const timelineMinWidth = getTimelineMinWidth();

  // Calculate total table content width
  const tableContentWidth = columnWidths.name + columnWidths.date + columnWidths.duration + columnWidths.progress + columnWidths.actions;

  return (
    <div className={`gantt ${isResizingSplit ? 'gantt--resizing' : ''} ${!showToolbar ? 'gantt--toolbar-hidden' : ''}`} ref={containerRef}>
      {/* Toolbar - full width */}
      <div className={`gantt__toolbar-wrapper ${!showToolbar ? 'gantt__toolbar-wrapper--hidden' : ''}`}>
        <div className="gantt__toolbar">
            {/* Row 1: Date range */}
            <div className="gantt__toolbar-row-dates">
              <label className="gantt__toolbar-label">
                {t?.from || 'Od'}:
            <input
              type="date"
              className="gantt__toolbar-input"
              value={dateRange.start}
              onChange={(e) =>
                onDateRangeChange({ ...dateRange, start: e.target.value })
              }
            />
          </label>
          <label className="gantt__toolbar-label">
            {t?.to || 'Do'}:
            <input
              type="date"
              className="gantt__toolbar-input"
              value={dateRange.end}
              onChange={(e) =>
                onDateRangeChange({ ...dateRange, end: e.target.value })
              }
            />
          </label>
          <label className="gantt__toolbar-label">
            {t?.search || 'Hľadať'}:
            <input
              type="text"
              className="gantt__toolbar-input gantt__toolbar-input--search"
              placeholder={t?.searchPlaceholder || 'Zadajte názov úlohy...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </label>
        </div>
        
        {/* Row 2: Zoom on left + Actions on right */}
        <div className="gantt__toolbar-row-bottom">
          <div className="gantt__zoom">
            <span className="gantt__zoom-label">{t?.zoom || 'Priblíženie'}:</span>
            {ZOOM_LEVELS.map(level => (
              <button
                key={level.id}
                className={`gantt__zoom-btn ${zoomLevel === level.id ? 'gantt__zoom-btn--active' : ''}`}
                onClick={() => setZoomLevel(level.id)}
              >
                {t?.[level.id] || level.id}
              </button>
            ))}
          </div>
          <div className="gantt__actions">
            <button
              className="gantt__action-btn"
              onClick={undo}
              disabled={!canUndo()}
              title={t?.undo || 'Späť'}
            >
              ↶
            </button>
            <button
              className="gantt__action-btn"
              onClick={redo}
              disabled={!canRedo()}
              title={t?.redo || 'Dopredu'}
            >
              ↷
            </button>
            <button
              className="gantt__action-btn"
              onClick={() => setIsCategoryManagerOpen(true)}
              title={t?.manageCategories || 'Správa kategórií'}
            >
              🎨 {t?.categories || 'Kategórie'}
            </button>
            <button
              className="gantt__action-btn"
              onClick={() => window.print()}
              title={t?.print || 'Tlačiť'}
            >
              🖨️ {t?.print || 'Tlačiť'}
            </button>
            <button className="gantt__action-btn" onClick={onExport} title={t?.export || 'Export JSON'}>
              📥 {t?.export || 'Export'}
            </button>
            <label className="gantt__action-btn">
              📤 {t?.import || 'Import'}
              <input
                type="file"
                accept=".json"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) onImport(file);
                }}
              />
            </label>
          </div>
        </div>
      </div>

          {/* Tag filter row - full width */}
          {allTags.length > 0 && (
            <div className="gantt__tags-row">
              <span className="gantt__tags-label">{t?.tags || 'Štítky'}:</span>
              {allTags.map(tag => (
                <button
                  key={tag}
                  className={`gantt__tag-btn ${selectedTags.includes(tag) ? 'gantt__tag-btn--active' : ''}`}
                  onClick={() => onTagToggle(tag)}
                >
                  {tag}
                </button>
              ))}
              {/* Toolbar toggle button */}
              <button
                className="gantt__toolbar-toggle"
                onClick={() => setShowToolbar(!showToolbar)}
              >
                ▲
              </button>
            </div>
          )}
      </div>

      {/* Show toolbar button when hidden */}
      {!showToolbar && (
        <div className="gantt__toolbar-show">
          <button
            className="gantt__toolbar-toggle gantt__toolbar-toggle--show"
            onClick={() => setShowToolbar(true)}
          >
            ▼
          </button>
        </div>
      )}

      <div className={`gantt__main gantt__main--${viewMode}`} onDragEnd={handleDragEnd}>
        {/* Headers row - fixed at top */}
        <div className="gantt__headers-row">
          {viewMode !== 'chart-only' && (
            <div
              className={`gantt__table-header ${resizingColumn ? 'gantt__header--resizing' : ''}`}
              style={{ width: `${tableWidth}px` }}
              ref={tableHeaderRef}
            >
              <div className="gantt__table-header-content" style={{ minWidth: `${tableContentWidth}px` }}>
              <div className="gantt__header-cell gantt__header-cell--name" style={{ width: `${columnWidths.name}px`, display: columnWidths.name === 0 ? 'none' : undefined }}>
                {t?.taskName || 'Názov úlohy'}
                <div className="gantt__column-resize" onMouseDown={(e) => handleColumnResize('name', e)} onTouchStart={(e) => handleColumnTouchStart('name', e)} />
              </div>
              <div className="gantt__header-cell gantt__header-cell--date" style={{ width: `${columnWidths.date}px`, display: columnWidths.date === 0 ? 'none' : undefined }}>
                {t?.startDate || 'Začiatok'}
                <div className="gantt__column-resize" onMouseDown={(e) => handleColumnResize('date', e)} onTouchStart={(e) => handleColumnTouchStart('date', e)} />
              </div>
              <div className="gantt__header-cell gantt__header-cell--duration" style={{ width: `${columnWidths.duration}px`, display: columnWidths.duration === 0 ? 'none' : undefined }}>
                {t?.days || 'Dni'}
                <div className="gantt__column-resize" onMouseDown={(e) => handleColumnResize('duration', e)} onTouchStart={(e) => handleColumnTouchStart('duration', e)} />
              </div>
              <div className="gantt__header-cell gantt__header-cell--progress" style={{ width: `${columnWidths.progress}px`, display: columnWidths.progress === 0 ? 'none' : undefined }}>
                %
                <div className="gantt__column-resize" onMouseDown={(e) => handleColumnResize('progress', e)} onTouchStart={(e) => handleColumnTouchStart('progress', e)} />
              </div>
              <div className="gantt__header-cell gantt__header-cell--actions" style={{ width: `${columnWidths.actions}px`, display: columnWidths.actions === 0 ? 'none' : undefined }}>
                <button
                  className="gantt__btn gantt__btn--add-root"
                  onClick={() => addTask(null)}
                  title={t?.addTask || 'Pridať úlohu'}
                >
                  +
                </button>
              </div>

              {/* Hidden columns pill area */}
              {hiddenColumns.length > 0 && (
                <div className="gantt__hidden-columns">
                  {hiddenColumns.map(col => (
                    <button
                      key={col}
                      className="gantt__hidden-pill"
                      onClick={() => {
                        // restore to default width
                        setColumnWidths(prev => ({ ...prev, [col]: DEFAULT_COLUMN_WIDTHS[col] || 60 }));
                        setHiddenColumns(prev => prev.filter(c => c !== col));
                      }}
                    >
                      {col === 'name'
                        ? (t?.taskName || 'Názov úlohy')
                        : (col === 'date'
                          ? (t?.startDate || 'date')
                          : (col === 'duration'
                            ? (t?.days || 'duration')
                            : (col === 'progress' ? '%' : col)))}
                    </button>
                  ))}
                </div>
              )}
            </div>
            </div>
          )}

          {/* Timeline Header */}
          {viewMode !== 'table-only' && (
            <div
              className="gantt__timeline-header"
              ref={timelineHeaderRef}
              onScroll={handleTimelineHeaderScroll}
            >
            <div className="gantt__timeline-scroll" style={{ minWidth: `${timelineMinWidth}px` }}>
              {timelineUnits.map((unit, index) => (
                <div
                  key={index}
                  className="gantt__timeline-unit"
                  style={{ left: `${unit.left}%`, width: `${unit.width}%` }}
                >
                  <span className="gantt__timeline-label">{unit.label}</span>
                  {unit.sublabel && <span className="gantt__timeline-sublabel">{unit.sublabel}</span>}
                </div>
              ))}
              {todayPosition !== null && (
                <div
                  className="gantt__today-marker gantt__today-marker--header"
                  style={{ left: `${todayPosition}%` }}
                />
              )}
            </div>
            </div>
          )}
        </div>

        {/* Bodies row - table and chart side by side */}
        <div className="gantt__bodies-row">
          {/* Table Body */}
          {viewMode !== 'chart-only' && (
            <div
              className="gantt__table-body"
              style={{ width: `${tableWidth}px` }}
            >
              <div
                className="gantt__table-body-scroll"
                ref={tableBodyRef}
                onScroll={handleTableBodyScroll}
              >
                  <div
                    className="gantt__table-body-content"
                    style={{ minWidth: `${tableContentWidth}px` }}
                    ref={tableBodyContentRef}
                  >
              {filteredTasks.length === 0 ? (
                <div className="gantt__empty">
                  {tasks.length === 0 ? (
                    <>
                      <p>{t?.noTasks || 'Žiadne úlohy.'}</p>
                      <button className="gantt__empty-btn" onClick={() => addTask(null)}>
                        + {t?.addFirstTask || 'Pridať prvú úlohu'}
                      </button>
                    </>
                  ) : (
                    <p>{t?.noResultsForFilters || 'Podľa zadaných filtrov sa nenašli žiadne úlohy.'}</p>
                  )}
                </div>
              ) : (
                filteredTasks.map(task => {
                  const taskHasChildren = hasChildren(task.id);
                  const isExpanded = task.expanded !== false;
                  const depth = getTaskDepth(task.id);
                  const isRoot = task.parentId === null;

                  return (
                    <GanttRow
                      key={task.id}
                      task={task}
                      dateRange={dateRange}
                      depth={depth}
                      hasChildren={taskHasChildren}
                      isExpanded={isExpanded}
                      isEditing={editingTaskId === task.id}
                      onToggleExpand={toggleExpand}
                      onStartEdit={startEditing}
                      onStopEdit={stopEditing}
                      onUpdate={updateTask}
                      onDelete={deleteTask}
                      onAddChild={addTask}
                      onDragStart={handleDragStart}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      isDragging={draggedTaskId === task.id}
                      timelineWidth={100}
                      todayPosition={todayPosition}
                      tableWidth={tableWidth}
                      isRoot={isRoot}
                      renderMode="table"
                      linkingFromTask={linkingFromTask}
                      onStartLink={setLinkingFromTask}
                      onCompleteLink={(targetId) => {
                        if (linkingFromTask && linkingFromTask !== targetId) {
                          addDependency(targetId, linkingFromTask);
                        }
                        setLinkingFromTask(null);
                      }}
                      isHovered={hoveredTaskId === task.id}
                      onHover={setHoveredTaskId}
                      columnWidths={columnWidths}
                      hiddenColumns={hiddenColumns}
                      translations={t}
                    />
                  );
                })
              )}
                </div>
              {/* Allow starting column resize from body */}
              {/* Full-height resizer overlays between columns - clickable from any row */}
                <div className="gantt__table-resizers" aria-hidden="true">
                  {(() => {
                    const cols = ['name','date','duration','progress','actions'];
                    const resizers = [];
                    const widthFor = (c) => (typeof columnWidths[c] === 'number' ? columnWidths[c] : (DEFAULT_COLUMN_WIDTHS[c] || 0));
                    let cum = 0;
                    for (let i = 0; i < cols.length - 1; i++) {
                      const col = cols[i];
                      cum += widthFor(col);

                      // find nearest visible columns to left and right of this boundary
                      let leftVisible = null;
                      for (let j = i; j >= 0; j--) {
                        if (widthFor(cols[j]) > 0) { leftVisible = cols[j]; break; }
                      }
                      let rightVisible = null;
                      for (let j = i + 1; j < cols.length; j++) {
                        if (widthFor(cols[j]) > 0) { rightVisible = cols[j]; break; }
                      }

                      // render resizer only when it separates two different visible columns
                      if (leftVisible && rightVisible && leftVisible !== rightVisible) {
                        // compute left position based on leftVisible cumulative width
                        const leftIndex = cols.indexOf(leftVisible);
                        const leftPos = cols.slice(0, leftIndex + 1).reduce((s, c) => s + widthFor(c), 0);

                        resizers.push(
                          <div
                            key={`resizer-${i}`}
                            className="gantt__table-resizer"
                            style={{ left: `${leftPos}px` }}
                            onMouseDown={(e) => handleColumnResize(leftVisible, e)}
                            onTouchStart={(e) => handleColumnTouchStart(leftVisible, e)}
                          />
                        );
                      }
                    }
                    return resizers;
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* Chart Body */}
          {viewMode !== 'table-only' && (
            <div className="gantt__chart-body">
              <div
                className="gantt__chart-body-scroll"
                ref={chartBodyRef}
                onScroll={handleChartBodyScroll}
              >
                <div className="gantt__chart-scroll" style={{ minWidth: `${timelineMinWidth}px` }}>
              {/* Grid overlay based on timeline units */}
              <div className="gantt__chart-grid" style={{ height: `${filteredTasks.length * 40}px` }}>
                {timelineUnits.map((unit, index) => (
                  <div
                    key={index}
                    className="gantt__chart-grid-line"
                    style={{ left: `${unit.left}%` }}
                  />
                ))}
                {/* Right edge line */}
                <div
                  className="gantt__chart-grid-line"
                  style={{ left: '100%' }}
                  />
              </div>

              {filteredTasks.length > 0 && (
                <>
                  <DependencyArrows
                    tasks={filteredTasks}
                    dateRange={dateRange}
                    onRemoveDependency={removeDependency}
                  />
                  {filteredTasks.map(task => {
                    const taskHasChildren = hasChildren(task.id);
                    const isRoot = task.parentId === null;

                    return (
                      <GanttRow
                        key={task.id}
                        task={task}
                        dateRange={dateRange}
                        depth={0}
                        hasChildren={taskHasChildren}
                        isExpanded={true}
                        isEditing={editingTaskId === task.id}
                        onToggleExpand={toggleExpand}
                        onStartEdit={startEditing}
                        onStopEdit={stopEditing}
                        onUpdate={updateTask}
                        onDelete={deleteTask}
                        onAddChild={addTask}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        isDragging={draggedTaskId === task.id}
                        timelineWidth={100}
                        todayPosition={todayPosition}
                        tableWidth={tableWidth}
                        isRoot={isRoot}
                        renderMode="chart"
                        linkingFromTask={linkingFromTask}
                        onStartLink={setLinkingFromTask}
                        onCompleteLink={(targetId) => {
                          if (linkingFromTask && linkingFromTask !== targetId) {
                            addDependency(targetId, linkingFromTask);
                          }
                          setLinkingFromTask(null);
                        }}
                        isHovered={hoveredTaskId === task.id}
                        onHover={setHoveredTaskId}
                        translations={t}
                      />
                    );
                  })}
                </>
              )}
                </div>
                {/* Full-height resizer overlays between columns - only in both mode */}
                {viewMode === 'both' && (
                  <div className="gantt__table-resizers" aria-hidden="true">
                    {(() => {
                      const cols = ['name','date','duration','progress','actions'];
                      const resizers = [];
                      const widthFor = (c) => (typeof columnWidths[c] === 'number' ? columnWidths[c] : (DEFAULT_COLUMN_WIDTHS[c] || 0));
                      let cum = 0;
                      for (let i = 0; i < cols.length - 1; i++) {
                        const col = cols[i];
                        cum += widthFor(col);

                        // find nearest visible columns to left and right of this boundary
                        let leftVisible = null;
                        for (let j = i; j >= 0; j--) {
                          if (widthFor(cols[j]) > 0) { leftVisible = cols[j]; break; }
                        }
                        let rightVisible = null;
                        for (let j = i + 1; j < cols.length; j++) {
                          if (widthFor(cols[j]) > 0) { rightVisible = cols[j]; break; }
                        }

                        // render resizer only when it separates two different visible columns
                        if (leftVisible && rightVisible && leftVisible !== rightVisible) {
                          // compute left position based on leftVisible cumulative width
                          const leftIndex = cols.indexOf(leftVisible);
                          const leftPos = cols.slice(0, leftIndex + 1).reduce((s, c) => s + widthFor(c), 0);

                          resizers.push(
                            <div
                              key={`resizer-${i}`}
                              className="gantt__table-resizer"
                              style={{ left: `${leftPos}px` }}
                              onMouseDown={(e) => handleColumnResize(leftVisible, e)}
                              onTouchStart={(e) => handleColumnTouchStart(leftVisible, e)}
                            />
                          );
                        }
                      }
                      return resizers;
                    })()}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Single Split Divider - spans full height */}
        {viewMode === 'both' && (
          <div
            className="gantt__split-divider"
            style={{ left: `${tableWidth}px` }}
            onMouseDown={handleSplitMouseDown}
            onTouchStart={handleSplitTouchStart}
          >
            {/* View mode toggle buttons */}
            <div className="gantt__view-toggle">
              <button
                className="gantt__view-toggle-btn"
                onClick={() => setViewMode('chart-only')}
              >
                ◀
              </button>
              <button
                className="gantt__view-toggle-btn"
                onClick={() => setViewMode('table-only')}
              >
                ▶
              </button>
            </div>
          </div>
        )}

        {/* Restore buttons when in single view mode */}
        {viewMode === 'table-only' && (
          <button
            className="gantt__restore-btn gantt__restore-btn--right"
            onClick={() => {
              // On mobile/tablet, toggle to chart-only instead of both
              const isMobile = window.innerWidth <= 768;
              setViewMode(isMobile ? 'chart-only' : 'both');
            }}
          >
            ◀
          </button>
        )}
        {viewMode === 'chart-only' && (
          <button
            className="gantt__restore-btn gantt__restore-btn--left"
            onClick={() => {
              // On mobile/tablet, toggle to table-only instead of both
              const isMobile = window.innerWidth <= 768;
              setViewMode(isMobile ? 'table-only' : 'both');
            }}
          >
            ▶
          </button>
        )}
      </div>

      {/* Legend */}
      <div className="gantt__legend">
        <span className="gantt__legend-title">{t?.legend || 'Legenda'}:</span>
        <div className="gantt__legend-items">
          {usedCategories.map(category => (
            <div key={category.id} className="gantt__legend-item">
              <span className="gantt__legend-color" style={{ backgroundColor: category.color }} />
              <span className="gantt__legend-label">{getCategoryName(category)}</span>
            </div>
          ))}
          {todayPosition !== null && (
            <div className="gantt__legend-item">
              <span className="gantt__legend-color gantt__legend-color--today" />
              <span className="gantt__legend-label">{t?.today || 'Dnes'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Category Manager Modal */}
      <CategoryManager
        isOpen={isCategoryManagerOpen}
        onClose={() => setIsCategoryManagerOpen(false)}
        translations={t}
      />

      {/* Footer */}
      <div className="gantt__footer">
        <span className="gantt__footer-text">
          © {new Date().getFullYear()} {t?.createdBy || 'Vytvoril'} Jozef Barčák. {t?.allRightsReserved || 'Všetky práva vyhradené'}.
        </span>
      </div>
    </div>
  );
};

export default GanttChart;
