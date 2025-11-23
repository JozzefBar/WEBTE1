import { useState, useCallback, useRef, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { formatDate, addDays } from '../utils/dateUtils';

const DEFAULT_COLOR = '#3b82f6';
const MAX_HISTORY = 50;

export const useTasks = () => {
  const [tasks, setTasks] = useLocalStorage('gantt-tasks', []);
  const [editingTaskId, setEditingTaskId] = useState(null);

  // Undo/Redo state
  const historyRef = useRef([]);
  const indexRef = useRef(-1);
  const isUndoRedoRef = useRef(false);

  // Initialize history on first load
  useEffect(() => {
    if (historyRef.current.length === 0 && tasks.length >= 0) {
      historyRef.current = [JSON.stringify(tasks)];
      indexRef.current = 0;
    }
  }, []);

  // Track changes for undo/redo
  const saveToHistory = useCallback((newTasks) => {
    if (isUndoRedoRef.current) {
      isUndoRedoRef.current = false;
      return;
    }

    const serialized = JSON.stringify(newTasks);

    // Remove future states
    historyRef.current = historyRef.current.slice(0, indexRef.current + 1);

    // Add new state
    historyRef.current.push(serialized);

    // Limit history
    if (historyRef.current.length > MAX_HISTORY) {
      historyRef.current.shift();
    } else {
      indexRef.current++;
    }
  }, []);

  // Undo
  const undo = useCallback(() => {
    if (indexRef.current > 0) {
      indexRef.current--;
      isUndoRedoRef.current = true;
      const prevState = JSON.parse(historyRef.current[indexRef.current]);
      setTasks(prevState);
    }
  }, [setTasks]);

  // Redo
  const redo = useCallback(() => {
    if (indexRef.current < historyRef.current.length - 1) {
      indexRef.current++;
      isUndoRedoRef.current = true;
      const nextState = JSON.parse(historyRef.current[indexRef.current]);
      setTasks(nextState);
    }
  }, [setTasks]);

  const canUndo = () => indexRef.current > 0;
  const canRedo = () => indexRef.current < historyRef.current.length - 1;

  // Add new task
  const addTask = useCallback((parentId = null) => {
    const today = formatDate(new Date());
    const endDate = addDays(today, 7);

    const newTask = {
      id: Date.now(),
      name: 'Nová úloha',
      startDate: today,
      endDate: endDate,
      color: DEFAULT_COLOR,
      parentId: parentId,
      expanded: true,
      progress: 0,
      tags: []
    };

    if (parentId) {
      // Add as child - insert after parent and its children
      const insertIndex = findLastChildIndex(tasks, parentId) + 1;
      const newTasks = [...tasks];
      newTasks.splice(insertIndex, 0, newTask);
      saveToHistory(newTasks);
      setTasks(newTasks);
    } else {
      const newTasks = [...tasks, newTask];
      saveToHistory(newTasks);
      setTasks(newTasks);
    }

    setEditingTaskId(newTask.id);
    return newTask.id;
  }, [tasks, setTasks, saveToHistory]);

  // Find index of last child of a parent
  const findLastChildIndex = (taskList, parentId) => {
    let lastIndex = taskList.findIndex(t => t.id === parentId);
    for (let i = lastIndex + 1; i < taskList.length; i++) {
      if (taskList[i].parentId === parentId) {
        lastIndex = i;
        // Check for nested children
        const nestedLastIndex = findLastChildIndex(taskList, taskList[i].id);
        if (nestedLastIndex > lastIndex) {
          lastIndex = nestedLastIndex;
        }
      }
    }
    return lastIndex;
  };

  // Update task
  const updateTask = useCallback((taskId, updates) => {
    const newTasks = tasks.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
    );
    saveToHistory(newTasks);
    setTasks(newTasks);
  }, [tasks, setTasks, saveToHistory]);

  // Delete task and its children
  const deleteTask = useCallback((taskId) => {
    const getChildIds = (id) => {
      const childIds = tasks.filter(t => t.parentId === id).map(t => t.id);
      return childIds.reduce((acc, childId) => [...acc, childId, ...getChildIds(childId)], []);
    };

    const idsToDelete = [taskId, ...getChildIds(taskId)];
    const newTasks = tasks.filter(task => !idsToDelete.includes(task.id));
    saveToHistory(newTasks);
    setTasks(newTasks);
  }, [tasks, setTasks, saveToHistory]);

  // Move task (drag & drop reorder)
  const moveTask = useCallback((draggedId, targetId) => {
    if (draggedId === targetId) return;

    const draggedIndex = tasks.findIndex(t => t.id === draggedId);
    const targetIndex = tasks.findIndex(t => t.id === targetId);

    const newTasks = [...tasks];
    const [draggedTask] = newTasks.splice(draggedIndex, 1);
    newTasks.splice(targetIndex, 0, draggedTask);

    saveToHistory(newTasks);
    setTasks(newTasks);
  }, [tasks, setTasks, saveToHistory]);

  // Toggle task expand/collapse
  const toggleExpand = useCallback((taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, expanded: !task.expanded } : task
    ));
  }, [tasks, setTasks]);

  // Get visible tasks (respecting expanded/collapsed state)
  const getVisibleTasks = useCallback(() => {
    const hiddenParentIds = new Set();

    tasks.forEach(task => {
      if (task.expanded === false) {
        hiddenParentIds.add(task.id);
      }
    });

    return tasks.filter(task => {
      if (!task.parentId) return true;

      // Check if any ancestor is collapsed
      let currentParentId = task.parentId;
      while (currentParentId) {
        if (hiddenParentIds.has(currentParentId)) {
          return false;
        }
        const parent = tasks.find(t => t.id === currentParentId);
        currentParentId = parent?.parentId;
      }
      return true;
    });
  }, [tasks]);

  // Get task depth (for indentation)
  const getTaskDepth = useCallback((taskId) => {
    let depth = 0;
    let task = tasks.find(t => t.id === taskId);

    while (task?.parentId) {
      depth++;
      task = tasks.find(t => t.id === task.parentId);
    }

    return depth;
  }, [tasks]);

  // Check if task has children
  const hasChildren = useCallback((taskId) => {
    return tasks.some(t => t.parentId === taskId);
  }, [tasks]);

  // Get all unique tags from tasks
  const getAllTags = useCallback(() => {
    const allTags = new Set();
    tasks.forEach(task => {
      if (task.tags && Array.isArray(task.tags)) {
        task.tags.forEach(tag => allTags.add(tag));
      }
    });
    return Array.from(allTags).sort();
  }, [tasks]);

  // Start editing
  const startEditing = useCallback((taskId) => {
    setEditingTaskId(taskId);
  }, []);

  // Stop editing
  const stopEditing = useCallback(() => {
    setEditingTaskId(null);
  }, []);

  // Add dependency (sourceId -> targetId means source must finish before target starts)
  const addDependency = useCallback((targetId, sourceId) => {
    if (targetId === sourceId) return;

    const newTasks = tasks.map(task => {
      if (task.id === targetId) {
        const currentDeps = task.dependencies || [];
        if (!currentDeps.includes(sourceId)) {
          return { ...task, dependencies: [...currentDeps, sourceId] };
        }
      }
      return task;
    });

    saveToHistory(newTasks);
    setTasks(newTasks);
  }, [tasks, setTasks, saveToHistory]);

  // Remove dependency
  const removeDependency = useCallback((targetId, sourceId) => {
    const newTasks = tasks.map(task => {
      if (task.id === targetId && task.dependencies) {
        return {
          ...task,
          dependencies: task.dependencies.filter(id => id !== sourceId)
        };
      }
      return task;
    });

    saveToHistory(newTasks);
    setTasks(newTasks);
  }, [tasks, setTasks, saveToHistory]);

  // Get tasks that can be dependencies for a given task (exclude self and circular)
  const getAvailableDependencies = useCallback((taskId) => {
    return tasks.filter(t => t.id !== taskId);
  }, [tasks]);

  return {
    tasks,
    editingTaskId,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    toggleExpand,
    getVisibleTasks,
    getTaskDepth,
    hasChildren,
    getAllTags,
    startEditing,
    stopEditing,
    addDependency,
    removeDependency,
    getAvailableDependencies,
    undo,
    redo,
    canUndo,
    canRedo
  };
};

export default useTasks;
