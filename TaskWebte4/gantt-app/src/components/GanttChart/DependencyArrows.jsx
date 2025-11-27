import { useMemo, useRef, useState, useLayoutEffect } from "react";
import { calculateTaskPosition } from "../../js/utils/dateUtils";

const DependencyArrows = ({ tasks, dateRange, onRemoveDependency }) => {
  const svgRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(1000);

  useLayoutEffect(() => {
    const updateWidth = () => {
      if (svgRef.current && svgRef.current.parentElement) {
        const width =
          svgRef.current.parentElement.getBoundingClientRect().width;
        setContainerWidth(width);
      }
    };

    updateWidth();

    const resizeObserver = new ResizeObserver(() => {
      updateWidth();
    });

    if (svgRef.current && svgRef.current.parentElement) {
      resizeObserver.observe(svgRef.current.parentElement);
    }

    window.addEventListener("resize", updateWidth);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  const arrows = useMemo(() => {
    const arrowList = [];
    const taskMap = new Map(tasks.map((t, index) => [t.id, { ...t, index }]));

    tasks.forEach((task, targetIndex) => {
      if (task.dependencies && task.dependencies.length > 0) {
        task.dependencies.forEach((sourceId) => {
          const sourceTask = taskMap.get(sourceId);
          if (sourceTask) {
            const sourcePos = calculateTaskPosition(sourceTask, dateRange);
            const targetPos = calculateTaskPosition(task, dateRange);

            arrowList.push({
              id: `${sourceId}-${task.id}`,
              sourceId,
              targetId: task.id,
              sourceLeftPercent: sourcePos.left + sourcePos.width,
              targetLeftPercent: targetPos.left,
              sourceIndex: sourceTask.index,
              targetIndex,
            });
          }
        });
      }
    });

    return arrowList;
  }, [tasks, dateRange]);

  if (arrows.length === 0) return null;

  const rowHeight = 40;
  const totalHeight = tasks.length * rowHeight;

  return (
    <svg
      ref={svgRef}
      className="gantt__arrows"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: `${totalHeight}px`,
        pointerEvents: "none",
        overflow: "visible",
        zIndex: 4,
      }}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="8"
          markerHeight="6"
          refX="7"
          refY="3"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <polygon points="0 0, 8 3, 0 6" fill="#6366f1" />
        </marker>
      </defs>

      {arrows.map((arrow) => {
        const sx = (arrow.sourceLeftPercent / 100) * containerWidth;
        const tx = (arrow.targetLeftPercent / 100) * containerWidth;
        const sy = arrow.sourceIndex * rowHeight + rowHeight / 2;
        const ty = arrow.targetIndex * rowHeight + rowHeight / 2;

        const dx = tx - sx;

        let pathD;

        if (dx > 30) {
          const midX = sx + dx / 2;
          pathD = `M ${sx} ${sy} C ${midX} ${sy}, ${midX} ${ty}, ${tx} ${ty}`;
        } else {
          const horizontalOffset = 18;
          const stopY = ty - rowHeight / 2;
          pathD = `M ${sx} ${sy} L ${sx + horizontalOffset} ${sy} L ${sx + horizontalOffset} ${stopY} L ${tx - horizontalOffset} ${stopY}
              L ${tx - horizontalOffset} ${ty} L ${tx} ${ty}`;
        }

        return (
          <g key={arrow.id}>
            <path
              d={pathD}
              fill="none"
              stroke="#6366f1"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
              style={{ pointerEvents: "stroke", cursor: "pointer" }}
              onClick={(e) => {
                e.stopPropagation();
                if (onRemoveDependency) {
                  onRemoveDependency(arrow.targetId, arrow.sourceId);
                }
              }}
            />
            <path
              d={pathD}
              fill="none"
              stroke="transparent"
              strokeWidth="12"
              style={{ pointerEvents: "stroke", cursor: "pointer" }}
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
