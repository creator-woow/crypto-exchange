import { FC, useEffect, useMemo, useState } from 'react';

import { Button, ButtonSize, ButtonVariant } from 'shared/ui/Button';
import { CurrencyInput } from 'entity/currency/ui/CurrencyInput';
import { CurrencyModel } from 'entity/currency/model';
import { IconID } from 'shared/ui/Icon';
import { Loader, LoaderSize } from 'shared/ui/Loader';
import { cn } from 'shared/lib/classNames';

import { useExchangeCurrencies } from '../lib/useExchangeCurrencies';
import { useMinExchangeUnmount } from '../lib/useMinExchangeAmount';
import { useEstimatedExchangeAmount } from '../lib/useEstimatedExchangeAmount';
import styles from './CryptoExchanger.module.scss';


interface ICryptoExchangerProps {
  className?: string;
  onErrorMessage?: (message: string) => void;
  autoFocus?: boolean;
}


// todo: Feature makes extra requestes, need to find and fix logic error
export const CryptoExchanger: FC<ICryptoExchangerProps> = (props) => {
  const {
    className,
    autoFocus,
    onErrorMessage = () => null,
  } = props;
  const {
    currencies,
    isPending: isCurrenciesPending
  } = useExchangeCurrencies();
  const [fromCurrencyID, setFromCurrencyID] = useState<CurrencyModel['ID']>('');
  const [toCurrencyID, setToCurrencyID] = useState<CurrencyModel['ID']>('');
  const {
    minAmount = 0,
    pairDisabled: minPairDisabled,
    isPending: isMinExchangePending
  } = useMinExchangeUnmount({
    fromCurrencyID,
    toCurrencyID
  });
  const [fromAmount, setFromAmount] = useState<number | ''>(minAmount);
  const {
    estimatedAmount = 0,
    pairDisabled: estimatePairDisabled,
    lessThanMinAmount,
    isPending: isAmountEstimationPending
  } = useEstimatedExchangeAmount({
    fromCurrencyID,
    toCurrencyID,
    fromAmount: fromAmount || 0,
    minAmount
  });
  const loaderVisible = isAmountEstimationPending || isCurrenciesPending || isMinExchangePending;
  const pairUnavailable = minPairDisabled || estimatePairDisabled;
  const resultAmount = (pairUnavailable || lessThanMinAmount) ? null : estimatedAmount;

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
        autoFocus={autoFocus}
        onChange={(value) => setFromAmount(value === '' ? value : +value)}
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
