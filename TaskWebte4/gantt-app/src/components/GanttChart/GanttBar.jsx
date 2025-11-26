import { useState, useRef, useEffect } from 'react';
import { calculateDatesFromPosition, calculateDuration } from '../../utils/dateUtils';
import { useCategories } from '../../hooks/useCategories';

const GanttBar = ({
  task,
  position,
  dateRange,
  onUpdate,
  onDoubleClick,
  isParent,
  isLinking,
  linkingFromTask,
  onStartLink,
  onCompleteLink,
  isDraggingRow,
  isEditingRow,
  onRowDragStart
}) => {
  const { getCategoryById } = useCategories();
  const barRef = useRef(null);
  const inputRef = useRef(null);
  const mouseDownPos = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(null); // 'left' or 'right'
  const [isDraggingProgress, setIsDraggingProgress] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [currentLeft, setCurrentLeft] = useState(position.left);
  const [currentWidth, setCurrentWidth] = useState(position.width);
  const [currentProgress, setCurrentProgress] = useState(task.progress || 0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTooltipHovered, setIsTooltipHovered] = useState(false);
  const [isInlineEditing, setIsInlineEditing] = useState(false);
  const [editedName, setEditedName] = useState(task.name);

  const duration = calculateDuration(task.startDate, task.endDate);
  const isMilestone = duration === 0;
  const isLinkSource = linkingFromTask === task.id;

  // Get category color
  const category = getCategoryById(task.category || 'task');
  const categoryColor = category?.color || '#3b82f6';

  // Update when position changes externally
  useEffect(() => {
    if (!isDragging && !isResizing) {
      setCurrentLeft(position.left);
      setCurrentWidth(position.width);
    }
  }, [position.left, position.width, isDragging, isResizing]);

  // Update progress when task changes
  useEffect(() => {
    if (!isDraggingProgress) {
      setCurrentProgress(task.progress || 0);
    }
  }, [task.progress, isDraggingProgress]);

  // Get container width
  const getContainerWidth = () => {
    return barRef.current?.parentElement?.getBoundingClientRect().width || 1;
  };

  // Get bar width in pixels
  const getBarWidth = () => {
    return barRef.current?.getBoundingClientRect().width || 1;
  };

  // Handle HTML5 drag start for row reordering
  const handleBarDragStart = (e) => {
    // Don't allow drag if clicking on interactive elements or already dragging
    if (e.target.classList.contains('gantt__bar-resize') ||
        e.target.classList.contains('gantt__bar-connector') ||
        e.target.classList.contains('gantt__bar-progress-handle') ||
        e.target.closest('.gantt__bar-progress-value') ||
        isDragging || isResizing) {
      e.preventDefault();
      return;
    }

    // If we already detected horizontal drag, cancel HTML5 drag
    if (mouseDownPos.current && mouseDownPos.current.isHorizontal) {
      e.preventDefault();
      return;
    }

    // Vertical movement - allow HTML5 drag for reordering
    if (onRowDragStart) {
      onRowDragStart(e);
    }
  };

  // Handle drag start (move entire bar)
  const handleMouseDown = (e) => {
    if (e.target.classList.contains('gantt__bar-resize') ||
        e.target.classList.contains('gantt__bar-connector') ||
        e.target.classList.contains('gantt__bar-progress-handle')) return;

    // Record mouse position for direction detection
    const startX = e.clientX;
    const startY = e.clientY;
    mouseDownPos.current = { x: startX, y: startY, isHorizontal: false };

    // Attach one-time mousemove to detect direction early
    const handleFirstMove = (moveEvent) => {
      const deltaX = Math.abs(moveEvent.clientX - startX);
      const deltaY = Math.abs(moveEvent.clientY - startY);

      // Need at least 3px movement to determine direction
      if (deltaX < 3 && deltaY < 3) return;

      // Determine if horizontal
      if (deltaX > deltaY) {
        // Horizontal drag - start custom drag
        mouseDownPos.current.isHorizontal = true;
        moveEvent.preventDefault();
        moveEvent.stopPropagation();

        setIsDragging(true);
        setDragStart({
          x: startX,
          initialLeft: currentLeft,
          initialWidth: currentWidth,
          containerWidth: getContainerWidth()
        });
      }

      // Remove this listener after first detection
      document.removeEventListener('mousemove', handleFirstMove);
    };

    document.addEventListener('mousemove', handleFirstMove);

    // Clean up listener on mouseup
    const cleanup = () => {
      document.removeEventListener('mousemove', handleFirstMove);
      document.removeEventListener('mouseup', cleanup);
    };
    document.addEventListener('mouseup', cleanup);
  };

  // Handle resize start
  const handleResizeStart = (e, side) => {
    e.preventDefault();
    e.stopPropagation();

    setIsResizing(side);
    setDragStart({
      x: e.clientX,
      initialLeft: currentLeft,
      initialWidth: currentWidth,
      containerWidth: getContainerWidth()
    });
  };

  // Handle progress drag start
  const handleProgressDragStart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDraggingProgress(true);
    setDragStart({
      x: e.clientX,
      barWidth: getBarWidth(),
      initialProgress: currentProgress
    });
  };

  // Handle connection point click
  const handleConnectorClick = (e, side) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLinking && !isLinkSource) {
      // Complete the link - this task is the target
      onCompleteLink(task.id, side);
    } else if (!isLinking) {
      // Start a new link from this task
      onStartLink(task.id, side);
    }
  };

  // Handle inline editing
  const handleStartInlineEdit = (e) => {
    e.stopPropagation();
    setIsInlineEditing(true);
    setEditedName(task.name);
  };

  const handleSaveInlineEdit = () => {
    if (editedName.trim()) {
      onUpdate(task.id, { name: editedName.trim() });
    }
    setIsInlineEditing(false);
  };

  const handleCancelInlineEdit = () => {
    setEditedName(task.name);
    setIsInlineEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveInlineEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelInlineEdit();
    }
  };

  // Handle name change with real-time sync
  const handleNameChange = (e) => {
    const newName = e.target.value;
    setEditedName(newName);
    // Update in real-time for table sync
    onUpdate(task.id, { name: newName });
  };

  // Focus input when inline editing starts
  useEffect(() => {
    if (isInlineEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isInlineEditing]);

  // Handle mouse move and up for dragging/resizing
  useEffect(() => {
    if (!dragStart) return;

    const handleMouseMove = (e) => {
      const deltaX = e.clientX - dragStart.x;

      if (isDraggingProgress) {
        // Drag progress indicator
        const deltaPercent = (deltaX / dragStart.barWidth) * 100;
        let newProgress = dragStart.initialProgress + deltaPercent;
        newProgress = Math.max(0, Math.min(100, newProgress));
        setCurrentProgress(Math.round(newProgress));
      } else if (isDragging) {
        // Move entire bar
        const deltaPercent = (deltaX / dragStart.containerWidth) * 100;
        let newLeft = dragStart.initialLeft + deltaPercent;
        newLeft = Math.max(0, Math.min(100 - currentWidth, newLeft));
        setCurrentLeft(newLeft);
      } else if (isResizing === 'left') {
        // Resize from left edge
        const deltaPercent = (deltaX / dragStart.containerWidth) * 100;
        let newLeft = dragStart.initialLeft + deltaPercent;
        let newWidth = dragStart.initialWidth - deltaPercent;
        if (newLeft < 0) {
          newWidth += newLeft;
          newLeft = 0;
        }
        // Allow very small widths (0.2% minimum - about 1 day even for 500-day ranges)
        if (newWidth < 0.2) newWidth = 0.2;
        if (newLeft + newWidth > 100) newLeft = 100 - newWidth;
        setCurrentLeft(newLeft);
        setCurrentWidth(newWidth);
      } else if (isResizing === 'right') {
        // Resize from right edge
        const deltaPercent = (deltaX / dragStart.containerWidth) * 100;
        let newWidth = dragStart.initialWidth + deltaPercent;
        // Allow very small widths (0.2% minimum - about 1 day even for 500-day ranges)
        if (newWidth < 0.2) newWidth = 0.2;
        if (currentLeft + newWidth > 100) newWidth = 100 - currentLeft;
        setCurrentWidth(newWidth);
      }
    };

    const handleMouseUp = (e) => {
      // Determine if there was meaningful movement (avoid treating a simple click as a drag)
      const moved = dragStart && typeof e?.clientX === 'number' && Math.abs(e.clientX - dragStart.x) > 2;

      if (isDraggingProgress) {
        // Update progress
        onUpdate(task.id, { progress: currentProgress });
      } else if ((isDragging || isResizing) && moved) {
        // Only recalc dates if the user actually dragged or resized meaningfully
        const newDates = calculateDatesFromPosition(currentLeft, currentWidth, dateRange);
        onUpdate(task.id, newDates);
      }

      setIsDragging(false);
      setIsResizing(null);
      setIsDraggingProgress(false);
      setDragStart(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, isDraggingProgress, dragStart, currentLeft, currentWidth, currentProgress, dateRange, task.id, onUpdate]);

  // Milestone (diamond shape)
  if (isMilestone) {
    const connectorOffsetLeft = -12; // px from milestone center
    const connectorOffsetRight = 18; // px from milestone left to right connector

    return (
      <div
        ref={barRef}
        className="gantt__milestone-wrapper"
        style={{ left: `${currentLeft}%`, top: '5px', position: 'absolute' }}
        draggable={!isEditingRow}
        onDragStart={handleBarDragStart}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Left connector - positioned outside rotated diamond so it doesn't inherit rotation */}
        {(isHovered || isTooltipHovered || isLinking) && (
          <div
            className={`gantt__bar-connector gantt__bar-connector--left ${isLinking && !isLinkSource ? 'gantt__bar-connector--active' : ''}`}
            onClick={(e) => handleConnectorClick(e, 'left')}
            style={{ left: `${connectorOffsetLeft}px`, top: '50%', transform: 'translateY(-50%)' }}
          />
        )}

        {/* The rotated diamond itself - keep drag behavior on the diamond */}
        <div
          className={`gantt__milestone gantt__milestone--goal ${isDragging ? 'gantt__milestone--dragging' : ''}`}
          style={{ backgroundColor: categoryColor }}
          onMouseDown={handleMouseDown}
          onDoubleClick={handleStartInlineEdit}
        />

        {/* Milestone label placed to the right, horizontal in-row */}
        {isInlineEditing ? (
          <input
            ref={inputRef}
            type="text"
            className="gantt__milestone-label-input"
            value={editedName}
            onChange={handleNameChange}
            onKeyDown={handleKeyDown}
            onBlur={handleSaveInlineEdit}
          />
        ) : (
          <span className="gantt__milestone-label">{task.name}</span>
        )}

        {/* Right connector */}
        {(isHovered || isTooltipHovered || isLinking) && (
          <div
            className={`gantt__bar-connector gantt__bar-connector--right ${isLinking && !isLinkSource ? 'gantt__bar-connector--active' : ''}`}
            onClick={(e) => handleConnectorClick(e, 'right')}
            style={{ left: `${connectorOffsetRight}px`, top: '50%', transform: 'translateY(-50%)' }}
          />
        )}
      </div>
    );
  }

  // Use category color
  const barColor = categoryColor;

  // Calculate darker color for progress
  const getDarkerColor = (color) => {
    // Simple darkening - reduce brightness
    if (color.startsWith('#')) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      const darken = 0.7;
      return `rgb(${Math.floor(r * darken)}, ${Math.floor(g * darken)}, ${Math.floor(b * darken)})`;
    }
    return color;
  };

  // Regular bar
  return (
    <div
      ref={barRef}
      className={`gantt__bar ${isDragging || isResizing ? 'gantt__bar--dragging' : ''} ${isParent ? 'gantt__bar--parent' : ''} ${isHovered ? 'gantt__bar--hovered' : ''}`}
      style={{
        left: `${currentLeft}%`,
        width: `${currentWidth}%`,
        backgroundColor: barColor
      }}
      draggable={!isEditingRow && !isDragging && !isResizing}
      onDragStart={handleBarDragStart}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleStartInlineEdit}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      // removed native title to use custom interactive tooltip
    >
      {/* Progress fill (darker left part) */}
      <div
        className="gantt__bar-progress-fill"
        style={{
          width: `${currentProgress}%`,
          backgroundColor: getDarkerColor(barColor)
        }}
      />

      {/* Left resize handle */}
      <div
        className={`gantt__bar-resize gantt__bar-resize--left ${isHovered ? 'gantt__bar-resize--visible' : ''}`}
        onMouseDown={(e) => handleResizeStart(e, 'left')}
      />

      {/* Task label or input */}
      {isInlineEditing ? (
        <input
          ref={inputRef}
          type="text"
          className="gantt__bar-label-input"
          value={editedName}
          onChange={handleNameChange}
          onKeyDown={handleKeyDown}
          onBlur={handleSaveInlineEdit}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        />
      ) : (
        <span className="gantt__bar-label">{task.name}</span>
      )}

      {/* Progress handle/marker (visual only, not interactive) */}
      <div
        className="gantt__bar-progress-handle"
        style={{ left: `${currentProgress}%` }}
      >
        {/* Progress value / tooltip - make the whole label interactive
            and also allow it to be used as a drag-handle for moving the bar
            (clicking on the visible label will start moving the bar). */}
        <span
          className="gantt__bar-progress-value"
          onMouseDown={(e) => {
            // Clicking the visible tooltip should adjust the progress, not move the whole bar.
            e.stopPropagation();
            handleProgressDragStart(e);
          }}
          onMouseEnter={() => setIsTooltipHovered(true)}
          onMouseLeave={() => setIsTooltipHovered(false)}
          style={{ cursor: 'ew-resize' }}
        >
          {currentProgress}%
        </span>
      </div>

      {/* Right resize handle */}
      <div
        className={`gantt__bar-resize gantt__bar-resize--right ${isHovered ? 'gantt__bar-resize--visible' : ''}`}
        onMouseDown={(e) => handleResizeStart(e, 'right')}
      />

      {/* Connection points */}
      {(isHovered || isTooltipHovered || isLinking) && (
        <>
          <div
            className={`gantt__bar-connector gantt__bar-connector--left ${isLinking && !isLinkSource ? 'gantt__bar-connector--active' : ''}`}
            onClick={(e) => handleConnectorClick(e, 'left')}
          />
          <div
            className={`gantt__bar-connector gantt__bar-connector--right ${isLinking && !isLinkSource ? 'gantt__bar-connector--active' : ''}`}
            onClick={(e) => handleConnectorClick(e, 'right')}
          />
        </>
      )}
    </div>
  );
};

export default GanttBar;
