import { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { TokenState, Token } from '@/types';
import { useWeb3 } from './useWeb3';
import TokenABI from '../abi/Token.json'

// export const tokens: Token[] = [
//   {
//     id: 'token1',
//     name: 'Input Token 1',
//     address: appConfig.inputToken1Address
//   },
//   {
//     id: 'token2',
//     name: 'Input Token 2',
//     address: appConfig.inputToken2Address
//   }
// ];

export const tokens: Token[] = [
  {
    id: 'eth',
    name: 'Ethereum',
    address: '0xBC594CABd205bD993e7FfA6F3e9ceA75c1110da5',
    link: "https://explorer.harmony.one/address/0xBC594CABd205bD993e7FfA6F3e9ceA75c1110da5?activeTab=3",  
  },
  {
    id: 'bsc',
    name: 'Bsc',
    address: '0x44cED87b9F1492Bf2DCf5c16004832569f7f6cBa',
    link: "https://explorer.harmony.one/address/0x44cED87b9F1492Bf2DCf5c16004832569f7f6cBa?activeTab=3",
  },
  {
    id: 'arb',
    name: 'Arbitrum',
    address: '0x9b5fae311A4A4b9d838f301C9c27b55d19BAa4Fb',
    link: "https://explorer.harmony.one/address/0x9b5fae311A4A4b9d838f301C9c27b55d19BAa4Fb?activeTab=3",
  },
  {
    id: 'base',
    name: 'Base',
    address: '0xC8468C26345dcC4DaE328BeFA0e8cF4Dd968BEa9',
    link: "https://explorer.harmony.one/address/0xC8468C26345dcC4DaE328BeFA0e8cF4Dd968BEa9?activeTab=3",
  },
  {
    id: 'linea',
    name: 'Linea',
    address: '0x9c5C877DB2A5a37733Fe1a0bdcae8411Cdc8c5B3',
    link: "https://explorer.harmony.one/address/0x9c5C877DB2A5a37733Fe1a0bdcae8411Cdc8c5B3?activeTab=3",
  },
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
      // const balanceEth = web3.utils.fromWei(balanceWei, 'ether');

      setBalance(Number(Number(balanceWei) / 1e6).toFixed(2));
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
