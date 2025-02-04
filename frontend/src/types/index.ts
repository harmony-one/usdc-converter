import { Web3 } from 'web3';

export interface Token {
  id: string;
  name: string;
  address: string;
}

export interface Web3State {
  web3: Web3 | null;
  account: string;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

export interface TokenState {
  balance: string;
  amount: string;
  usdceAmount: string;
  selectedToken: string;
  isReversed: boolean;
  setAmount: (amount: string) => void
  setUsdceAmount: (amount: string) => void
  setSelectedToken: (token: string) => void
  setIsReversed: (isReversed: boolean) => void
}

export interface ConversionState {
  isConverting: boolean;
  convert: () => Promise<void>;
}

export interface ViewState {
  isMobileView: boolean;
  step: number;
  setStep: (step: number) => void;
}
