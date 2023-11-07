import { CurrencyModel } from 'entity/currency/model'
import { useFetch } from 'shared/hooks/useFetch'
import { IMinAmountResponse } from './dataTypes';

interface IOptions {
  fromCurrencyID: CurrencyModel['ID'];
  toCurrencyID: CurrencyModel['ID'];
  flow?: 'standard' | 'fixed-rate';
}

export const useMinExchangeUnmount = (options: IOptions) => {
  const {
    fromCurrencyID,
    toCurrencyID,
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
    data
  } = useFetch<IMinAmountResponse>(`https://api.changenow.io/v2/exchange/min-amount`, {
    queries: {
      fromCurrency,
      toCurrency,
      fromNetwork,
      toNetwork,
      flow
    }
  });

  return data?.minAmount ?? 0;
}