import { CurrencyModel } from 'entity/currency/model';
import { useFetch } from 'shared/hooks/useFetch';

import { IEstimatedExchangeAmountResponse } from './dataTypes';
import { RequestError } from './const';

interface IOptions {
  fromCurrencyID: CurrencyModel['ID'];
  toCurrencyID: CurrencyModel['ID'];
  fromAmount: number;
  minAmount: number;
  flow?: 'standard' | 'fixed-rate';
}

export const useEstimatedExchangeAmount = (options: IOptions) => {
  const {
    fromCurrencyID,
    toCurrencyID,
    fromAmount,
    minAmount,
    flow = 'standard'
  } = options;
  
  const {
    ticker: fromCurrency,
    network: fromNetwork
  } = CurrencyModel.getInfoFromID(fromCurrencyID);
  const {
    ticker: toCurrency,
    network: toNetwork
  } = CurrencyModel.getInfoFromID(toCurrencyID);

  const lessThanMinAmount = fromAmount < minAmount;
  const noCurrencies = !(fromCurrency && toCurrency)

  const {
    data,
    isPending,
    error
  } = useFetch<
    IEstimatedExchangeAmountResponse
  >(`https://api.changenow.io/v2/exchange/estimated-amount`, {
    queries: {
      fromCurrency,
      toCurrency,
      fromNetwork,
      toNetwork,
      flow,
      fromAmount
    },
    preventRequest: lessThanMinAmount || noCurrencies || !fromAmount,
    headers: {
      'X-Changenow-Api-Key': `${import.meta.env.VITE_EXCHANGE_API_KEY}`
    }
  });

  return {
    estimatedAmount: data?.toAmount,
    pairDisabled: error?.id === RequestError.PairUnavailabe,
    lessThanMinAmount,
    isPending
  };
}