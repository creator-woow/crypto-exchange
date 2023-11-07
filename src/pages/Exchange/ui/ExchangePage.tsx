import { FC } from 'react';

import { CryptoExchange } from 'widgets/cryptoExchange';
import { Page } from 'shared/ui/Page';
import { TextWeight } from 'shared/lib/const';
import { Title, TitleSize } from 'shared/ui/Title';
import { cn } from 'shared/lib/classNames';

import styles from './ExchangePage.module.scss';


export const ExchangePage: FC = () => {
  return (
    <Page>
      <div className={cn([styles.pageContent, "container"])}>
        <Title
          className={styles.pageTitle}
          as="h1"
          size={TitleSize.Large}
          text="Crypto Exchange"
          textWeight={TextWeight.Thin}
        />
        <Title
          className={styles.pageDescription}
          as="h2"
          size={TitleSize.Small}
          text="Exchange fast and easy"
          textWeight={TextWeight.Regular}
        />
        <div className={styles.exchangeWidget}>
          <CryptoExchange /> 
        </div>
      </div>
    </Page>
  );
};
