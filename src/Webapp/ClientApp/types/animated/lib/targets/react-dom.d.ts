import * as Animated from './../';
export * from './..';

export const createAnimatedComponent: (Component: React.ReactType) => typeof Animated.AnimatedComponent;
export const div: React.ComponentClass<React.HTMLAttributes<HTMLDivElement>>
