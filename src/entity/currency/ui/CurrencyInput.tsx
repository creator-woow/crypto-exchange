import { FC, useCallback, useMemo, useRef, useState } from 'react';

import { IInputProps, Input, InputVariant } from 'shared/ui/Input'
import { Icon, IconID, IconSize } from 'shared/ui/Icon';
import { cn } from 'shared/lib/classNames';
import { BackgroundColor, BorderColor, BorderRadius, IconColor } from 'shared/lib/const';
import { Button, ButtonSize, ButtonVariant } from 'shared/ui/Button';
import { Popup } from 'shared/ui/Popup';
import { IBorderRadius } from 'shared/types/props';
import { defaultBorderRadius, generateBorderRadiusCSS } from 'shared/lib/borderRadius';

import { CurrencyModel } from '../model';
import styles from './CurrencyInput.module.scss';


interface ICurrencyInputProps {
  className?: string;
  currencies: CurrencyModel[];
  currencyID: CurrencyModel['ID'];
  value?: number | null;
  borderRadius?: IBorderRadius;
  backgroundColor?: BackgroundColor;
  borderColor?: BorderColor;
  autoFocus?: IInputProps['autoFocus'];
  readOnly?: IInputProps['readOnly'];
  onChange?: (value: number) => void;
  onCurrencyChange?: (ID: CurrencyModel['ID']) => void;
}

export const CurrencyInput: FC<ICurrencyInputProps> = (props) => {
  const {
    className,
    value,
    currencies = [],
    currencyID,
    autoFocus,
    readOnly,
    borderRadius = defaultBorderRadius,
    backgroundColor = BackgroundColor.Secondary,
    borderColor = BorderColor.Default,
    onCurrencyChange = () => null,
    onChange = () => null
  } = props;
  const [searchActive, setSearchActive] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [focused, setFocused] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputValue = value === null ? '—' : value;

  const currentCurrency = useMemo(
    () => currencies.find((currency) => currency.ID === currencyID),
    [currencies, currencyID]
  );

  const startCurrencySearch = () => {
    setSearchActive(true);
    setFocused(true);
    inputRef.current?.focus();
  };
  const stopCurrencySearch = () => {
    setSearchActive(false);
    setSearchString("");
    setFocused(false);
    inputRef.current?.focus();
  };

  const onChangeWrapper = useCallback((value: string) => {
    if (searchActive) {
      setSearchString(value);
      return;
    }
    onChange(+value);
  }, [searchActive, onChange]);

  const onCurrencyChangeWrapper = useCallback((ID: CurrencyModel['ID']) => {
    stopCurrencySearch();
    onCurrencyChange(ID);
  }, [onCurrencyChange]);

  const optionsRender = useMemo(() => currencies
    .filter((currency) =>
      currency.name.toLowerCase().includes(searchString.toLowerCase())
      ||
      currency.ticker.toLowerCase().includes(searchString.toLowerCase())
    )
    .map((currency) => (
      <div
        key={currency.ID}
        className={styles.searchOption}
        onClick={() => onCurrencyChangeWrapper(currency.ID)}
      >
        <Icon 
          className={styles.searchOptionIcon}
          size={IconSize.Medium}
          url={currency.imagePath}
        />
        <span className={styles.searchOptionTrick}>{currency.ticker}</span>
        <span className="text-unnacented">{currency.name}</span>
      </div>
  )), [currencies, onCurrencyChangeWrapper, searchString]);

  return (
    <div
      className={cn([
        className,
        styles.currencyInput,
        `bg-${backgroundColor}`,
        'border',
        `border-${focused ? BorderColor.Focus : borderColor}`,
        generateBorderRadiusCSS({
          tl: borderRadius.tl,
          tr: borderRadius.tr,
          bl: searchActive ? BorderRadius.None : borderRadius.bl,
          br: searchActive ? BorderRadius.None : borderRadius.br
        })
      ])}
      ref={componentRef}
    >
      <Input
        ref={inputRef}
        autoFocus={autoFocus}
        format={searchActive ? undefined : /^\d*(\.)?(\d{1,10})?$/}
        value={searchActive ? searchString : inputValue}
        onChange={onChangeWrapper}
        variant={InputVariant.Transparent}
        placeholder={searchActive ? "Search" : ""}
        readOnly={searchActive ? false : readOnly}
        inputMode={searchActive ? 'text' : 'decimal'}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {
        currentCurrency && !searchActive && (
          <button
            className={styles.currencyButton}
            onClick={startCurrencySearch}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          >
            <Icon
              className={cn([styles.currencyIcon])}
              url={currentCurrency.imagePath}
            />
            <span className={styles.currencyTrick}>{currentCurrency.ticker}</span>
            <Icon
              className={styles.controlIcon}
              size={IconSize.Small}
              id={IconID.ArrowAngle}
              color={IconColor.Control}
            />
          </button>
        )
      }
      {
        searchActive && (
          <Button
            icon={IconID.Cross}
            size={ButtonSize.Small}
            iconSize={IconSize.Small}
            variant={ButtonVariant.Transparent}
            onClick={stopCurrencySearch}
          />
        )
      }
      {
        searchActive && componentRef.current && (
          <Popup
            className={cn([
              styles.searchOptions,
              `bg-${backgroundColor}`,
              'border',
              'border-top-none',
              generateBorderRadiusCSS({
                tl: BorderRadius.None,
                tr: BorderRadius.None,
                bl: borderRadius.bl,
                br: borderRadius.br
              })
            ], {
              'border-focus': focused,
              'border-default': !focused
            })}
            parentRef={componentRef}
            onClose={stopCurrencySearch}
          >
            {!optionsRender.length && (
              <div className={cn([styles.emptyOption, 'text-unnacented'])}>
                Nothing found
              </div>
            )}
            {optionsRender}
          </Popup>
        )
      }
    </div>
  );
};
