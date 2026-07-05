export const animationDuration = {
  instant: 0,
  fast: 150,
  normal: 250,
  slow: 350,
  slower: 500,
} as const;

export const animationEasing = {
  standard: 'cubic-bezier(0.2, 0, 0, 1)',
  decelerate: 'cubic-bezier(0, 0, 0, 1)',
  accelerate: 'cubic-bezier(0.3, 0, 1, 1)',
  emphasized: 'cubic-bezier(0.2, 0, 0, 1)',
} as const;

export const animation = {
  duration: animationDuration,
  easing: animationEasing,
  spring: {
    damping: 20,
    stiffness: 300,
    mass: 0.8,
  },
} as const;

export type Animation = typeof animation;
