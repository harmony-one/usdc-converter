import { useState, useCallback, useEffect } from 'react';
import Web3 from 'web3';
import { toast } from 'react-hot-toast';

export function useWeb3(): Web3State {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [account, setAccount] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  const connect = useCallback(async () => {
    try {
      setIsConnecting(true);
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWeb3(web3Instance);
        const accounts = await web3Instance.eth.getAccounts();
        setAccount(accounts[0]);
      } else {
        toast.error('Please install MetaMask');
      }
    } catch (error) {
      toast.error('Failed to connect wallet');
      console.error(error);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setWeb3(null);
    setAccount('');
  }, []);

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        const accounts = await web3Instance.eth.getAccounts();
        if (accounts.length > 0) {
          setWeb3(web3Instance);
          setAccount(accounts[0]);
        }
      }
    };
    checkConnection();
  }, []);

  return {
    web3,
    account,
    isConnecting,
    connect,
    disconnect
  };
}
