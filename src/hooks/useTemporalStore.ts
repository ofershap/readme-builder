import { useSyncExternalStore } from 'react';
import { useStore } from '../store';

export function useTemporalStore() {
  const store = useStore.temporal;

  const pastStates = useSyncExternalStore(
    (cb) => store.subscribe(cb),
    () => store.getState().pastStates
  );
  const futureStates = useSyncExternalStore(
    (cb) => store.subscribe(cb),
    () => store.getState().futureStates
  );

  return {
    undo: store.getState().undo,
    redo: store.getState().redo,
    pastStates,
    futureStates,
  };
}
