import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { ConversionState } from '../types';
import { useWeb3 } from './useWeb3';
import { useTokens, tokens } from './useTokens';

import TokenABI from '../abi/Token.json';
import TokenConverterABI from '../abi/TokenConverter.json';

const TOKEN_CONVERTER_ADDRESS = '0x60A9bf01b3203A9F8f5c7F183163C3b52EE14f0A';

export function useConversion(): ConversionState {
  const { web3, account } = useWeb3();
  const { selectedToken } = useTokens();
  const [isConverting, setIsConverting] = useState<boolean>(false);

  const convert = useCallback(async (amount: string) => {
    if (!web3) {
      toast.error('Web3 is not initialized');
      return;
    }
    if (!account) {
      toast.error('No account connected');
      return;
    }
  
    const selectedTokenAddress = tokens.find(t => t.id === selectedToken)?.address;
    if (!selectedTokenAddress) {
      toast.error('Invalid token selected');
      return;
    }
  
    try {
      setIsConverting(true);
      const tokenContract = new web3.eth.Contract(TokenABI.abi, selectedTokenAddress);
      const converterContract = new web3.eth.Contract(TokenConverterABI.abi, TOKEN_CONVERTER_ADDRESS);
      const amountWei = web3.utils.toWei(amount, 'ether');
  
      // Get the legacy gas price
      const gasPrice = await web3.eth.getGasPrice();
  
      // Approve tokens
      const approvalTx = tokenContract.methods.approve(TOKEN_CONVERTER_ADDRESS, amountWei);
      const estimatedGasApproval = await approvalTx.estimateGas({ from: account });
  
      await approvalTx.send({
        from: account,
        gas: estimatedGasApproval,
        gasPrice, // ✅ Use legacy gas pricing
      });
  
      // Convert tokens
      const conversionTx = converterContract.methods.convert(selectedTokenAddress, amountWei);
      const estimatedGasConversion = await conversionTx.estimateGas({ from: account });
  
      await conversionTx.send({
        from: account,
        gas: estimatedGasConversion,
        gasPrice, // ✅ Use legacy gas pricing
      });
  
      toast.success('Conversion successful!');
    } catch (error: any) {
      if (error.code === 4001) {
        toast.error('Transaction rejected by user');
      } else {
        toast.error('Conversion failed: ' + (error.message || 'Unknown error'));
      }
      console.error(error);
    } finally {
      setIsConverting(false);
    }
  }, [web3, account, selectedToken]);
  

  return {
    isConverting,
    convert,
  };
}
