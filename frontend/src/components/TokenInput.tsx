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
      <div>
        <span className="block text-sm text-gray-400 mb-2">{label}</span>
        <div className={"relative flex flex-row justify-between"}>
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-[#222] rounded-lg p-4 pr-16 text-lg"
          />
          <button
            className="absolute text-sm text-secondary"
            onClick={onMaxClick}
            style={{ right: '20px', top: '18px' }}
          >
            max
          </button>
        </div>
      </div>
    </div>
  );
};
