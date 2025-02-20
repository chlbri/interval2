export type IntervalParams = {
  id: string;
  callback: () => void;
  interval?: number;
  exact?: boolean;
};

export type TimerState = 'idle' | 'active' | 'paused';
