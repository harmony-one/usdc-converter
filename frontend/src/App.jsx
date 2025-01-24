import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import Web3 from 'web3';
import TokenConverterABI from './abi/TokenConverter.json';
import TokenABI from './abi/Token.json';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { RadioGroup } from '@headlessui/react';

function App() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [usdceAmount, setUsdceAmount] = useState('');
  const [balance, setBalance] = useState('0');
  const [selectedToken, setSelectedToken] = useState('token1');
  const [isReversed, setIsReversed] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [step, setStep] = useState(1); // 1: Select token, 2: Enter amount

  const tokens = [
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
  const TOKEN_CONVERTER_ADDRESS = '0x003f4d122982ccCcb5AF817dE055E5F841509CCC';
  const OUTPUT_TOKEN_ADDRESS = '0x3BC1d310e8B1d52ab96D7fE43c9A90eb0EC6FE39';

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWeb3(web3Instance);
        const accounts = await web3Instance.eth.getAccounts();
        setAccount(accounts[0]);
        await updateBalance(web3Instance, accounts[0]);
      } else {
        toast.error('Please install MetaMask');
      }
    } catch (error) {
      toast.error('Failed to connect wallet');
      console.error(error);
    } finally {
      setIsConnecting(false);
    }
  };

  const updateBalance = async (web3Instance, userAccount) => {
    try {
      const selectedTokenAddress = tokens.find(t => t.id === selectedToken).address;
      const tokenContract = new web3Instance.eth.Contract(TokenABI.abi, selectedTokenAddress);
      const balanceWei = await tokenContract.methods.balanceOf(userAccount).call();
      const balanceEth = web3Instance.utils.fromWei(balanceWei, 'ether');
      setBalance(balanceEth);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const handleConvert = async () => {
    if (!web3 || !account || !amount) return;

    try {
      setIsConverting(true);
      const selectedTokenAddress = tokens.find(t => t.id === selectedToken).address;
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
      setAmount('');
      setUsdceAmount('');
      await updateBalance(web3, account);
    } catch (error) {
      toast.error('Conversion failed');
      console.error(error);
    } finally {
      setIsConverting(false);
    }
  };

  const handleAmountChange = (value, isUsdce = false) => {
    if (isUsdce) {
      setUsdceAmount(value);
      setAmount(value);
    } else {
      setAmount(value);
      setUsdceAmount(value);
    }
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        const accounts = await web3Instance.eth.getAccounts();
        if (accounts.length > 0) {
          setWeb3(web3Instance);
          setAccount(accounts[0]);
          await updateBalance(web3Instance, accounts[0]);
        }
      }
    };
    checkConnection();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-background text-white">
      <Toaster position="top-right" />
      
      <header className="p-4 flex justify-between items-center">
        <h1 className="text-2xl font-medium">USDC Converter</h1>
        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className="px-6 py-2 rounded-full bg-[#2A2A2A] hover:bg-opacity-80 transition-colors disabled:opacity-50"
        >
          {isConnecting ? 'Connecting...' : account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Connect Wallet'}
        </button>
      </header>

      <main className="max-w-3xl mx-auto mt-12 p-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-medium text-primary mb-2">Unlock Efficient Liquidity</h2>
          <p className="text-gray-400 text-sm md:text-base">
            Unify USDC liquidity on Harmony
          </p>
        </div>

        <div className="bg-[#1A1A1A] rounded-2xl p-6 md:p-10">
          {/* Desktop View */}
          <div className={`${isMobileView ? 'hidden' : 'block'}`}>
            <div className="grid grid-cols-[1fr,auto,1fr] gap-8 items-center">
              {/* Input Tokens side */}
              <div>
                <div className="h-[44px] mb-4">
                <RadioGroup 
                  value={selectedToken} 
                  onChange={(value) => {
                    setSelectedToken(value);
                    if (web3 && account) {
                      updateBalance(web3, account);
                    }
                  }}
                  className="flex gap-4 w-full"
                >
                  {tokens.map(token => (
                    <RadioGroup.Option
                      key={token.id}
                      value={token.id}
                      className={({ checked }) =>
                        `flex-1 relative flex cursor-pointer rounded-xl px-3 py-2 focus:outline-none transition-all ${
                          checked
                            ? 'bg-primary bg-opacity-10 border-2 border-primary'
                            : 'bg-[#111] border-2 border-transparent hover:border-primary/50'
                        }`
                      }
                    >
                      {({ checked }) => (
                        <div className="flex w-full items-center justify-between">
                          <span className={`text-sm whitespace-nowrap ${checked ? 'text-primary' : 'text-white'}`}>
                            {token.name}
                          </span>
                          {checked && (
                            <div className="h-3 w-3 bg-primary rounded-full" />
                          )}
                        </div>
                      )}
                    </RadioGroup.Option>
                  ))}
                </RadioGroup>
                </div>
                <div className="bg-[#111] rounded-xl p-6">
                  <div className="relative">
                    <span className="block text-sm text-gray-400 mb-2">
                      {tokens.find(t => t.id === selectedToken).name}
                    </span>
                    <input
                      type="number"
                      value={isReversed ? usdceAmount : amount}
                      onChange={(e) => handleAmountChange(e.target.value, isReversed)}
                      placeholder="0.00"
                      className="w-full bg-[#222] rounded-lg p-4 pr-16 text-lg"
                    />
                    <button 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-secondary"
                      onClick={() => setAmount(balance)}
                    >
                      max
                    </button>
                  </div>
                </div>
              </div>
              {/* Arrow */}
              <div className="self-start mt-[100px] -mx-4">
                <button 
                  onClick={() => setIsReversed(!isReversed)}
                  className={`p-3 rounded-full hover:bg-[#111] transition-all duration-200 transform ${isReversed ? '-rotate-180' : ''}`}
                >
                  <ArrowRightIcon className="h-6 w-6 text-primary" />
                </button>
              </div>

              {/* USDCe side */}
              <div>
                <div className="h-[44px] mb-4" />
                <div className="bg-[#111] rounded-xl p-6">
                  <div className="relative">
                    <span className="block text-sm text-gray-400 mb-2">USDC.e</span>
                    <input
                      type="number"
                      value={isReversed ? amount : usdceAmount}
                      onChange={(e) => handleAmountChange(e.target.value, !isReversed)}
                      placeholder="0.00"
                      className="w-full bg-[#222] rounded-lg p-4 pr-16 text-lg"
                    />
                    <button 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-secondary"
                      onClick={() => handleAmountChange(balance, !isReversed)}
                    >
                      max
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile View */}
          <div className={`${isMobileView ? 'block' : 'hidden'}`}>
            {step === 1 ? (
              <div className="space-y-6">
                <h2 className="text-xl font-medium text-center mb-8">Select the token you have</h2>
                <div className="space-y-4">
                  {tokens.map(token => (
                    <div 
                      key={token.id}
                      className="p-6 rounded-xl cursor-pointer transition-all bg-[#111] border-2 border-transparent hover:border-primary/50"
                      onClick={() => {
                        setSelectedToken(token.id);
                        setIsReversed(false);
                        setStep(2);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-lg">{token.name}</span>
                      </div>
                    </div>
                  ))}
                  <div
                    className="p-6 rounded-xl cursor-pointer transition-all bg-[#111] border-2 border-transparent hover:border-primary/50"
                    onClick={() => {
                      setIsReversed(true);
                      setStep(2);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg">USDC.e</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-8">
                  <button 
                    onClick={() => setStep(1)} 
                    className="text-primary"
                  >
                    Back
                  </button>
                  <h2 className="text-xl font-medium">Enter Amount</h2>
                  <button 
                    onClick={() => setIsReversed(!isReversed)}
                    className="text-primary"
                  >
                    Switch
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="bg-[#111] rounded-xl p-6">
                    <span className="block text-sm text-gray-400 mb-2">From</span>
                    <span className="text-lg mb-4 block">
                      {isReversed ? 'USDC.e' : tokens.find(t => t.id === selectedToken).name}
                    </span>
                    <div className="relative mt-4">
                      <input
                        type="number"
                        value={isReversed ? usdceAmount : amount}
                        onChange={(e) => handleAmountChange(e.target.value, isReversed)}
                        placeholder="0.00"
                        className="w-full bg-[#222] rounded-lg p-4 pr-16 text-lg"
                      />
                      <button 
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-secondary"
                        onClick={() => handleAmountChange(balance, isReversed)}
                      >
                        max
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <button
                      onClick={() => setIsReversed(!isReversed)}
                      className="p-3 rounded-full hover:bg-[#111] transition-all duration-200"
                    >
                      <ArrowRightIcon className="h-6 w-6 text-primary transform rotate-90" />
                    </button>
                  </div>
                  <div className="bg-[#111] rounded-xl p-6">
                    <span className="block text-sm text-gray-400 mb-2">To</span>
                    <span className="text-lg mb-4 block">
                      {isReversed ? tokens.find(t => t.id === selectedToken).name : 'USDC.e'}
                    </span>
                    <div className="relative mt-4">
                      <input
                        type="number"
                        value={isReversed ? amount : usdceAmount}
                        onChange={(e) => handleAmountChange(e.target.value, !isReversed)}
                        placeholder="0.00"
                        className="w-full bg-[#222] rounded-lg p-4 pr-16 text-lg"
                      />
                      <button 
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-secondary"
                        onClick={() => handleAmountChange(balance, !isReversed)}
                      >
                        max
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleConvert}
                  disabled={!account || !amount || isConverting}
                  className={`w-full py-4 ${amount ? 'bg-[#0AB7D4] hover:brightness-110' : 'bg-[#226978]'} rounded-lg transition-colors disabled:opacity-50 text-black font-medium text-lg mt-6`}
                >
                  {isConverting ? 'Converting...' : `Convert to ${isReversed ? tokens.find(t => t.id === selectedToken).name : 'USDC.e'}`}
                </button>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-center">
            <button
              className={`${isMobileView ? 'hidden' : 'block'} px-12 py-4 ${
                amount ? 'bg-[#0AB7D4] hover:brightness-110' : 'bg-[#226978]'
              } rounded-lg transition-colors disabled:opacity-50 text-black font-medium text-lg`}
              onClick={handleConvert}
              disabled={!account || !amount || isConverting}
            >
              {isConverting ? 'Converting...' : `Convert to ${isReversed ? tokens.find(t => t.id === selectedToken).name : 'USDC.e'}`}
            </button>
          </div>
        </div>
        <p className="text-center text-sm text-gray-400 mt-4 px-4">
          Convert tokens with 1:1 ratio
        </p>
      </main>
    </div>
  );
}

export default App;