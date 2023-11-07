import { FC } from 'react';

import { cn } from 'shared/lib/classNames';

import { LoaderSize } from '../lib/const';
import styles from './Loader.module.scss';


interface ILoaderProps {
  className?: string;
  size?: LoaderSize;
}

export const Loader: FC<ILoaderProps> = (props) => {
  const {
    className,
    size = LoaderSize.Medium
  } = props;
  return (
      <div className={cn([className, styles['lds-ring'], styles[`size-${size}`]])}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
  );
};
