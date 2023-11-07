import { FC } from 'react';

import { cn } from 'shared/lib/classNames';
import { TextColor, TextWeight } from 'shared/lib/const';

import styles from './Title.module.scss';
import { TitleSize } from '../lib/const';

interface ITitleProps {
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
  textWeight?: TextWeight;
  textColor?: TextColor;
  text?: string;
  size?: TitleSize;
}

export const Title: FC<ITitleProps> = (props) => {
  const {
    className,
    as: Tag = 'h1',
    text,
    size = TitleSize.Medium,
    textColor = TextColor.Primary,
    textWeight = TextWeight.Regular
  } = props;

  return (
    <Tag
      className={cn([
        className,
        styles[`size-${size}`],
        `text-weight-${textWeight}`,
        `text-${textColor}`])
      }>
      {text}
    </Tag>
  )
}