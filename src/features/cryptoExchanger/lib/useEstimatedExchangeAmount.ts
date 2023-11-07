import { CurrencyModel } from 'entity/currency/model';
import { IEstimatedExchangeAmountResponse } from './dataTypes';
import { FetchStatus, useFetch } from 'shared/hooks/useFetch';

interface IOptions {
  fromCurrencyID: CurrencyModel['ID'];
  toCurrencyID: CurrencyModel['ID'];
  fromAmount: number;
  flow?: 'standard' | 'fixed-rate';
}

export const useEstimatedExchangeAmount = (options: IOptions) => {
  const {
    fromCurrencyID,
    toCurrencyID,
    fromAmount,
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

  const {
    data,
    status
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
    headers: {
      'X-Changenow-Api-Key': `${import.meta.env.VITE_EXCHANGE_API_KEY}`
    }
  });

  return {
    estimatedAmount: data?.toAmount,
    isPending: status === FetchStatus.Pending
  };
}