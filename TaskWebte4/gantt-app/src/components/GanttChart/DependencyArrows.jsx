import { useMemo } from 'react';
import { calculateTaskPosition } from '../../utils/dateUtils';

const DependencyArrows = ({ tasks, dateRange, onRemoveDependency }) => {
  // Calculate arrow paths between dependent tasks
  const arrows = useMemo(() => {
    const arrowList = [];
    const taskMap = new Map(tasks.map((t, index) => [t.id, { ...t, index }]));

    tasks.forEach((task, targetIndex) => {
      if (task.dependencies && task.dependencies.length > 0) {
        task.dependencies.forEach(sourceId => {
          const sourceTask = taskMap.get(sourceId);
          if (sourceTask) {
            const sourcePos = calculateTaskPosition(sourceTask, dateRange);
            const targetPos = calculateTaskPosition(task, dateRange);

            // Source: end of the source task bar
            const sourceX = sourcePos.left + sourcePos.width;
            const sourceY = sourceTask.index * 40 + 20; // Middle of row (40px height)

            // Target: start of the target task bar
            const targetX = targetPos.left;
            const targetY = targetIndex * 40 + 20;

            arrowList.push({
              id: `${sourceId}-${task.id}`,
              sourceId,
              targetId: task.id,
              sourceX,
              sourceY,
              targetX,
              targetY
            });
          }
        });
      }
    });

    return arrowList;
  }, [tasks, dateRange]);

  if (arrows.length === 0) return null;

  return (
    <svg
      className="gantt__arrows"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'visible',
        zIndex: 4
      }}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill="#6366f1"
          />
        </marker>
      </defs>

      {arrows.map(arrow => {
        // Calculate path with curves
        const dx = arrow.targetX - arrow.sourceX;
        const dy = arrow.targetY - arrow.sourceY;

        let path;
        if (dx > 20) {
          // Target is to the right - simple curved line
          const midX = arrow.sourceX + dx / 2;
          path = `M ${arrow.sourceX}% ${arrow.sourceY}
                  C ${midX}% ${arrow.sourceY}, ${midX}% ${arrow.targetY}, ${arrow.targetX}% ${arrow.targetY}`;
        } else {
          // Target is to the left or overlapping - go around
          const offset = 15;
          const goDown = arrow.targetY > arrow.sourceY;
          const verticalOffset = goDown ? 25 : -25;

          path = `M ${arrow.sourceX}% ${arrow.sourceY}
                  L ${arrow.sourceX + 2}% ${arrow.sourceY}
                  L ${arrow.sourceX + 2}% ${arrow.sourceY + verticalOffset}
                  L ${arrow.targetX - 2}% ${arrow.sourceY + verticalOffset}
                  L ${arrow.targetX - 2}% ${arrow.targetY}
                  L ${arrow.targetX}% ${arrow.targetY}`;
        }

        return (
          <g key={arrow.id}>
            <path
              d={path}
              fill="none"
              stroke="#6366f1"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
              style={{ pointerEvents: 'stroke', cursor: 'pointer' }}
              onClick={(e) => {
                e.stopPropagation();
                if (onRemoveDependency) {
                  onRemoveDependency(arrow.targetId, arrow.sourceId);
                }
              }}
            />
            {/* Invisible wider path for easier clicking */}
            <path
              d={path}
              fill="none"
              stroke="transparent"
              strokeWidth="10"
              style={{ pointerEvents: 'stroke', cursor: 'pointer' }}
              onClick={(e) => {
                e.stopPropagation();
                if (onRemoveDependency) {
                  onRemoveDependency(arrow.targetId, arrow.sourceId);
                }
              }}
            />
          </g>
        );
      })}
    </svg>
  );
};

export default DependencyArrows;
