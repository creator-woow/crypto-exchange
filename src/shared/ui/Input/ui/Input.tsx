import { ChangeEvent, HTMLAttributes, HTMLInputTypeAttribute, forwardRef, useId } from 'react';

import { cn } from 'shared/lib/classNames';
import { BackgroundColor, BorderColor, TextColor } from 'shared/lib/const';
import { defaultBorderRadius, generateBorderRadiusCSS } from 'shared/lib/borderRadius';
import { IBorderRadius } from 'shared/types/props';

import { InputVariant } from '../lib/const';
import styles from './Input.module.scss';


export interface IInputProps {
  className?: string;
  value?: string | number;
  autoFocus?: boolean;
  borderColor?: BorderColor;
  borderRadius?: IBorderRadius;
  backgroundColor?: BackgroundColor;
  textColor?: TextColor;
  label?: string;
  autocomplete?: boolean;
  name?: string;
  format?: RegExp;
  variant?: InputVariant;
  readOnly?: boolean;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  inputMode?: HTMLAttributes<HTMLInputElement>['inputMode'];
}

export const Input = forwardRef<HTMLInputElement, IInputProps>((props, ref) => {
  const inputId = useId();
  const {
    className,
    value,
    name,
    autoFocus,
    variant = InputVariant.Bordered,
    label,
    placeholder,
    textColor = TextColor.Primary,
    borderColor = BorderColor.Default,
    borderRadius = defaultBorderRadius,
    backgroundColor = BackgroundColor.Secondary,
    autocomplete,
    readOnly,
    type = 'text',
    format = /.*/,
    inputMode,
    onChange = () => null,
    onFocus = () => null,
    onBlur = () => null
  } = props;

  const onChangeWrapper = (e: ChangeEvent<HTMLInputElement>) => {
    if (format.test(e.target.value)) {
      onChange(e.target.value);
    }
  };

  return (
    <div className={styles.inputWrapper}>
      {label && <label className={styles.label} htmlFor={inputId}>{label}</label>}
      <input
        ref={ref}
        className={cn([
          className,
          styles.input,
          styles[`variant-${variant}`],
          `bg-${variant === InputVariant.Transparent ? BackgroundColor.Transparent : backgroundColor}`,
          `text-${textColor}`,
          generateBorderRadiusCSS(borderRadius)
        ], {
          'border': variant === InputVariant.Bordered,
          [`border-${borderColor}`]: variant === InputVariant.Bordered,
        })}
        id={inputId}
        name={name}
        type={type}
        autoComplete={autocomplete ? 'on' : 'off'}
        value={value}
        placeholder={placeholder}
        autoFocus={autoFocus}
        onChange={onChangeWrapper}
        onFocus={onFocus}
        onBlur={onBlur}
        readOnly={readOnly}
        inputMode={inputMode}
      />
    </div>
  );
});
