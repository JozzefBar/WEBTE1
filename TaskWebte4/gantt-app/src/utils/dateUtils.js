// Date utility functions for Gantt chart

export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

export const calculateDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
};

export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return formatDate(result);
};

export const calculateTaskPosition = (task, dateRange) => {
  const rangeStart = new Date(dateRange.start);
  const rangeEnd = new Date(dateRange.end);
  const taskStart = new Date(task.startDate);
  const taskEnd = new Date(task.endDate);

  const totalDays = (rangeEnd - rangeStart) / (1000 * 60 * 60 * 24);
  const startOffsetDays = (taskStart - rangeStart) / (1000 * 60 * 60 * 24);
  const taskDurationDays = (taskEnd - taskStart) / (1000 * 60 * 60 * 24) + 1;

  const leftPercent = (startOffsetDays / totalDays) * 100;
  const widthPercent = (taskDurationDays / totalDays) * 100;

  return {
    left: Math.max(0, leftPercent),
    width: Math.min(100 - Math.max(0, leftPercent), Math.max(0, widthPercent))
  };
};

export const generateMonths = (dateRange) => {
  const months = [];
  const start = new Date(dateRange.start);
  const end = new Date(dateRange.end);
  const rangeStart = new Date(dateRange.start);
  const rangeEnd = new Date(dateRange.end);
  const totalDays = (rangeEnd - rangeStart) / (1000 * 60 * 60 * 24);

  const current = new Date(start.getFullYear(), start.getMonth(), 1);

  while (current <= end) {
    const monthStart = new Date(current);
    const monthEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0);

    const startOffset = Math.max(0, (monthStart - rangeStart) / (1000 * 60 * 60 * 24));
    const endOffset = Math.min(totalDays, (monthEnd - rangeStart) / (1000 * 60 * 60 * 24));

    const left = (startOffset / totalDays) * 100;
    const width = ((endOffset - startOffset + 1) / totalDays) * 100;

    months.push({
      name: current.toLocaleDateString('sk-SK', { month: 'long' }),
      year: current.getFullYear(),
      left,
      width
    });

    current.setMonth(current.getMonth() + 1);
  }

  return months;
};

// Generate timeline units based on zoom level
export const generateTimelineUnits = (dateRange, zoomLevel) => {
  const units = [];
  const rangeStart = new Date(dateRange.start);
  const rangeEnd = new Date(dateRange.end);
  const totalDays = (rangeEnd - rangeStart) / (1000 * 60 * 60 * 24);

  const current = new Date(rangeStart);

  if (zoomLevel === 'day') {
    while (current <= rangeEnd) {
      const dayStart = new Date(current);
      const startOffset = (dayStart - rangeStart) / (1000 * 60 * 60 * 24);
      const left = (startOffset / totalDays) * 100;
      const width = (1 / totalDays) * 100;

      units.push({
        label: current.getDate().toString(),
        sublabel: current.toLocaleDateString('sk-SK', { weekday: 'short' }),
        left,
        width
      });

      current.setDate(current.getDate() + 1);
    }
  } else if (zoomLevel === 'week') {
    // Start from Monday of the first week
    const firstMonday = new Date(current);
    firstMonday.setDate(firstMonday.getDate() - ((firstMonday.getDay() + 6) % 7));
    current.setTime(firstMonday.getTime());

    let weekNum = 1;
    while (current <= rangeEnd) {
      const weekStart = new Date(current);
      const startOffset = Math.max(0, (weekStart - rangeStart) / (1000 * 60 * 60 * 24));
      const left = (startOffset / totalDays) * 100;
      const width = (7 / totalDays) * 100;

      units.push({
        label: `T${weekNum}`,
        sublabel: `${current.getDate()}.${current.getMonth() + 1}`,
        left,
        width
      });

      current.setDate(current.getDate() + 7);
      weekNum++;
    }
  } else if (zoomLevel === 'month') {
    const startMonth = new Date(rangeStart.getFullYear(), rangeStart.getMonth(), 1);
    current.setTime(startMonth.getTime());

    while (current <= rangeEnd) {
      const monthEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0);
      const startOffset = Math.max(0, (current - rangeStart) / (1000 * 60 * 60 * 24));
      const endOffset = Math.min(totalDays, (monthEnd - rangeStart) / (1000 * 60 * 60 * 24));
      const left = (startOffset / totalDays) * 100;
      const width = ((endOffset - startOffset + 1) / totalDays) * 100;

      units.push({
        label: current.toLocaleDateString('sk-SK', { month: 'short' }),
        sublabel: current.getFullYear().toString(),
        left,
        width
      });

      current.setMonth(current.getMonth() + 1);
    }
  } else if (zoomLevel === 'quarter') {
    const startQuarter = Math.floor(rangeStart.getMonth() / 3);
    current.setTime(new Date(rangeStart.getFullYear(), startQuarter * 3, 1).getTime());

    while (current <= rangeEnd) {
      const quarterEnd = new Date(current.getFullYear(), current.getMonth() + 3, 0);
      const startOffset = Math.max(0, (current - rangeStart) / (1000 * 60 * 60 * 24));
      const endOffset = Math.min(totalDays, (quarterEnd - rangeStart) / (1000 * 60 * 60 * 24));
      const left = (startOffset / totalDays) * 100;
      const width = ((endOffset - startOffset + 1) / totalDays) * 100;

      const quarter = Math.floor(current.getMonth() / 3) + 1;
      units.push({
        label: `Q${quarter}`,
        sublabel: current.getFullYear().toString(),
        left,
        width
      });

      current.setMonth(current.getMonth() + 3);
    }
  }

  return units;
};

export const getCurrentDateFormatted = () => {
  const today = new Date();
  return today.toLocaleDateString('sk-SK', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const getDefaultDateRange = () => {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), 1);
  const end = new Date(today.getFullYear(), today.getMonth() + 3, 0);

  return {
    start: formatDate(start),
    end: formatDate(end)
  };
};

// Calculate new dates when dragging bar on timeline
export const calculateDatesFromPosition = (leftPercent, widthPercent, dateRange) => {
  const rangeStart = new Date(dateRange.start);
  const rangeEnd = new Date(dateRange.end);
  const totalDays = (rangeEnd - rangeStart) / (1000 * 60 * 60 * 24);

  const startOffsetDays = Math.round((leftPercent / 100) * totalDays);
  const durationDays = Math.round((widthPercent / 100) * totalDays);

  const newStart = new Date(rangeStart);
  newStart.setDate(newStart.getDate() + startOffsetDays);

  const newEnd = new Date(newStart);
  newEnd.setDate(newEnd.getDate() + durationDays - 1);

  return {
    startDate: formatDate(newStart),
    endDate: formatDate(newEnd)
  };
};
