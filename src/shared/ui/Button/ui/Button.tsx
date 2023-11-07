import { FC, MouseEvent } from 'react';

import { cn } from 'shared/lib/classNames';
import { BackgroundColor, TextColor } from 'shared/lib/const';

import { ButtonSize, ButtonVariant } from '../lib/const';
import styles from './Button.module.scss';
import { Icon, IconID, IconSize } from 'shared/ui/Icon';
import { defaultBorderRadius, generateBorderRadiusCSS } from 'shared/lib/borderRadius';
import { IBorderRadius } from 'shared/types/props';


interface IButtonProps {
  className?: string;
  caption?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  borderRadius?: IBorderRadius;
  backgroundColor?: BackgroundColor;
  textColor?: TextColor;
  icon?: IconID;
  iconSize?: IconSize;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

export const Button: FC<IButtonProps> = (props) => {
  const {
    className,
    caption,
    variant = ButtonVariant.Filled,
    size = ButtonSize.Medium,
    textColor = TextColor.Primary,
    borderRadius = defaultBorderRadius,
    backgroundColor = BackgroundColor.Primary,
    iconSize = IconSize.Medium,
    icon,
    onClick = () => null
  } = props;

  return (
    <button
      className={cn([
        className,
        styles.button,
        styles[`size-${size}`],
        styles[`variant-${variant}`],
        `text-${textColor}`,
        generateBorderRadiusCSS(borderRadius)
      ], {
        [`bg-${backgroundColor}`]: Boolean(backgroundColor) && variant !== ButtonVariant.Transparent,
        'bg-transparent': variant === ButtonVariant.Transparent
      })}
      onClick={onClick}
    >
      {caption && <span className={styles.caption}>{caption}</span>}
      {icon && (
        <Icon
          className={styles.icon}
          size={iconSize}
          id={icon}
        />
      )}
    </button>
  )
};
