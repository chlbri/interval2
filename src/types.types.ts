export type IntervalParams = {
  id: string;
  callback: () => void;
  interval?: number;
  exact?: boolean;
};

export type TimeoutParams = {
  id: string;
  callback: () => void;
  timeout?: number;
};

export type TimerState = 'idle' | 'active' | 'paused' | 'disposed';
