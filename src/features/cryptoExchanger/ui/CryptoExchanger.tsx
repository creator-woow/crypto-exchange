import { FC, useEffect, useMemo, useState } from 'react';

import { Button, ButtonSize, ButtonVariant } from 'shared/ui/Button';
import { cn } from 'shared/lib/classNames';
import { CurrencyInput } from 'entity/currency/ui/CurrencyInput';
import { CurrencyModel } from 'entity/currency/model';
import { IconID } from 'shared/ui/Icon';

import { useExchangeCurrencies } from '../lib/useExchangeCurrencies';
import { useMinExchangeUnmount } from '../lib/useMinExchangeAmount';
import { useEstimatedExchangeAmount } from '../lib/useEstimatedExchangeAmount';
import styles from './CryptoExchanger.module.scss';


interface ICryptoExchangerProps {
  className?: string;
}

export const CryptoExchanger: FC<ICryptoExchangerProps> = (props) => {
  const {
    className,
  } = props;
  const currencies = useExchangeCurrencies();
  const [fromCurrencyID, setFromCurrencyID] = useState<CurrencyModel['ID']>('');
  const [toCurrencyID, setToCurrencyID] = useState<CurrencyModel['ID']>('');
  const [fromAmount, setFromAmount] = useState(0);
  const minAmount = useMinExchangeUnmount({ fromCurrencyID, toCurrencyID });
  const { estimatedAmount } = useEstimatedExchangeAmount({ fromCurrencyID, toCurrencyID, fromAmount });

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
        value={estimatedAmount}
        onCurrencyChange={setToCurrencyID}
      />
    </div>
  );
};
