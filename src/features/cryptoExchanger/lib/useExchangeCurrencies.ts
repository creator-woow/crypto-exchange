import { ICurrencyRawData } from 'entity/currency/lib/dataTypes';
import { CurrencyModel } from 'entity/currency/model';
import { useMemo } from 'react';
import { useFetch } from 'shared/hooks/useFetch';

export const useExchangeCurrencies = () => {
  const {
    data,
    isPending
  } = useFetch<ICurrencyRawData[]>("https://api.changenow.io/v2/exchange/currencies");

  const currencies = useMemo(
    () => data?.map((currencyData) => new CurrencyModel(currencyData)) || [],
    [data]
  );

  return {
    currencies,
    isPending
  };
};
