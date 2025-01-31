import { FC } from 'react';
import { Toaster } from 'react-hot-toast';
import { ArrowRightIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import { useWeb3 } from './hooks/useWeb3';
import { useTokens, tokens } from './hooks/useTokens';
import { useConversion } from './hooks/useConversion';
import { useViewport } from './hooks/useViewport';
import { TokenInput } from './components/TokenInput';
import { TokenSelector } from './components/TokenSelector';

const App: FC = () => {
  const { web3, account, isConnecting, connect } = useWeb3();
  const { 
    balance, 
    amount, 
    usdceAmount, 
    selectedToken, 
    isReversed,
    setAmount,
    setUsdceAmount,
    setSelectedToken,
    setIsReversed 
  } = useTokens();
  const { isConverting, convert } = useConversion();
  const { isMobileView, step, setStep } = useViewport();

  const handleAmountChange = (value: string, isUsdce: boolean = false) => {
    if (isUsdce) {
      setUsdceAmount(value);
      setAmount(value);
    } else {
      setAmount(value);
      setUsdceAmount(value);
    }
  };

  return (
    <div className="min-h-screen bg-background text-white">
      <Toaster position="top-right" />
      
      <header className="p-4 flex justify-between items-center">
        <h1 className="text-2xl font-medium">USDC Converter</h1>
        <button
          onClick={connect}
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
          {!isMobileView ? (
            <div className="grid grid-cols-[1fr,auto,1fr] gap-8 items-center">
              {/* From side */}
              <div>
                <div className="h-[44px] mb-4">
                  <TokenSelector
                    tokens={tokens}
                    selectedToken={selectedToken}
                    onChange={(value) => setSelectedToken(value)}
                  />
                </div>
                <TokenInput
                  label={tokens.find(t => t.id === selectedToken)?.name ?? ''}
                  value={isReversed ? usdceAmount : amount}
                  onChange={(value) => handleAmountChange(value, isReversed)}
                  onMaxClick={() => handleAmountChange(balance, isReversed)}
                />
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

              {/* To side */}
              <div>
                <div className="h-[44px] mb-4" />
                <TokenInput
                  label="USDC.e"
                  value={isReversed ? amount : usdceAmount}
                  onChange={(value) => handleAmountChange(value, !isReversed)}
                  onMaxClick={() => handleAmountChange(balance, !isReversed)}
                />
              </div>
            </div>
          ) : (
            // Mobile view implementation here
            <div className="space-y-6 min-h-[400px]">
              {step === 1 && (
                <div>
                  <h3 className="text-xl font-medium mb-6 text-center">Select the token you have</h3>
                  <div className="space-y-4 max-w-[280px] mx-auto">
                    {tokens.map(token => (
                      <button
                        key={token.id}
                        onClick={() => {
                          setSelectedToken(token.id);
                          setStep(2);
                        }}
                        className={`w-full relative flex items-center justify-between p-6 rounded-xl transition-all ${
                          selectedToken === token.id ? 'bg-[#111] ring-2 ring-primary' : 'bg-[#111] hover:ring-2 hover:ring-primary/50'
                        }`}
                      >
                        <span className="text-lg w-full text-center">{token.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {step === 2 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <button 
                    onClick={() => setStep(1)}
                    className="text-primary hover:text-primary-dark"
                  >
                    ← Back
                  </button>
                  <button 
                    onClick={() => setIsReversed(!isReversed)}
                    className="p-2 rounded-lg hover:bg-[#111] transition-colors"
                  >
                    <ArrowsRightLeftIcon className="h-5 w-5 text-primary" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <TokenInput
                    label={isReversed ? 'USDC.e' : tokens.find(t => t.id === selectedToken)?.name ?? ''}
                    value={isReversed ? usdceAmount : amount}
                    onChange={(value) => handleAmountChange(value, isReversed)}
                    onMaxClick={() => handleAmountChange(balance, isReversed)}
                  />
                  
                  <div className="mt-6 text-center text-gray-400">
                    ↓ You will receive ↓
                  </div>
                  
                  <TokenInput
                    label={isReversed ? tokens.find(t => t.id === selectedToken)?.name ?? '' : 'USDC.e'}
                    value={isReversed ? amount : usdceAmount}
                    onChange={(value) => handleAmountChange(value, !isReversed)}
                    onMaxClick={() => handleAmountChange(balance, !isReversed)}
                  />
                </div>

                  <button
                    className="w-full py-4 mt-8 bg-primary hover:brightness-110 rounded-lg transition-colors disabled:opacity-50 text-black font-medium text-lg"
                    onClick={convert}
                    disabled={!account || !amount || isConverting}
                  >
                    {isConverting ? 'Converting...' : `Convert to ${isReversed ? tokens.find(t => t.id === selectedToken)?.name ?? '' : 'USDC.e'}`}
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <button
              className={`${isMobileView ? 'hidden' : 'block'} px-12 py-4 ${
                amount ? 'bg-[#0AB7D4] hover:brightness-110' : 'bg-[#226978]'
              } rounded-lg transition-colors disabled:opacity-50 text-black font-medium text-lg`}
              onClick={convert}
              disabled={!account || !amount || isConverting}
            >
              {isConverting ? 'Converting...' : `Convert to ${isReversed ? tokens.find(t => t.id === selectedToken)?.name ?? '' : 'USDC.e'}`}
            </button>
          </div>
        </div>
        <p className="text-center text-sm text-gray-400 mt-4 px-4">
          Convert tokens with 1:1 ratio
        </p>
      </main>
    </div>
  );
};

export default App;
