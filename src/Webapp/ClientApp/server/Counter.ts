// This file is generated from template "Redux.tst" using typewriter
// it generates interface declarations for Actions and State that are implemented server-side

export const INCREMENT_COUNTER = 'IncrementCounterAction';
export const DECREMENT_COUNTER = 'DecrementCounterAction';
export const START_COUNTER = 'StartCounterAction';
export const COUNTER_STARTED = 'CounterStartedAction';
export const STOP_COUNTER = 'StopCounterAction';
export const COUNTER_STOPPED = 'CounterStoppedAction';
export const SYNC_COUNTER_STATE = 'SyncCounterStateAction';


export interface IncrementCounterAction { 
	type: 'IncrementCounterAction'; 
}

export interface DecrementCounterAction { 
	type: 'DecrementCounterAction'; 
}

export interface StartCounterAction { 
	type: 'StartCounterAction'; 
}

export interface CounterStartedAction { 
	type: 'CounterStartedAction'; 
}

export interface StopCounterAction { 
	type: 'StopCounterAction'; 
}

export interface CounterStoppedAction { 
	type: 'CounterStoppedAction'; 
}

export interface SyncCounterStateAction { 
	type: 'SyncCounterStateAction'; 
	payload: {
		counterState: CounterState;
	}
}


export interface CounterState {
	count: number;
	started: boolean;
}



