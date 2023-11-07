import { FC } from 'react'

import { cn } from 'shared/lib/classNames';
import { IconColor } from 'shared/lib/const';

import { IconID, IconSize, iconSizes } from '../lib/const';
import styles from './Icon.module.scss'


type IIconProps = {
  className?: string;
  size?: IconSize
  color?: IconColor;
} & (
  | { id?: IconID, url?: never }
  | { id?: never, url?: string }
)

export const Icon: FC<IIconProps> = (props) => {
  const {
    className,
    id,
    url,
    color = IconColor.Primary,
    size = IconSize.Medium
  } = props;

  return url ? (
    // todo: resolve icon color change in scenario of use cross origin svg
    <img
      className={cn([className, `icon-${color}`])}
      width={iconSizes[size]}
      height={iconSizes[size]}
      src={url}
    />
  ) : (
    <svg
      className={cn([className, styles[`size-${size}`], `icon-${color}`])}
      // todo: need to create autoscale system for icons
      viewBox={`0 0 ${iconSizes[size]} ${iconSizes[size]}`}
    >
      <use
        href={`/icons.svg#${id}`}
      />
    </svg>
  );
}
