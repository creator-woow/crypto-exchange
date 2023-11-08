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
  const [errorMessage, setErrorMessage] = useState('');
  
  return (
    <div className={cn([className, styles.cryptoExchange])}>
      {/* Here should be handler for change event of feature which set it into widget state  */}
      <CryptoExchanger autoFocus onErrorMessage={setErrorMessage} />
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
          disabled={!!errorMessage}
        />
      </div>
      {errorMessage && (
        <div className={cn(['text-dangerous', styles.errorMessage])}>
          {errorMessage}
        </div>
      )}
    </div>
  );
}
