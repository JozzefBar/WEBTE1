import { useState, useRef, useEffect } from 'react';
import { calculateDatesFromPosition, calculateDuration } from '../../js/utils/dateUtils';
import { useCategories } from '../../js/hooks/useCategories';

const GanttBar = ({
  task,
  position,
  dateRange,
  onUpdate,
  isParent,
  isLinking,
  linkingFromTask,
  onStartLink,
  onCompleteLink,
  isEditingRow,
  onRowDragStart,
  translations
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

  const category = getCategoryById(task.category || 'task');
  const categoryColor = category?.color || '#3b82f6';

  useEffect(() => {
    if (!isDragging && !isResizing) {
      setCurrentLeft(position.left);
      setCurrentWidth(position.width);
    }
  }, [position.left, position.width, isDragging, isResizing]);

  useEffect(() => {
    if (!isDraggingProgress) {
      setCurrentProgress(task.progress || 0);
    }
  }, [task.progress, isDraggingProgress]);

  const getContainerWidth = () => {
    return barRef.current?.parentElement?.getBoundingClientRect().width || 1;
  };

  const getBarWidth = () => {
    return barRef.current?.getBoundingClientRect().width || 1;
  };

  const handleBarDragStart = (e) => {
    if (e.target.classList.contains('gantt__bar-resize') ||
        e.target.classList.contains('gantt__bar-connector') ||
        e.target.classList.contains('gantt__bar-progress-handle') ||
        e.target.closest('.gantt__bar-progress-value') ||
        isDragging || isResizing) {
      e.preventDefault();
      return;
    }

    if (mouseDownPos.current && mouseDownPos.current.isHorizontal) {
      e.preventDefault();
      return;
    }

    if (onRowDragStart) {
      onRowDragStart(e);
    }
  };

  const handleMouseDown = (e) => {
    if (e.target.classList.contains('gantt__bar-resize') ||
        e.target.classList.contains('gantt__bar-connector') ||
        e.target.classList.contains('gantt__bar-progress-handle')) return;

    const startX = e.clientX;
    const startY = e.clientY;
    mouseDownPos.current = { x: startX, y: startY, isHorizontal: false };

    const handleFirstMove = (moveEvent) => {
      const deltaX = Math.abs(moveEvent.clientX - startX);
      const deltaY = Math.abs(moveEvent.clientY - startY);

      if (deltaX < 3 && deltaY < 3) return;

      if (deltaX > deltaY) {
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

      document.removeEventListener('mousemove', handleFirstMove);
    };

    document.addEventListener('mousemove', handleFirstMove);

    const cleanup = () => {
      document.removeEventListener('mousemove', handleFirstMove);
      document.removeEventListener('mouseup', cleanup);
    };
    document.addEventListener('mouseup', cleanup);
  };

  const handleTouchStart = (e) => {
    if (e.target.classList.contains('gantt__bar-resize') ||
        e.target.classList.contains('gantt__bar-connector') ||
        e.target.classList.contains('gantt__bar-progress-handle')) return;

    e.preventDefault();
    e.stopPropagation();

    if (e.touches[0]) {
      const startX = e.touches[0].clientX;
      const startY = e.touches[0].clientY;

      const handleFirstMove = (moveEvent) => {
        if (!moveEvent.touches[0]) return;

        const deltaX = Math.abs(moveEvent.touches[0].clientX - startX);
        const deltaY = Math.abs(moveEvent.touches[0].clientY - startY);

        if (deltaX < 3 && deltaY < 3) return;

        if (deltaX > deltaY) {
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

        document.removeEventListener('touchmove', handleFirstMove);
      };

      document.addEventListener('touchmove', handleFirstMove, { passive: false });

      const cleanup = () => {
        document.removeEventListener('touchmove', handleFirstMove);
        document.removeEventListener('touchend', cleanup);
        document.removeEventListener('touchcancel', cleanup);
      };
      document.addEventListener('touchend', cleanup);
      document.addEventListener('touchcancel', cleanup);
    }
  };

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

  const handleResizeTouchStart = (e, side) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.touches[0]) {
      setIsResizing(side);
      setDragStart({
        x: e.touches[0].clientX,
        initialLeft: currentLeft,
        initialWidth: currentWidth,
        containerWidth: getContainerWidth()
      });
    }
  };

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

  const handleProgressTouchStart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.touches[0]) {
      setIsDraggingProgress(true);
      setDragStart({
        x: e.touches[0].clientX,
        barWidth: getBarWidth(),
        initialProgress: currentProgress
      });
    }
  };

  const handleConnectorClick = (e, side) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLinking && !isLinkSource) {
      onCompleteLink(task.id, side);
    } else if (!isLinking) {
      onStartLink(task.id, side);
    }
  };

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

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setEditedName(newName);
    onUpdate(task.id, { name: newName });
  };

  useEffect(() => {
    if (isInlineEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isInlineEditing]);

  useEffect(() => {
    if (!dragStart) return;

    const handleMove = (e) => {
      const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : null);
      if (clientX === null) return;

      if (e.touches) {
        e.preventDefault();
      }

      const deltaX = clientX - dragStart.x;

      if (isDraggingProgress) {
        const deltaPercent = (deltaX / dragStart.barWidth) * 100;
        let newProgress = dragStart.initialProgress + deltaPercent;
        newProgress = Math.max(0, Math.min(100, newProgress));
        setCurrentProgress(Math.round(newProgress));
      } else if (isDragging) {
        const deltaPercent = (deltaX / dragStart.containerWidth) * 100;
        let newLeft = dragStart.initialLeft + deltaPercent;
        newLeft = Math.max(0, Math.min(100 - currentWidth, newLeft));
        setCurrentLeft(newLeft);
      } else if (isResizing === 'left') {
        const deltaPercent = (deltaX / dragStart.containerWidth) * 100;
        let newLeft = dragStart.initialLeft + deltaPercent;
        let newWidth = dragStart.initialWidth - deltaPercent;
        if (newLeft < 0) {
          newWidth += newLeft;
          newLeft = 0;
        }
        if (newWidth < 0.2) newWidth = 0.2;
        if (newLeft + newWidth > 100) newLeft = 100 - newWidth;
        setCurrentLeft(newLeft);
        setCurrentWidth(newWidth);
      } else if (isResizing === 'right') {
        const deltaPercent = (deltaX / dragStart.containerWidth) * 100;
        let newWidth = dragStart.initialWidth + deltaPercent;
        if (newWidth < 0.2) newWidth = 0.2;
        if (currentLeft + newWidth > 100) newWidth = 100 - currentLeft;
        setCurrentWidth(newWidth);
      }
    };

    const handleEnd = (e) => {
      const clientX = e.clientX !== undefined ? e.clientX : (e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientX : null);
      const moved = dragStart && clientX !== null && Math.abs(clientX - dragStart.x) > 2;

      if (isDraggingProgress) {
        onUpdate(task.id, { progress: currentProgress });
      } else if ((isDragging || isResizing) && moved) {
        const newDates = calculateDatesFromPosition(currentLeft, currentWidth, dateRange);
        onUpdate(task.id, newDates);
      }

      setIsDragging(false);
      setIsResizing(null);
      setIsDraggingProgress(false);
      setDragStart(null);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleEnd);
    document.addEventListener('touchcancel', handleEnd);

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
      document.removeEventListener('touchcancel', handleEnd);
    };
  }, [isDragging, isResizing, isDraggingProgress, dragStart, currentLeft, currentWidth, currentProgress, dateRange, task.id, onUpdate]);

  if (isMilestone) {
    const connectorOffsetLeft = -12;
    const connectorOffsetRight = 18;

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
        {(isHovered || isTooltipHovered || isLinking) && (
          <div
            className={`gantt__bar-connector gantt__bar-connector--left ${isLinking && !isLinkSource ? 'gantt__bar-connector--active' : ''}`}
            onClick={(e) => handleConnectorClick(e, 'left')}
            style={{ left: `${connectorOffsetLeft}px`, top: '50%', transform: 'translateY(-50%)' }}
          />
        )}

        <div
          className={`gantt__milestone gantt__milestone--goal ${isDragging ? 'gantt__milestone--dragging' : ''}`}
          style={{ backgroundColor: categoryColor }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onDoubleClick={handleStartInlineEdit}
        />

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
          <span
            className="gantt__milestone-label"
            onDoubleClick={handleStartInlineEdit}
          >
            {task.name || translations?.newTask || 'Nová úloha'}
          </span>
        )}

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

  const barColor = categoryColor;

  const getDarkerColor = (color) => {
    if (color.startsWith('#')) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      const darken = 0.7;
      return `rgb(${Math.floor(r * darken)}, ${Math.floor(g * darken)}, ${Math.floor(b * darken)})`;
    }
    return color;
  };

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
      onTouchStart={handleTouchStart}
      onDoubleClick={handleStartInlineEdit}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="gantt__bar-progress-fill"
        style={{
          width: `${currentProgress}%`,
          backgroundColor: getDarkerColor(barColor)
        }}
      />

      <div
        className={`gantt__bar-resize gantt__bar-resize--left ${isHovered ? 'gantt__bar-resize--visible' : ''}`}
        onMouseDown={(e) => handleResizeStart(e, 'left')}
        onTouchStart={(e) => handleResizeTouchStart(e, 'left')}
      />

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
        <span className="gantt__bar-label">{task.name || translations?.newTask || 'Nová úloha'}</span>
      )}

      <div
        className="gantt__bar-progress-handle"
        style={{ left: `${currentProgress}%` }}
      >
        <span
          className="gantt__bar-progress-value"
          onMouseDown={(e) => {
            e.stopPropagation();
            handleProgressDragStart(e);
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
            handleProgressTouchStart(e);
          }}
          onMouseEnter={() => setIsTooltipHovered(true)}
          onMouseLeave={() => setIsTooltipHovered(false)}
          style={{ cursor: 'ew-resize' }}
        >
          {currentProgress}%
        </span>
      </div>

      <div
        className={`gantt__bar-resize gantt__bar-resize--right ${isHovered ? 'gantt__bar-resize--visible' : ''}`}
        onMouseDown={(e) => handleResizeStart(e, 'right')}
        onTouchStart={(e) => handleResizeTouchStart(e, 'right')}
      />

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
