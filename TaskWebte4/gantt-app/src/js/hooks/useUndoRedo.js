import { useState, useCallback, useRef } from 'react';

const MAX_HISTORY = 50;

export const useUndoRedo = (initialState) => {
  const [state, setState] = useState(initialState);
  const historyRef = useRef([initialState]);
  const indexRef = useRef(0);

  const setStateWithHistory = useCallback((newState) => {
    const newStateValue = typeof newState === 'function' ? newState(state) : newState;

    // Remove any future states if we're not at the end
    historyRef.current = historyRef.current.slice(0, indexRef.current + 1);

    // Add new state
    historyRef.current.push(newStateValue);

    // Limit history size
    if (historyRef.current.length > MAX_HISTORY) {
      historyRef.current.shift();
    } else {
      indexRef.current++;
    }

    setState(newStateValue);
  }, [state]);

  const undo = useCallback(() => {
    if (indexRef.current > 0) {
      indexRef.current--;
      setState(historyRef.current[indexRef.current]);
    }
  }, []);

  const redo = useCallback(() => {
    if (indexRef.current < historyRef.current.length - 1) {
      indexRef.current++;
      setState(historyRef.current[indexRef.current]);
    }
  }, []);

  const canUndo = indexRef.current > 0;
  const canRedo = indexRef.current < historyRef.current.length - 1;

  return {
    state,
    setState: setStateWithHistory,
    undo,
    redo,
    canUndo,
    canRedo
  };
};

export default useUndoRedo;
