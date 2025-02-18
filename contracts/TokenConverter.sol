// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

interface MintableToken {
    function mint(address to, uint256 amount) external;
}

interface IERC20Decimals is IERC20 {
    function decimals() external view returns (uint8);
}

contract TokenConverter is Ownable {
    using SafeERC20 for IERC20;

    mapping(address => bool) public supportedTokens;

    MintableToken public outputToken;
    uint8 public outputTokenDecimals;

    event TokenConverted(address indexed user, address indexed inputToken, uint256 inputAmount, uint256 outputAmount);
    event OutputTokenUpdated(address indexed previousToken, address indexed newToken);
    event SupportedTokenAdded(address indexed token);
    event SupportedTokenRemoved(address indexed token);

    constructor(address[] memory inputTokens, address outputTokenAddress) Ownable(msg.sender) {
        require(outputTokenAddress != address(0), "Output token address cannot be zero");
        outputToken = MintableToken(outputTokenAddress);
        outputTokenDecimals = IERC20Decimals(outputTokenAddress).decimals();

        for (uint256 i = 0; i < inputTokens.length; i++) {
            require(inputTokens[i] != address(0), "Input token address cannot be zero");
            supportedTokens[inputTokens[i]] = true;
        }
    }

    function addSupportedToken(address token) external onlyOwner {
        require(token != address(0), "Token address cannot be zero");
        supportedTokens[token] = true;
        emit SupportedTokenAdded(token);
    }

    function removeSupportedToken(address token) external onlyOwner {
        require(supportedTokens[token], "Token not supported");
        supportedTokens[token] = false;
        emit SupportedTokenRemoved(token);
    }

    function setOutputToken(address newOutputToken) external onlyOwner {
        require(newOutputToken != address(0), "Output token address cannot be zero");
        address previousToken = address(outputToken);
        outputToken = MintableToken(newOutputToken);
        outputTokenDecimals = IERC20Decimals(newOutputToken).decimals();
        emit OutputTokenUpdated(previousToken, newOutputToken);
    }

    function convert(address inputToken, uint256 amount) external {
        require(supportedTokens[inputToken], "Input token not supported");
        require(amount > 0, "Amount must be greater than zero");

        IERC20(inputToken).safeTransferFrom(msg.sender, address(this), amount);

        uint8 inputDecimals = IERC20Decimals(inputToken).decimals();
        uint256 normalizedAmount = _normalizeAmount(amount, inputDecimals, outputTokenDecimals);

        outputToken.mint(msg.sender, normalizedAmount);

        emit TokenConverted(msg.sender, inputToken, amount, normalizedAmount);
    }

    function _normalizeAmount(uint256 amount, uint8 inputDecimals, uint8 targetDecimals) internal pure returns (uint256) {
        if (inputDecimals == targetDecimals) {
            return amount;
        } else if (inputDecimals > targetDecimals) {
            return amount / 10 ** (inputDecimals - targetDecimals);
        } else {
            return amount * 10 ** (targetDecimals - inputDecimals);
        }
    }
}