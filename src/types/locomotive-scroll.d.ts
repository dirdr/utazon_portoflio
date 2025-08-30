declare module 'locomotive-scroll' {
  export interface LocomotiveScrollOptions {
    el?: Element;
    smooth?: boolean;
    multiplier?: number;
    class?: string;
    smoothMobile?: boolean;
    getDirection?: boolean;
    getSpeed?: boolean;
    lerp?: number;
    reloadOnContextChange?: boolean;
    touchMultiplier?: number;
    [key: string]: unknown;
  }

  export default class LocomotiveScroll {
    constructor(options: LocomotiveScrollOptions);
    
    destroy(): void;
    update(): void;
    scrollTo(target: string | number | Element, options?: object): void;
    start(): void;
    stop(): void;
    
    [key: string]: unknown;
  }
}