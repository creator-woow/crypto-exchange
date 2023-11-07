import { ICurrencyRawData } from './lib/dataTypes';

const ID_SEPARATOR = '.'

export class CurrencyModel {
  network: string;
  name: string;
  ticker: string;
  imagePath: string;
  ID: string;

  constructor(rawData: ICurrencyRawData) {
    this.network = rawData.network;
    this.name = rawData.name;
    this.ticker = rawData.ticker;
    this.imagePath = rawData.image;
    this.ID = `${this.network}${ID_SEPARATOR}${this.ticker}`
  }

  static getInfoFromID(ID: CurrencyModel['ID']): { ticker: CurrencyModel['ticker'], network: CurrencyModel['network']} {
    const [network, ticker] = ID.split(ID_SEPARATOR);

    return {
      ticker,
      network
    }
  }
}