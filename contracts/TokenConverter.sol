// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

interface MintableToken {
    function mint(
        address to,
        uint256 amount
    ) external;
}

contract TokenConverter is Ownable {
    using SafeERC20 for IERC20;

    mapping(address => bool) public supportedTokens;

    MintableToken public outputToken;

    event TokenConverted(address indexed user, address indexed inputToken, uint256 amount);
    event OutputTokenUpdated(address indexed previousToken, address indexed newToken);
    event SupportedTokenAdded(address indexed token);
    event SupportedTokenRemoved(address indexed token);

    constructor(address[] memory inputTokens, address outputTokenAddress) Ownable(msg.sender) {
        require(outputTokenAddress != address(0), "Output token address cannot be zero");
        outputToken = MintableToken(outputTokenAddress);

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
        emit OutputTokenUpdated(previousToken, newOutputToken);
    }

    function convert(address inputToken, uint256 amount) external {
        require(supportedTokens[inputToken], "Input token not supported");
        require(amount > 0, "Amount must be greater than zero");

        IERC20(inputToken).safeTransferFrom(msg.sender, address(this), amount);

        outputToken.mint(msg.sender, amount);

        emit TokenConverted(msg.sender, inputToken, amount);
    }
}
