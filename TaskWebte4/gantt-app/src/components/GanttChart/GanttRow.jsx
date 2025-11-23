import { useState } from 'react';
import GanttBar from './GanttBar';
import { calculateDuration, calculateTaskPosition, addDays } from '../../utils/dateUtils';

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
  isHighlighted,
  timelineWidth,
  todayPosition,
  tableWidth,
  isRoot,
  renderMode = 'both', // 'table', 'chart', or 'both'
  linkingFromTask,
  onStartLink,
  onCompleteLink
}) => {
  const isLinking = linkingFromTask !== null;
  const isLinkSource = linkingFromTask === task.id;
  const [localEditData, setLocalEditData] = useState(null);

  // Start inline editing
  const handleStartEdit = () => {
    setLocalEditData({ ...task });
    onStartEdit(task.id);
  };

  // Save changes
  const handleSave = () => {
    if (localEditData) {
      onUpdate(task.id, localEditData);
    }
    setLocalEditData(null);
    onStopEdit();
  };

  // Cancel editing
  const handleCancel = () => {
    setLocalEditData(null);
    onStopEdit();
  };

  // Handle input change
  const handleChange = (field, value) => {
    setLocalEditData(prev => ({ ...prev, [field]: value }));
  };

  // Handle duration change - recalculate end date
  const handleDurationChange = (newDuration) => {
    const days = Math.max(1, parseInt(newDuration) || 1);
    const newEndDate = addDays(localEditData?.startDate || task.startDate, days - 1);
    setLocalEditData(prev => ({ ...prev, endDate: newEndDate }));
  };

  const position = calculateTaskPosition(task, dateRange);
  const duration = calculateDuration(task.startDate, task.endDate);
  const currentData = isEditing ? (localEditData || task) : task;
  const currentDuration = isEditing && localEditData
    ? calculateDuration(localEditData.startDate, localEditData.endDate)
    : duration;

  // Handle row drag (only from table part)
  const handleRowDragStart = (e) => {
    onDragStart(e, task.id);
  };

  // Render only table part
  if (renderMode === 'table') {
    return (
      <div
        className={`gantt__table-row ${isDragging ? 'gantt__table-row--dragging' : ''} ${isHighlighted ? 'gantt__table-row--highlighted' : ''}`}
        draggable={!isEditing}
        onDragStart={handleRowDragStart}
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, task.id)}
      >
        {/* Name cell */}
        <div className="gantt__cell gantt__cell--name" style={{ paddingLeft: `${depth * 16 + 8}px` }}>
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
            style={{ backgroundColor: task.color }}
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
        <div className="gantt__cell gantt__cell--date">
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
        <div className="gantt__cell gantt__cell--duration">
          {isEditing ? (
            <input
              type="number"
              className="gantt__cell-input gantt__cell-input--duration"
              value={currentDuration}
              min="1"
              onChange={(e) => handleDurationChange(e.target.value)}
            />
          ) : (
            <span>{duration}</span>
          )}
        </div>

        {/* Progress cell */}
        <div className="gantt__cell gantt__cell--progress">
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
        <div className="gantt__cell gantt__cell--actions">
          {isEditing ? (
            <>
              <button className="gantt__btn gantt__btn--save" onClick={handleSave} title="Uložiť">✓</button>
              <button className="gantt__btn gantt__btn--cancel" onClick={handleCancel} title="Zrušiť">✕</button>
            </>
          ) : isLinking ? (
            <>
              {isLinkSource ? (
                <button
                  className="gantt__btn gantt__btn--cancel"
                  onClick={() => onStartLink(null)}
                  title="Zrušiť spájanie"
                >
                  ✕
                </button>
              ) : (
                <button
                  className="gantt__btn gantt__btn--link-target"
                  onClick={() => onCompleteLink(task.id)}
                  title="Spojiť sem"
                >
                  ⤵
                </button>
              )}
            </>
          ) : (
            <>
              <button
                className="gantt__btn gantt__btn--link"
                onClick={() => onStartLink(task.id)}
                title="Vytvoriť spojenie"
              >
                🔗
              </button>
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
      <div className={`gantt__chart-row ${isHighlighted ? 'gantt__chart-row--highlighted' : ''}`}>
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
    );
  }

  // Render both (legacy mode)
  return (
    <div
      className={`gantt__row ${isDragging ? 'gantt__row--dragging' : ''} ${isHighlighted ? 'gantt__row--highlighted' : ''}`}
      draggable={!isEditing}
      onDragStart={handleRowDragStart}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, task.id)}
    >
      {/* Table part */}
      <div className="gantt__row-table" style={{ width: `${tableWidth}px` }}>
        {/* Name cell */}
        <div className="gantt__cell gantt__cell--name" style={{ paddingLeft: `${depth * 16 + 8}px` }}>
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
            style={{ backgroundColor: task.color }}
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
        <div className="gantt__cell gantt__cell--date">
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
        <div className="gantt__cell gantt__cell--duration">
          {isEditing ? (
            <input
              type="number"
              className="gantt__cell-input gantt__cell-input--duration"
              value={currentDuration}
              min="1"
              onChange={(e) => handleDurationChange(e.target.value)}
            />
          ) : (
            <span>{duration}</span>
          )}
        </div>

        {/* Progress cell */}
        <div className="gantt__cell gantt__cell--progress">
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
        <div className="gantt__cell gantt__cell--actions">
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
