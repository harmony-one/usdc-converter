import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { ConversionState } from '../types';
import { useWeb3 } from './useWeb3';
import { useTokens, tokens } from './useTokens';

const TOKEN_CONVERTER_ADDRESS = '0x003f4d122982ccCcb5AF817dE055E5F841509CCC';

export function useConversion(): ConversionState {
  const { web3, account } = useWeb3();
  const { selectedToken, amount } = useTokens();
  const [isConverting, setIsConverting] = useState<boolean>(false);

  const convert = useCallback(async () => {
    if (!web3 || !account || !amount) return;

    try {
      setIsConverting(true);
      const selectedTokenAddress = tokens.find(t => t.id === selectedToken)?.address;
      if (!selectedTokenAddress) return;

      const tokenContract = new web3.eth.Contract(TokenABI.abi, selectedTokenAddress);
      const converterContract = new web3.eth.Contract(TokenConverterABI.abi, TOKEN_CONVERTER_ADDRESS);
      
      const amountWei = web3.utils.toWei(amount, 'ether');
      
      // Approve tokens
      await tokenContract.methods
        .approve(TOKEN_CONVERTER_ADDRESS, amountWei)
        .send({ from: account });

      // Convert tokens
      await converterContract.methods
        .convert(selectedTokenAddress, amountWei)
        .send({ from: account });

      toast.success('Conversion successful!');
    } catch (error) {
      toast.error('Conversion failed');
      console.error(error);
    } finally {
      setIsConverting(false);
    }
  }, [web3, account, amount, selectedToken]);

  return {
    isConverting,
    convert
  };
}
