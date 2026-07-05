const BASE_UNIT = 4;

export const spacing = {
  none: 0,
  '2xs': BASE_UNIT,
  xs: BASE_UNIT * 2,
  sm: BASE_UNIT * 3,
  md: BASE_UNIT * 4,
  lg: BASE_UNIT * 5,
  xl: BASE_UNIT * 6,
  '2xl': BASE_UNIT * 8,
  '3xl': BASE_UNIT * 10,
  '4xl': BASE_UNIT * 12,
  '5xl': BASE_UNIT * 16,
} as const;

export type Spacing = typeof spacing;
