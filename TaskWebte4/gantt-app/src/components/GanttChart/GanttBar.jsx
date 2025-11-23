import { useState, useRef, useEffect } from 'react';
import { calculateDatesFromPosition, calculateDuration } from '../../utils/dateUtils';

const GanttBar = ({ task, position, dateRange, onUpdate, onDoubleClick, isParent }) => {
  const barRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(null); // 'left' or 'right'
  const [dragStart, setDragStart] = useState(null);
  const [currentLeft, setCurrentLeft] = useState(position.left);
  const [currentWidth, setCurrentWidth] = useState(position.width);

  const duration = calculateDuration(task.startDate, task.endDate);
  const isMilestone = duration === 0;

  // Update when position changes externally
  useEffect(() => {
    if (!isDragging && !isResizing) {
      setCurrentLeft(position.left);
      setCurrentWidth(position.width);
    }
  }, [position.left, position.width, isDragging, isResizing]);

  // Get container width
  const getContainerWidth = () => {
    return barRef.current?.parentElement?.getBoundingClientRect().width || 1;
  };

  // Handle drag start (move entire bar)
  const handleMouseDown = (e) => {
    if (e.target.classList.contains('gantt__bar-resize')) return;
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

  // Handle mouse move and up
  useEffect(() => {
    if (!dragStart) return;

    const handleMouseMove = (e) => {
      const deltaX = e.clientX - dragStart.x;
      const deltaPercent = (deltaX / dragStart.containerWidth) * 100;

      if (isDragging) {
        // Move entire bar
        let newLeft = dragStart.initialLeft + deltaPercent;
        newLeft = Math.max(0, Math.min(100 - currentWidth, newLeft));
        setCurrentLeft(newLeft);
      } else if (isResizing === 'left') {
        // Resize from left edge
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
        let newWidth = dragStart.initialWidth + deltaPercent;
        if (newWidth < 1) newWidth = 1;
        if (currentLeft + newWidth > 100) newWidth = 100 - currentLeft;
        setCurrentWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      // Calculate new dates and update
      const newDates = calculateDatesFromPosition(currentLeft, currentWidth, dateRange);
      onUpdate(task.id, newDates);

      setIsDragging(false);
      setIsResizing(null);
      setDragStart(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragStart, currentLeft, currentWidth, dateRange, task.id, onUpdate]);

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
        title={`${task.name}: ${task.startDate}`}
      >
        <span className="gantt__milestone-label">{task.name}</span>
      </div>
    );
  }

  // Regular bar
  return (
    <div
      ref={barRef}
      className={`gantt__bar ${isDragging || isResizing ? 'gantt__bar--dragging' : ''} ${isParent ? 'gantt__bar--parent' : ''}`}
      style={{
        left: `${currentLeft}%`,
        width: `${currentWidth}%`,
        backgroundColor: isParent ? '#10b981' : task.color
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onDoubleClick(task.id);
      }}
      title={`${task.name}: ${task.startDate} → ${task.endDate}`}
    >
      {/* Left resize handle */}
      <div
        className="gantt__bar-resize gantt__bar-resize--left"
        onMouseDown={(e) => handleResizeStart(e, 'left')}
      />
      <span className="gantt__bar-label">{task.name}</span>
      {/* Progress indicator */}
      {task.progress > 0 && (
        <div
          className="gantt__bar-progress"
          style={{ width: `${task.progress}%` }}
        />
      )}
      {/* Right resize handle */}
      <div
        className="gantt__bar-resize gantt__bar-resize--right"
        onMouseDown={(e) => handleResizeStart(e, 'right')}
      />
    </div>
  );
};

export default GanttBar;
