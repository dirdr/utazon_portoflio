export const LIGHT_CONFIG = {
  BOUNDS: {
    X: [-1.5, 1.5] as const,
    Y: [-1.5, 1.5] as const,
  },
  SENSITIVITY: 1.2,
  DISTANCE_FROM_CENTER: 1.0,
  BASE_Z: -6,
  KEY_LIGHT: {
    INTENSITY: 1.5,
  },
  FILL_LIGHT: {
    INTENSITY: 0.3,
  },
  POINT_LIGHTS: {
    LIGHT_1: {
      POSITION: [3, -1.2, -6] as [number, number, number],
      INTENSITY: 5,
      COLOR: 0xffffff,
    },
    LIGHT_2: {
      POSITION: [-3, 0.5, -6] as [number, number, number],
      INTENSITY: 5,
      COLOR: 0xffffff,
    },
  },
  INTENSITY: 0.1,
  AMBIENT: {
    INTENSITY: 0.1,
  },
  BLOOM: {
    INTENSITY: 2,
    LUMINANCE_THRESHOLD: 0.1,
    LUMINANCE_SMOOTHING: 0.9,
  },
  NOISE: {
    OPACITY: 0.008,
  },
} as const;

export const CAMERA_CONFIG = {
  BREAKPOINTS: {
    XL: {
      POSITION: [0, 0, -4.5] as [number, number, number],
      FOV: 60,
      TARGET: [0, 0, -7.4] as [number, number, number],
    },
    XXL: {
      POSITION: [0, 0, -4.5] as [number, number, number],
      FOV: 55,
      TARGET: [0, 0, -7.4] as [number, number, number],
    },
  },
} as const;

export const BREAKPOINT_THRESHOLDS = {
  XL: 1280,
  XXL: 1536,
} as const;

export const SHADOW_CONFIG = {
  MAP_SIZE: 512,
  CAMERA_BOUNDS: {
    LEFT: -2,
    RIGHT: 2,
    TOP: 2,
    BOTTOM: -2,
    NEAR: 0.1,
    FAR: 15,
  },
  BIAS: -0.0008,
  RADIUS: 2,
} as const;

export interface CameraConfig {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}
