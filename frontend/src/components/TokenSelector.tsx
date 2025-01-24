import { FC } from 'react';
import { RadioGroup } from '@headlessui/react';
import { Token } from '@/types';

interface TokenSelectorProps {
  tokens: Token[];
  selectedToken: string;
  onChange: (value: string) => void;
}

export const TokenSelector: FC<TokenSelectorProps> = ({
  tokens,
  selectedToken,
  onChange
}) => {
  return (
    <RadioGroup 
      value={selectedToken} 
      onChange={onChange}
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
  );
};