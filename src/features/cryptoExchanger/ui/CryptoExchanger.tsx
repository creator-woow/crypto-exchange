import { FC, useEffect, useMemo, useState } from 'react';

import { Button, ButtonSize, ButtonVariant } from 'shared/ui/Button';
import { cn } from 'shared/lib/classNames';
import { CurrencyInput } from 'entity/currency/ui/CurrencyInput';
import { CurrencyModel } from 'entity/currency/model';
import { IconID } from 'shared/ui/Icon';
import { Loader, LoaderSize } from 'shared/ui/Loader';

import { useExchangeCurrencies } from '../lib/useExchangeCurrencies';
import { useMinExchangeUnmount } from '../lib/useMinExchangeAmount';
import { useEstimatedExchangeAmount } from '../lib/useEstimatedExchangeAmount';
import styles from './CryptoExchanger.module.scss';


interface ICryptoExchangerProps {
  className?: string;
  onErrorMessage?: (message: string) => void;
}

export const CryptoExchanger: FC<ICryptoExchangerProps> = (props) => {
  const {
    className,
    onErrorMessage = () => null,
  } = props;
  const {
    currencies,
    isPending: isCurrenciesPending
  } = useExchangeCurrencies();
  const [fromCurrencyID, setFromCurrencyID] = useState<CurrencyModel['ID']>('');
  const [toCurrencyID, setToCurrencyID] = useState<CurrencyModel['ID']>('');
  const [fromAmount, setFromAmount] = useState(0);
  const {
    minAmount = 0,
    isPending: isMinExchangePending
  } = useMinExchangeUnmount({ fromCurrencyID, toCurrencyID });
  const {
    estimatedAmount = 0,
    isPending: isAmountEstimationPending
  } = useEstimatedExchangeAmount({ fromCurrencyID, toCurrencyID, fromAmount });
  const loaderVisible = isAmountEstimationPending || isCurrenciesPending || isMinExchangePending;
  const pairUnavailable = estimatedAmount === null || minAmount === null;
  const lessThanMinAmount = minAmount ? fromAmount < minAmount : false;
  const resultAmount = (pairUnavailable || lessThanMinAmount) ? null : estimatedAmount;

  useEffect(() => {
    if (pairUnavailable) {
      onErrorMessage('This pair disabled now');
      return;
    }
    if (lessThanMinAmount) {
      onErrorMessage('Change amount less than the minimum amount for exchange');
      return;
    }
    // If none of error cases were triggered just clear error message
    onErrorMessage('');
  }, [lessThanMinAmount, onErrorMessage, pairUnavailable]);

  useEffect(() => {
    if (currencies.length >= 2) {
      setFromCurrencyID(currencies[0].ID);
      setToCurrencyID(currencies[1].ID);
    }
  }, [currencies]);

  useEffect(() => {
    if (minAmount) {
      setFromAmount(minAmount);
    }
  }, [minAmount]);

  const onReverse = () => {
    setFromCurrencyID(toCurrencyID);
    setToCurrencyID(fromCurrencyID);
  };

  const fromCurrencies = useMemo(
    () => currencies.filter((curreny) => curreny.ID !== toCurrencyID),
    [currencies, toCurrencyID]
  );

  const toCurrencies = useMemo(
    () => currencies.filter((currency) => currency.ID !== fromCurrencyID),
    [currencies, fromCurrencyID]
  );

  return (
    <div className={cn([className, styles.cryptoConverter])}>
      <CurrencyInput
        currencyID={fromCurrencyID}
        currencies={fromCurrencies}
        value={fromAmount}
        readOnly={loaderVisible}
        onChange={(value) => setFromAmount(value)}
        onCurrencyChange={setFromCurrencyID}
      />
      <Button
        className={styles.currencySwapButton}
        size={ButtonSize.Small}
        icon={IconID.Exchange}
        variant={ButtonVariant.Transparent}
        onClick={onReverse}
      />
      <CurrencyInput
        currencyID={toCurrencyID}
        currencies={toCurrencies}
        readOnly
        value={resultAmount}
        onCurrencyChange={setToCurrencyID}
      />
      {loaderVisible && (
        <div className={styles.loaderOverlay}>
          <Loader
            className={styles.loader}
            size={LoaderSize.Small}
          />
        </div>
      )}
    </div>
  );
};
