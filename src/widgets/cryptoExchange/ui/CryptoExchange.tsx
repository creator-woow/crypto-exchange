import { FC, useState } from 'react';

import { Input } from 'shared/ui/Input';
import { Button, ButtonSize, ButtonVariant } from 'shared/ui/Button';
import { BackgroundColor, TextColor } from 'shared/lib/const';
import { CryptoExchanger } from 'features/cryptoExchanger';
import { cn } from 'shared/lib/classNames';

import styles from './CryptoExchange.module.scss';


interface ICryptoExchangeProps {
  className?: string;
}

export const CryptoExchange: FC<ICryptoExchangeProps> = (props) => {
  const { className } = props;
  const [walletAddress, setWalletAdress] = useState('');
  
  return (
    <div className={cn([className, styles.currencyExchange])}>
      <CryptoExchanger />
      <div className={styles.exchangeAdress}>
        <Input
          label="Your Ethereum address"
          value={walletAddress}
          onChange={setWalletAdress}
          autocomplete={false}
        />
        <Button
          caption="Exchange"
          variant={ButtonVariant.Filled}
          size={ButtonSize.Medium}
          backgroundColor={BackgroundColor.Primary}
          textColor={TextColor.Secondary}
        />
      </div>
    </div>
  );
}
