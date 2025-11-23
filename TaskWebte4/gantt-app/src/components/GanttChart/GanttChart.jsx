import { useState, useRef, useEffect } from 'react';
import GanttRow from './GanttRow';
import DependencyArrows from './DependencyArrows';
import { generateTimelineUnits } from '../../utils/dateUtils';
import { useTasks } from '../../hooks/useTasks';

const ZOOM_LEVELS = [
  { id: 'day', days: 1 },
  { id: 'week', days: 7 },
  { id: 'month', days: 30 },
  { id: 'quarter', days: 90 }
];

const GanttChart = ({ dateRange, searchQuery, selectedTags, onTagToggle, onExport, onImport, translations: t }) => {
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
    getAvailableDependencies,
    undo,
    redo,
    canUndo,
    canRedo
  } = useTasks();

  const allTags = getAllTags();

  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [zoomLevel, setZoomLevel] = useState('month');
  const [tableWidth, setTableWidth] = useState(420); // Default table width in pixels
  const [isResizingSplit, setIsResizingSplit] = useState(false);
  const [linkingFromTask, setLinkingFromTask] = useState(null); // Task ID we're linking FROM
  const [hoveredTaskId, setHoveredTaskId] = useState(null); // Track hovered row for sync highlight
  const [columnWidths, setColumnWidths] = useState({
    name: 180,
    date: 90,
    duration: 50,
    progress: 50,
    actions: 50
  });
  const [resizingColumn, setResizingColumn] = useState(null);
  const chartBodyRef = useRef(null);
  const timelineRef = useRef(null);
  const containerRef = useRef(null);
  const tableHeaderRef = useRef(null);
  const tableBodyRef = useRef(null);

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

  // Generate timeline based on zoom level
  const timelineUnits = generateTimelineUnits(dateRange, zoomLevel, t);
  const visibleTasks = getVisibleTasks();

  // Filter tasks by search and tags
  const filteredTasks = visibleTasks.filter(task => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!task.name.toLowerCase().includes(query)) {
        return false;
      }
    }
    // Tag filter
    if (selectedTags && selectedTags.length > 0) {
      if (!task.tags || !task.tags.some(tag => selectedTags.includes(tag))) {
        return false;
      }
    }
    return true;
  });

  // Check if task is highlighted by search
  const isTaskHighlighted = (task) => {
    if (!searchQuery) return false;
    return task.name.toLowerCase().includes(searchQuery.toLowerCase());
  };

  // Calculate today marker position
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

  // Handle split resize
  const handleSplitMouseDown = (e) => {
    e.preventDefault();
    setIsResizingSplit(true);

    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        let newWidth = e.clientX - containerRect.left;
        // Clamp between 200 and 600 pixels
        newWidth = Math.max(200, Math.min(600, newWidth));
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

  // Sync scroll between timeline header and body
  const handleBodyScroll = (e) => {
    if (timelineRef.current) {
      timelineRef.current.scrollLeft = e.target.scrollLeft;
    }
  };

  // Sync scroll between table header and body (body -> header)
  const handleTableScroll = (e) => {
    if (tableHeaderRef.current) {
      tableHeaderRef.current.scrollLeft = e.target.scrollLeft;
    }
  };

  // Handle column resize
  const handleColumnResize = (column, e) => {
    e.preventDefault();
    setResizingColumn(column);
    const startX = e.clientX;
    const startWidth = columnWidths[column];

    const handleMouseMove = (e) => {
      const deltaX = e.clientX - startX;
      const newWidth = Math.max(30, startWidth + deltaX);
      setColumnWidths(prev => ({ ...prev, [column]: newWidth }));
    };

    const handleMouseUp = () => {
      setResizingColumn(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Get zoom multiplier for timeline width
  const getZoomMultiplier = () => {
    const level = ZOOM_LEVELS.find(l => l.id === zoomLevel);
    if (!level) return 1;
    // More days = narrower view, fewer days = wider view
    return 30 / level.days;
  };

  const timelineWidth = 100 * getZoomMultiplier();

  return (
    <div className={`gantt ${isResizingSplit ? 'gantt--resizing' : ''}`} ref={containerRef}>
      {/* Sticky top section */}
      <div className="gantt__sticky-top">
        {/* Toolbar */}
        <div className="gantt__toolbar">
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

      {/* Tag filter row */}
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
        </div>
      )}

      {/* Header */}
      <div className={`gantt__header ${resizingColumn ? 'gantt__header--resizing' : ''}`}>
        <div className="gantt__header-table" style={{ width: `${tableWidth}px` }} ref={tableHeaderRef}>
          <div className="gantt__header-cell gantt__header-cell--name" style={{ width: `${columnWidths.name}px` }}>
            {t?.taskName || 'Názov úlohy'}
            <div className="gantt__column-resize" onMouseDown={(e) => handleColumnResize('name', e)} />
          </div>
          <div className="gantt__header-cell gantt__header-cell--date" style={{ width: `${columnWidths.date}px` }}>
            {t?.startDate || 'Začiatok'}
            <div className="gantt__column-resize" onMouseDown={(e) => handleColumnResize('date', e)} />
          </div>
          <div className="gantt__header-cell gantt__header-cell--duration" style={{ width: `${columnWidths.duration}px` }}>
            {t?.days || 'Dni'}
            <div className="gantt__column-resize" onMouseDown={(e) => handleColumnResize('duration', e)} />
          </div>
          <div className="gantt__header-cell gantt__header-cell--progress" style={{ width: `${columnWidths.progress}px` }}>
            %
            <div className="gantt__column-resize" onMouseDown={(e) => handleColumnResize('progress', e)} />
          </div>
          <div className="gantt__header-cell gantt__header-cell--actions" style={{ width: `${columnWidths.actions}px` }}>
            <button
              className="gantt__btn gantt__btn--add-root"
              onClick={() => addTask(null)}
              title={t?.addTask || 'Pridať úlohu'}
            >
              +
            </button>
          </div>
        </div>
        {/* Split divider */}
        <div className="gantt__split-divider" onMouseDown={handleSplitMouseDown} />
        <div className="gantt__header-timeline" ref={timelineRef}>
          <div className="gantt__timeline-scroll" style={{ width: `${timelineWidth}%` }}>
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
            {/* Today marker in header */}
            {todayPosition !== null && (
              <div
                className="gantt__today-marker gantt__today-marker--header"
                style={{ left: `${todayPosition}%` }}
              />
            )}
          </div>
        </div>
      </div>
      </div>

      {/* Body */}
      <div className="gantt__body" onDragEnd={handleDragEnd}>
        {filteredTasks.length === 0 ? (
          <div className="gantt__empty">
            <p>{searchQuery ? (t?.noResults || 'Žiadne výsledky') : (t?.noTasks || 'Žiadne úlohy.')}</p>
            {!searchQuery && (
              <button
                className="gantt__empty-btn"
                onClick={() => addTask(null)}
              >
                + {t?.addFirstTask || 'Pridať prvú úlohu'}
              </button>
            )}
          </div>
        ) : (
          <div className="gantt__content">
            {/* Table column - fixed */}
            <div className="gantt__table-column" style={{ width: `${tableWidth}px` }} ref={tableBodyRef} onScroll={handleTableScroll}>
              {filteredTasks.map(task => {
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
                    isHighlighted={isTaskHighlighted(task)}
                    timelineWidth={timelineWidth}
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
                  />
                );
              })}
            </div>
            {/* Split divider in body */}
            <div className="gantt__split-divider gantt__split-divider--body" onMouseDown={handleSplitMouseDown} />
            {/* Chart column - scrollable */}
            <div
              className="gantt__chart-column"
              ref={chartBodyRef}
              onScroll={handleBodyScroll}
            >
              <div className="gantt__chart-scroll" style={{ width: `${timelineWidth}%` }}>
                {/* Dependency arrows */}
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
                      isHighlighted={isTaskHighlighted(task)}
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
                    />
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="gantt__legend">
        <span className="gantt__legend-title">{t?.legend || 'Legenda'}:</span>
        <div className="gantt__legend-items">
          <div className="gantt__legend-item">
            <span className="gantt__legend-color" style={{ backgroundColor: '#10b981' }} />
            <span className="gantt__legend-label">{t?.mainTask || 'Hlavná úloha'}</span>
          </div>
          <div className="gantt__legend-item">
            <span className="gantt__legend-color" style={{ backgroundColor: '#3b82f6' }} />
            <span className="gantt__legend-label">{t?.task || 'Úloha'}</span>
          </div>
          {todayPosition !== null && (
            <div className="gantt__legend-item">
              <span className="gantt__legend-color gantt__legend-color--today" />
              <span className="gantt__legend-label">{t?.today || 'Dnes'}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GanttChart;
