import { useState, useEffect } from 'react';
import GanttBar from './GanttBar';
import { calculateDuration, calculateTaskPosition, addDays } from '../../utils/dateUtils';
import { useCategories } from '../../hooks/useCategories';

const GanttRow = ({
  task,
  dateRange,
  depth,
  hasChildren,
  isExpanded,
  isEditing,
  onToggleExpand,
  onStartEdit,
  onStopEdit,
  onUpdate,
  onDelete,
  onAddChild,
  onDragStart,
  onDragOver,
  onDrop,
  isDragging,
  timelineWidth,
  todayPosition,
  tableWidth,
  isRoot,
  renderMode = 'both', // 'table', 'chart', or 'both'
  linkingFromTask,
  onStartLink,
  onCompleteLink,
  isHovered,
  onHover,
  columnWidths = { name: 180, date: 90, duration: 50, progress: 50, actions: 50 },
  translations: t
}) => {
  const { categories, getCategoryById } = useCategories();
  const isLinking = linkingFromTask !== null;
  const [localEditData, setLocalEditData] = useState(null);
  const [newTagInput, setNewTagInput] = useState('');

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

  // Sync task changes from chart back to edit fields (reverse sync)
  useEffect(() => {
    if (isEditing && localEditData) {
      // Update localEditData when task changes from chart manipulation
      // Only update fields that might have changed from chart (dates, progress, name)
      setLocalEditData(prev => ({
        ...prev,
        name: task.name,
        startDate: task.startDate,
        endDate: task.endDate,
        progress: task.progress,
      }));
    }
  }, [task.name, task.startDate, task.endDate, task.progress, isEditing]);

  // Start inline editing
  const handleStartEdit = () => {
    setLocalEditData({ ...task, tags: task.tags || [], category: task.category || 'task' });
    setNewTagInput('');
    onStartEdit(task.id);
  };

  // Save changes
  const handleSave = () => {
    if (localEditData) {
      onUpdate(task.id, localEditData);
    }
    setLocalEditData(null);
    setNewTagInput('');
    onStopEdit();
  };

  // Cancel editing
  const handleCancel = () => {
    setLocalEditData(null);
    setNewTagInput('');
    onStopEdit();
  };

  // Handle input change
  const handleChange = (field, value) => {
    const updatedData = { ...localEditData, [field]: value };
    setLocalEditData(updatedData);
    // Update in real-time for diagram sync
    onUpdate(task.id, updatedData);
  };

  // Add a new tag
  const handleAddTag = () => {
    const tag = newTagInput.trim();
    if (tag && localEditData) {
      const currentTags = localEditData.tags || [];
      if (!currentTags.includes(tag)) {
        const updatedData = { ...localEditData, tags: [...currentTags, tag] };
        setLocalEditData(updatedData);
        // Update in real-time for diagram sync
        onUpdate(task.id, updatedData);
      }
      setNewTagInput('');
    }
  };

  // Remove a tag
  const handleRemoveTag = (tagToRemove) => {
    if (localEditData) {
      const currentTags = localEditData.tags || [];
      const updatedData = { ...localEditData, tags: currentTags.filter(t => t !== tagToRemove) };
      setLocalEditData(updatedData);
      // Update in real-time for diagram sync
      onUpdate(task.id, updatedData);
    }
  };

  // Handle duration change - recalculate end date
  const handleDurationChange = (newDuration) => {
    const days = Math.max(0, parseInt(newDuration) || 0);
    const newEndDate = addDays(localEditData?.startDate || task.startDate, days - 1);
    const updatedData = { ...localEditData, endDate: newEndDate };
    setLocalEditData(updatedData);
    // Update in real-time for diagram sync
    onUpdate(task.id, updatedData);
  };

  const position = calculateTaskPosition(task, dateRange);
  const duration = calculateDuration(task.startDate, task.endDate);
  const currentData = isEditing ? (localEditData || task) : task;
  const currentDuration = isEditing && localEditData
    ? calculateDuration(localEditData.startDate, localEditData.endDate)
    : duration;

  // Get category color for the indicator
  const category = getCategoryById(currentData.category || 'task');
  const categoryColor = category?.color || '#3b82f6';

  // Handle row drag (only from table part)
  const handleRowDragStart = (e) => {
    onDragStart(e, task.id);
  };

  // Render only table part
  if (renderMode === 'table') {
    return (
      <div
        className={`gantt__table-row ${isDragging ? 'gantt__table-row--dragging' : ''} ${isHovered ? 'gantt__table-row--hovered' : ''}`}
        draggable={!isEditing}
        onDragStart={handleRowDragStart}
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, task.id)}
        onMouseEnter={() => onHover(task.id)}
        onMouseLeave={() => onHover(null)}
      >
        {/* Name cell */}
        <div className="gantt__cell gantt__cell--name" style={{ width: `${columnWidths.name}px`, paddingLeft: `${depth * 16 + 8}px`, display: columnWidths.name === 0 ? 'none' : undefined }}>
          {hasChildren ? (
            <button
              className="gantt__expand-btn"
              onClick={() => onToggleExpand(task.id)}
            >
              {isExpanded ? '▼' : '▶'}
            </button>
          ) : (
            <span className="gantt__expand-placeholder" />
          )}

          <span
            className="gantt__cell-color"
            style={{ backgroundColor: categoryColor }}
          />

          {isEditing ? (
            <div className="gantt__cell-edit-content">
              <input
                type="text"
                className="gantt__cell-input"
                value={currentData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave();
                  if (e.key === 'Escape') handleCancel();
                }}
              />
              {/* Category selector */}
              <select
                className="gantt__category-select"
                value={currentData.category || 'task'}
                onChange={(e) => handleChange('category', e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {getCategoryName(cat)}
                  </option>
                ))}
              </select>
              {/* Tag editor */}
              <div className="gantt__tag-editor">
                <div className="gantt__tag-list">
                  {(currentData.tags || []).map(tag => (
                    <span key={tag} className="gantt__tag gantt__tag--editable">
                      {tag}
                      <button
                        className="gantt__tag-remove"
                        onClick={() => handleRemoveTag(tag)}
                        title="Odstrániť štítok"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  className="gantt__tag-input"
                  placeholder="+ štítok"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
              </div>
            </div>
          ) : (
            <>
              <span
                className="gantt__cell-text"
                onDoubleClick={handleStartEdit}
              >
                {task.name}
              </span>
              {task.tags && task.tags.length > 0 && (
                <span className="gantt__tags-inline">
                  {task.tags.map(tag => (
                    <span key={tag} className="gantt__tag">{tag}</span>
                  ))}
                </span>
              )}
            </>
          )}
        </div>

        {/* Start date cell */}
        <div className="gantt__cell gantt__cell--date" style={{ width: `${columnWidths.date}px`, display: columnWidths.date === 0 ? 'none' : undefined }}>
          {isEditing ? (
            <input
              type="date"
              className="gantt__cell-input gantt__cell-input--date"
              value={currentData.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
            />
          ) : (
            <span>{task.startDate}</span>
          )}
        </div>

        {/* Duration cell - editable */}
        <div className="gantt__cell gantt__cell--duration" style={{ width: `${columnWidths.duration}px`, display: columnWidths.duration === 0 ? 'none' : undefined }}>
          {isEditing ? (
            <input
              type="number"
              className="gantt__cell-input gantt__cell-input--duration"
              value={currentDuration}
              min="0"
              onChange={(e) => handleDurationChange(e.target.value)}
            />
          ) : (
            <span>{duration}</span>
          )}
        </div>

        {/* Progress cell */}
        <div className="gantt__cell gantt__cell--progress" style={{ width: `${columnWidths.progress}px`, display: columnWidths.progress === 0 ? 'none' : undefined }}>
          {isEditing ? (
            <input
              type="number"
              className="gantt__cell-input gantt__cell-input--progress"
              value={currentData.progress || 0}
              min="0"
              max="100"
              onChange={(e) => handleChange('progress', Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
            />
          ) : (
            <span>{task.progress || 0}%</span>
          )}
        </div>

        {/* Actions cell */}
        <div className="gantt__cell gantt__cell--actions" style={{ width: `${columnWidths.actions}px`, display: columnWidths.actions === 0 ? 'none' : undefined }}>
          {isEditing ? (
            <>
              <button className="gantt__btn gantt__btn--save" onClick={handleSave} title="Uložiť">✓</button>
              <button className="gantt__btn gantt__btn--cancel" onClick={handleCancel} title="Zrušiť">✕</button>
            </>
          ) : (
            <>
              <button
                className="gantt__btn gantt__btn--add"
                onClick={() => onAddChild(task.id)}
                title="Pridať podúlohu"
              >
                +
              </button>
              <button
                className="gantt__btn gantt__btn--delete"
                onClick={() => onDelete(task.id)}
                title="Odstrániť"
              >
                ×
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // Render only chart part
  if (renderMode === 'chart') {
    return (
      <div
        className={`gantt__chart-row ${isHovered ? 'gantt__chart-row--hovered' : ''}`}
        onMouseEnter={() => onHover(task.id)}
        onMouseLeave={() => onHover(null)}
      >
        <GanttBar
          task={task}
          position={position}
          dateRange={dateRange}
          onUpdate={onUpdate}
          onDoubleClick={handleStartEdit}
          isParent={isRoot}
          isLinking={isLinking}
          linkingFromTask={linkingFromTask}
          onStartLink={onStartLink}
          onCompleteLink={onCompleteLink}
        />
        {/* Today marker in row */}
        {todayPosition !== null && (
          <div
            className="gantt__today-marker"
            style={{ left: `${todayPosition}%` }}
          />
        )}
      </div>
    );
  }

  // Render both (legacy mode)
  return (
    <div
      className={`gantt__row ${isDragging ? 'gantt__row--dragging' : ''}`}
      draggable={!isEditing}
      onDragStart={handleRowDragStart}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, task.id)}
    >
      {/* Table part */}
      <div className="gantt__row-table" style={{ width: `${tableWidth}px` }}>
        {/* Name cell */}
        <div className="gantt__cell gantt__cell--name" style={{ paddingLeft: `${depth * 16 + 8}px`, display: columnWidths.name === 0 ? 'none' : undefined }}>
          {hasChildren ? (
            <button
              className="gantt__expand-btn"
              onClick={() => onToggleExpand(task.id)}
            >
              {isExpanded ? '▼' : '▶'}
            </button>
          ) : (
            <span className="gantt__expand-placeholder" />
          )}

          <span
            className="gantt__cell-color"
            style={{ backgroundColor: categoryColor }}
          />

          {isEditing ? (
            <input
              type="text"
              className="gantt__cell-input"
              value={currentData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') handleCancel();
              }}
            />
          ) : (
            <span
              className="gantt__cell-text"
              onDoubleClick={handleStartEdit}
            >
              {task.name}
            </span>
          )}
        </div>

        {/* Start date cell */}
        <div className="gantt__cell gantt__cell--date" style={{ display: columnWidths.date === 0 ? 'none' : undefined }}>
          {isEditing ? (
            <input
              type="date"
              className="gantt__cell-input gantt__cell-input--date"
              value={currentData.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
            />
          ) : (
            <span>{task.startDate}</span>
          )}
        </div>

        {/* Duration cell */}
        <div className="gantt__cell gantt__cell--duration" style={{ display: columnWidths.duration === 0 ? 'none' : undefined }}>
          {isEditing ? (
            <input
              type="number"
              className="gantt__cell-input gantt__cell-input--duration"
              value={currentDuration}
              min="0"
              onChange={(e) => handleDurationChange(e.target.value)}
            />
          ) : (
            <span>{duration}</span>
          )}
        </div>

        {/* Progress cell */}
        <div className="gantt__cell gantt__cell--progress" style={{ display: columnWidths.progress === 0 ? 'none' : undefined }}>
          {isEditing ? (
            <input
              type="number"
              className="gantt__cell-input gantt__cell-input--progress"
              value={currentData.progress || 0}
              min="0"
              max="100"
              onChange={(e) => handleChange('progress', Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
            />
          ) : (
            <span>{task.progress || 0}%</span>
          )}
        </div>

        {/* Actions cell */}
        <div className="gantt__cell gantt__cell--actions" style={{ display: columnWidths.actions === 0 ? 'none' : undefined }}>
          {isEditing ? (
            <>
              <button className="gantt__btn gantt__btn--save" onClick={handleSave} title="Uložiť">✓</button>
              <button className="gantt__btn gantt__btn--cancel" onClick={handleCancel} title="Zrušiť">✕</button>
            </>
          ) : (
            <>
              <button
                className="gantt__btn gantt__btn--add"
                onClick={() => onAddChild(task.id)}
                title="Pridať podúlohu"
              >
                +
              </button>
              <button
                className="gantt__btn gantt__btn--delete"
                onClick={() => onDelete(task.id)}
                title="Odstrániť"
              >
                ×
              </button>
            </>
          )}
        </div>
      </div>

      {/* Chart part */}
      <div className="gantt__row-chart">
        <div className="gantt__row-chart-inner" style={{ width: `${timelineWidth}%` }}>
          <GanttBar
            task={task}
            position={position}
            dateRange={dateRange}
            onUpdate={onUpdate}
            onDoubleClick={handleStartEdit}
            isParent={isRoot}
          />
          {/* Today marker in row */}
          {todayPosition !== null && (
            <div
              className="gantt__today-marker"
              style={{ left: `${todayPosition}%` }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default GanttRow;
