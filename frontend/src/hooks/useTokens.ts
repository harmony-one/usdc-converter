import { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { TokenState, Token } from '../types';
import { useWeb3 } from './useWeb3';

export const tokens: Token[] = [
  {
    id: 'token1',
    name: 'Input Token 1',
    address: '0x5573264539929ed86F81bF18Ac05A99502557ACe'
  },
  {
    id: 'token2',
    name: 'Input Token 2',
    address: '0x4c98df6344b4b1672ca784B45a9DAa79C6133De4'
  }
];

export function useTokens(): TokenState {
  const { web3, account } = useWeb3();
  const [balance, setBalance] = useState<string>('0');
  const [amount, setAmount] = useState<string>('');
  const [usdceAmount, setUsdceAmount] = useState<string>('');
  const [selectedToken, setSelectedToken] = useState<string>('token1');
  const [isReversed, setIsReversed] = useState<boolean>(false);

  const updateBalance = useCallback(async () => {
    if (!web3 || !account) return;

    try {
      const selectedTokenAddress = tokens.find(t => t.id === selectedToken)?.address;
      if (!selectedTokenAddress) return;

      const tokenContract = new web3.eth.Contract(TokenABI.abi, selectedTokenAddress);
      const balanceWei = await tokenContract.methods.balanceOf(account).call();
      const balanceEth = web3.utils.fromWei(balanceWei, 'ether');
      setBalance(balanceEth);
    } catch (error) {
      console.error('Error fetching balance:', error);
      toast.error('Failed to fetch balance');
    }
  }, [web3, account, selectedToken]);

  useEffect(() => {
    updateBalance();
  }, [updateBalance]);

  return {
    balance,
    amount,
    usdceAmount,
    selectedToken,
    isReversed,
    setAmount,
    setUsdceAmount,
    setSelectedToken,
    setIsReversed
  };
}
