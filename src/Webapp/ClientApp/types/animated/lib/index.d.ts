import * as React from 'react';

declare module "animated/lib" {

    export type EndResult = {finished: boolean};
    export type EndCallback = (result: EndResult) => void;
    export type AnimationConfig = {
      isInteraction?: boolean;
    };

    namespace Animation {
        type ValueXYListenerCallback = (value: {x: number; y: number}) => void;

        class Animation {
            start(fromValue: number, onUpdate: (value: number) => void, onEnd: EndCallback, previousAnimation: Animation): void;
            stop(): void;
        }
    }

    namespace AnimatedValueXY {
        type ValueXYListenerCallback = (value: {x: number; y: number}) => void;
        class AnimatedValueXY extends AnimatedWithChildren.AnimatedWithChildren {
            constructor(valueIn?: {x: number | AnimatedValue.AnimatedValue; y: number | AnimatedValue.AnimatedValue});
            setValue(value: {x: number; y: number});
            setOffset(offset: {x: number; y: number});
            flattenOffset(): void;
            stopAnimation(callback?: () => number): void;
            addListener(callback: Animation.ValueXYListenerCallback): string;
            removeListener(id: string): void;
            getLayout(): {[key: string]: AnimatedValue.AnimatedValue};
            getTranslateTransform(): Array<{[key: string]: AnimatedValue.AnimatedValue}>;
        }
    }
    
    type TimingAnimationConfig =  AnimationConfig & {
        toValue: number | AnimatedValue.AnimatedValue | {x: number, y: number} | AnimatedValueXY.AnimatedValueXY;
        easing?: (value: number) => number;
        duration?: number;
        delay?: number;
    };

    type DecayAnimationConfig = AnimationConfig & {
        velocity: number | {x: number, y: number};
        deceleration?: number;
    };
     
    type SpringAnimationConfig = AnimationConfig & {
        toValue: number | AnimatedValue.AnimatedValue | {x: number, y: number} | AnimatedValueXY.AnimatedValueXY;
        overshootClamping?: boolean;
        restDisplacementThreshold?: number;
        restSpeedThreshold?: number;
        velocity?: number | {x: number, y: number};
        bounciness?: number;
        speed?: number;
        tension?: number;
        friction?: number;
    };

    type CompositeAnimation = {
        start: (callback?: EndCallback) => void;
        stop: () => void;
    };
      
    namespace Animated {
        class Animated { }
    }

    namespace AnimatedWithChildren {
        class AnimatedWithChildren extends Animated.Animated { }
    }
    export type ValueListenerCallback = (state: {value: number}) => void;

    export type ExtrapolateType = 'extend' | 'identity' | 'clamp';
    export type InterpolationConfigType = {
        inputRange: Array<number>;
        outputRange: (Array<number> | Array<string>);
        easing?: ((input: number) => number);
        extrapolate?: ExtrapolateType;
        extrapolateLeft?: ExtrapolateType;
        extrapolateRight?: ExtrapolateType;
    };

    namespace AnimatedInterpolation {
        class AnimatedInterpolation extends AnimatedWithChildren.AnimatedWithChildren {
            constructor(parent: Animated.Animated, interpolation: (input: number) => number | string);
            addListener(callback: ValueListenerCallback): string;
            removeListener(id: string);
            interpolate(config: InterpolationConfigType): AnimatedInterpolation;
        }
    }

    namespace AnimatedValue {
            class AnimatedValue extends AnimatedWithChildren.AnimatedWithChildren {
                constructor(value: number);
                setValue(value: number): void;
                setOffset(offset: number): void;
                flattenOffset(): void;
                addListener(callback: ValueListenerCallback): string;
                removeListener(id: string): void;
                stopAnimation(callback?: (value: number) => void): void;
                interpolate(config: InterpolationConfigType): AnimatedInterpolation.AnimatedInterpolation;
            }
        }

    class AnimatedTemplate extends AnimatedWithChildren.AnimatedWithChildren {
        constructor(strings: TemplateStringsArray, values: any[]);
    }

    type Mapping = {[key: string]: Mapping} | AnimatedValue;
    type EventConfig = {listener?: Function};
    export var event: (argMapping: Array<Mapping>, config?: EventConfig) => (...args) => void;

    export const spring: (value: AnimatedValue.AnimatedValue | AnimatedValueXY.AnimatedValueXY, config: SpringAnimationConfig) => CompositeAnimation
    export const Value: typeof AnimatedValue.AnimatedValue;
    export const ValueXY: typeof AnimatedValueXY.AnimatedValueXY;
    export type AnimatedValue = typeof AnimatedValue.AnimatedValue;

    export const template: (strings: TemplateStringsArray, ...values: any[]) => AnimatedTemplate;

    class AnimatedComponent extends React.Component<{style: any, className: string}> { 
        constructor(props: any);
    }
}
