import { FC } from 'react';

interface TokenInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onMaxClick: () => void;
  placeholder?: string;
}

export const TokenInput: FC<TokenInputProps> = ({
  label,
  value,
  onChange,
  onMaxClick,
  placeholder = '0.00'
}) => {
  return (
    <div className="bg-[#111] rounded-xl p-6">
      <div className="relative">
        <span className="block text-sm text-gray-400 mb-2">{label}</span>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-[#222] rounded-lg p-4 pr-16 text-lg"
        />
        <button 
          className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-secondary"
          onClick={onMaxClick}
        >
          max
        </button>
      </div>
    </div>
  );
};