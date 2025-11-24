import { useState, useRef, useEffect } from 'react';
import { calculateDatesFromPosition, calculateDuration } from '../../utils/dateUtils';

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
  onCompleteLink
}) => {
  const barRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(null); // 'left' or 'right'
  const [isDraggingProgress, setIsDraggingProgress] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [currentLeft, setCurrentLeft] = useState(position.left);
  const [currentWidth, setCurrentWidth] = useState(position.width);
  const [currentProgress, setCurrentProgress] = useState(task.progress || 0);
  const [isHovered, setIsHovered] = useState(false);

  const duration = calculateDuration(task.startDate, task.endDate);
  const isMilestone = duration === 0;
  const isLinkSource = linkingFromTask === task.id;

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

  // Handle drag start (move entire bar)
  const handleMouseDown = (e) => {
    if (e.target.classList.contains('gantt__bar-resize') ||
        e.target.classList.contains('gantt__bar-connector') ||
        e.target.classList.contains('gantt__bar-progress-handle')) return;
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      initialLeft: currentLeft,
      initialWidth: currentWidth,
      containerWidth: getContainerWidth()
    });
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
        if (newWidth < 1) newWidth = 1;
        if (newLeft + newWidth > 100) newLeft = 100 - newWidth;
        setCurrentLeft(newLeft);
        setCurrentWidth(newWidth);
      } else if (isResizing === 'right') {
        // Resize from right edge
        const deltaPercent = (deltaX / dragStart.containerWidth) * 100;
        let newWidth = dragStart.initialWidth + deltaPercent;
        if (newWidth < 1) newWidth = 1;
        if (currentLeft + newWidth > 100) newWidth = 100 - currentLeft;
        setCurrentWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      if (isDraggingProgress) {
        // Update progress
        onUpdate(task.id, { progress: currentProgress });
      } else {
        // Calculate new dates and update
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
    return (
      <div
        ref={barRef}
        className={`gantt__milestone ${isDragging ? 'gantt__milestone--dragging' : ''}`}
        style={{
          left: `${currentLeft}%`,
          backgroundColor: task.color
        }}
        onMouseDown={handleMouseDown}
        onDoubleClick={(e) => {
          e.stopPropagation();
          onDoubleClick(task.id);
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        title={`${task.name}: ${task.startDate}`}
      >
        <span className="gantt__milestone-label">{task.name}</span>
        {/* Connection points for milestone */}
        {(isHovered || isLinking) && (
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
  }

  // Green for root tasks, blue for all subtasks (consistent colors)
  const barColor = isParent ? '#10b981' : '#3b82f6';

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
      onMouseDown={handleMouseDown}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onDoubleClick(task.id);
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={`${task.name}: ${task.startDate} → ${task.endDate} (${currentProgress}%)`}
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

      {/* Task label */}
      <span className="gantt__bar-label">{task.name}</span>

      {/* Progress handle/marker (visual only, not interactive) */}
      <div
        className="gantt__bar-progress-handle"
        style={{ left: `${currentProgress}%` }}
      >
        {/* Progress value - this is draggable */}
        <span
          className="gantt__bar-progress-value"
          onMouseDown={handleProgressDragStart}
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
      {(isHovered || isLinking) && (
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
