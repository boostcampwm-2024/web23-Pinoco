interface IFirstVisitState {
  lobbyPage?: boolean;
  gamePage?: boolean;
}

const LOCAL_STORAGE_KEY = 'first-visit-state';

export function getFirstVisitState(): IFirstVisitState {
  const state = localStorage.getItem(LOCAL_STORAGE_KEY);
  return state ? JSON.parse(state) : {};
}

export function setFirstVisitState(newState: Partial<IFirstVisitState>): void {
  const currentState = getFirstVisitState();
  const updatedState = { ...currentState, ...newState };
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedState));
}
