export type TourState = {
  active: number; incoming: number | null; requested: number;
  direction: number; requestedDirection: number; count: number;
  phase: 'idle' | 'loading' | 'animating'; failed: readonly number[];
};
export type TourAction = { type: 'navigate'; direction: number } | { type: 'ready'; index: number; failed?: boolean } | { type: 'finish'; index: number };
export function createTourState(count: number): TourState {
  if (count < 1) throw new Error('A tour needs at least one genuine scene.');
  return { active: 0, incoming: null, requested: 0, direction: 1, requestedDirection: 1, count, phase: 'idle', failed: [] };
}
export function tourReducer(state: TourState, action: TourAction): TourState {
  if (action.type === 'navigate') {
    const direction = action.direction < 0 ? -1 : 1;
    const requested = (state.requested + direction + state.count) % state.count;
    // During motion, keep only the latest destination. Before loading finishes,
    // replace the pending scene so rapid clicks do not build a long queue.
    if (state.phase === 'animating') return { ...state, requested, requestedDirection: direction };
    return { ...state, requested, requestedDirection: direction, incoming: requested === state.active ? null : requested,
      direction, phase: requested === state.active ? 'idle' : 'loading' };
  }
  if (action.type === 'ready') {
    if (action.index !== state.incoming && action.index !== state.active) return state;
    const failed = action.failed ? [...new Set([...state.failed, action.index])] : state.failed.filter(index => index !== action.index);
    if (state.phase === 'loading' && action.index === state.incoming) return { ...state, phase: 'animating', failed };
    return action.failed || state.failed.includes(action.index) ? { ...state, failed } : state;
  }
  if (state.phase !== 'animating' || action.index !== state.incoming) return state;
  return { ...state, active: action.index,
    incoming: state.requested === action.index ? null : state.requested,
    direction: state.requestedDirection, phase: state.requested === action.index ? 'idle' : 'loading' };
}
