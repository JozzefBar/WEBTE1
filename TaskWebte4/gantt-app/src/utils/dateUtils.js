// Date utility functions for Gantt chart

export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

export const calculateDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  // Use UTC to avoid timezone issues
  const start = new Date(startDate + 'T00:00:00Z');
  const end = new Date(endDate + 'T00:00:00Z');
  const diffDays = Math.round((end - start) / (1000 * 60 * 60 * 24));
  // If same date (milestone/goal), return 0. Otherwise +1 for inclusive counting
  return diffDays === 0 ? 0 : diffDays + 1;
};

export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return formatDate(result);
};

export const calculateTaskPosition = (task, dateRange) => {
  // Use UTC to avoid timezone issues
  const rangeStart = new Date(dateRange.start + 'T00:00:00Z');
  const rangeEnd = new Date(dateRange.end + 'T00:00:00Z');
  const taskStart = new Date(task.startDate + 'T00:00:00Z');
  const taskEnd = new Date(task.endDate + 'T00:00:00Z');

  const totalDays = Math.round((rangeEnd - rangeStart) / (1000 * 60 * 60 * 24));
  const startOffsetDays = Math.round((taskStart - rangeStart) / (1000 * 60 * 60 * 24));
  const taskDurationDays = Math.round((taskEnd - taskStart) / (1000 * 60 * 60 * 24)) + 1;

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
export const generateTimelineUnits = (dateRange, zoomLevel, translations = {}) => {
  const units = [];
  const rangeStart = new Date(dateRange.start);
  const rangeEnd = new Date(dateRange.end);
  const totalDays = (rangeEnd - rangeStart) / (1000 * 60 * 60 * 24);

  const current = new Date(rangeStart);

  // Default translations
  const dayNames = translations.dayNames || ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'];
  const monthNames = translations.monthNames || ['Jan', 'Feb', 'Mar', 'Apr', 'Máj', 'Jún', 'Júl', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];
  const weekPrefix = translations.weekPrefix || 'T';

  if (zoomLevel === 'day') {
    // Count total days in range
    const numDays = Math.ceil(totalDays) + 1;
    const unitWidth = 100 / numDays;

    let dayIndex = 0;
    while (current <= rangeEnd) {
      // Each day gets equal width
      const left = dayIndex * unitWidth;
      const width = unitWidth;

      // Get day of week (0 = Sunday, 1 = Monday, ...)
      const dayOfWeek = current.getDay();
      // Convert to Monday-first index (0 = Monday, 6 = Sunday)
      const dayNameIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

      units.push({
        label: current.getDate().toString(),
        sublabel: dayNames[dayNameIndex],
        left,
        width
      });

      current.setDate(current.getDate() + 1);
      dayIndex++;
    }
  } else if (zoomLevel === 'week') {
    // First, count how many weeks we'll show
    const tempCurrent = new Date(rangeStart);
    const firstMonday = new Date(tempCurrent);
    firstMonday.setDate(firstMonday.getDate() - ((firstMonday.getDay() + 6) % 7));
    tempCurrent.setTime(firstMonday.getTime());

    let numWeeks = 0;
    while (tempCurrent <= rangeEnd) {
      numWeeks++;
      tempCurrent.setDate(tempCurrent.getDate() + 7);
    }

    // Each week gets equal width
    const unitWidth = 100 / numWeeks;

    // Now generate weeks
    const firstMondayActual = new Date(current);
    firstMondayActual.setDate(firstMondayActual.getDate() - ((firstMondayActual.getDay() + 6) % 7));
    current.setTime(firstMondayActual.getTime());

    let weekNum = 1;
    let weekIndex = 0;
    while (current <= rangeEnd) {
      const left = weekIndex * unitWidth;
      const width = unitWidth;

      units.push({
        label: `${weekPrefix}${weekNum}`,
        sublabel: `${current.getDate()}.${current.getMonth() + 1}`,
        left,
        width
      });

      current.setDate(current.getDate() + 7);
      weekNum++;
      weekIndex++;
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
        label: monthNames[current.getMonth()],
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

export const getCurrentDateFormatted = (language = 'sk') => {
  const today = new Date();
  const locale = language === 'en' ? 'en-US' : 'sk-SK';
  return today.toLocaleDateString(locale, {
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
