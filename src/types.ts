// ============ EASING TYPES ============

export type EasingFunction = (
  t: number,  // current time
  b: number,  // start value
  c: number,  // change in value (end - start)
  d: number,  // duration
  s?: number  // overshoot (for Back easings)
) => number;

export type EasingName =
  | 'easeNone'
  | 'easeInQuad' | 'easeOutQuad' | 'easeInOutQuad'
  | 'easeInCubic' | 'easeOutCubic' | 'easeInOutCubic'
  | 'easeInQuart' | 'easeOutQuart' | 'easeInOutQuart'
  | 'easeInQuint' | 'easeOutQuint' | 'easeInOutQuint'
  | 'easeInSine' | 'easeOutSine' | 'easeInOutSine'
  | 'easeInExpo' | 'easeOutExpo' | 'easeInOutExpo'
  | 'easeInCirc' | 'easeOutCirc' | 'easeInOutCirc'
  | 'easeInElastic' | 'easeOutElastic' | 'easeInOutElastic'
  | 'easeInBack' | 'easeOutBack' | 'easeInOutBack'
  | 'easeInBounce' | 'easeOutBounce' | 'easeInOutBounce';

export type EasingMap = Record<EasingName, EasingFunction>;

// ============ ASSET TYPES ============

export type AssetCache = Record<string, HTMLImageElement | HTMLVideoElement>;

// ============ TRANSITION TYPES ============

export type TransitionStepFn = (
  cx: CanvasRenderingContext2D,
  assetCache: AssetCache,
  vals: number[]
) => Promise<void>;

export interface TransitionConfig {
  duration: number;
  start: number[];
  finish: number[];
  ease: EasingName;
  step: TransitionStepFn;
}

export interface ITransition {
  progress: number;
  duration: number;
  start: number[];
  finish: number[];
  ease: EasingFunction;
  step: TransitionStepFn;
  dead: boolean;
  cb?: () => void;
  tick(cx: CanvasRenderingContext2D, assetCache: AssetCache): Promise<void>;
}

// ============ CLIP TYPES ============

export type Dimensions = [width: number, height: number];

export type Colours = Record<string, string>;

export type Assets = Record<string, string>;

export interface Clip {
  name: string;
  colours: Colours;
  assets: Assets;
  dimensions: Dimensions;
  transitions: ITransition[][];
}

// ============ DRAWING HELPERS ============

export type Point = [x: number, y: number];

export type RGB = [r: number, g: number, b: number];
