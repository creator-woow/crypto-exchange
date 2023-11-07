export enum IconID {
  Exchange = 'exchange',
  ArrowAngle = 'arrow-triangle',
  Cross = 'cross'
}

export enum IconSize {
  Small = 'small',
  Medium = 'medium',
  Large = 'large'
}

export const iconSizes: Record<IconSize, number> = {
  [IconSize.Small]: 16,
  [IconSize.Medium]: 20,
  [IconSize.Large]: 28
};
