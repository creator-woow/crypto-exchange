import { FC, PropsWithChildren, RefObject, useCallback, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import { cn } from 'shared/lib/classNames';

import styles from './Popup.module.scss';


interface IOverlayProps extends PropsWithChildren {
  className?: string;
  parentRef: RefObject<HTMLElement>
  onClose?: () => void;
}

const APP_EDGES_OFFSET = 20;

export const Popup: FC<IOverlayProps> = (props) => {
  const {
    className,
    children,
    parentRef,
    onClose = () => null,
  } = props;
  // offset for the overlay so that it does not touch the border of the browser window
  const popupRef = useRef<HTMLInputElement>(null);
  const { 
    top: parentTopOffset = 0,
    left = 0,
    height: parentHeight = 0,
    width: parentWidth = 0
  } = parentRef?.current?.getBoundingClientRect() || {};
  const top = parentTopOffset + parentHeight;
  const maxHeight = window.innerHeight - top - APP_EDGES_OFFSET;

  const onOutsideClick = useCallback((e: MouseEvent) => {
    const eventTarget = e.target as Node
    if (popupRef.current?.contains(eventTarget) || parentRef?.current?.contains(eventTarget)) {
      return;
    }
    onClose();
  }, [onClose, parentRef]);

  const onKeyboardDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  // When popup opened we need to prevent page scrolling
  useLayoutEffect(() => {
    document.addEventListener("mouseup", onOutsideClick);
    document.addEventListener("keydown", onKeyboardDown);
    document.body.classList.add("not-scrollable");
    return () => {
      document.removeEventListener("mouseup", onOutsideClick);
      document.removeEventListener("keydown", onKeyboardDown);
      document.body.classList.remove("not-scrollable");
    }
  }, [onKeyboardDown, onOutsideClick]);

  const layout = (
    <div
      className={cn([styles.popup, className])} 
      ref={popupRef}
      style={{ top, left, width: parentWidth, maxHeight }}
    >
      {children}
    </div>
  );

  return createPortal(layout, document.querySelector('.app') as Element);
};
