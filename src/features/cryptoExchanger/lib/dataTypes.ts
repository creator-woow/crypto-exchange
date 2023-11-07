export interface IMinAmountResponse {
  "fromCurrency": string,
  "fromNetwork": string,
  "toCurrency": string,
  "toNetwork": string,
  "flow": "standart" | "fix-rate",
  "minAmount": number
}

export interface IEstimatedExchangeAmountResponse {
  "fromCurrency": string,
  "fromNetwork": string,
  "toCurrency": string,
  "toNetwork": string,
  "flow": "standart" | "fix-rate",
  "type": string,
  "rateId": null,
  "validUntil": null,
  "transactionSpeedForecast": string,
  "warningMessage": string | null,
  "fromAmount": number,
  "toAmount": number
}