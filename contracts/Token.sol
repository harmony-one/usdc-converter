// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract Token is ERC20Upgradeable, OwnableUpgradeable {
    uint8 _decimals;

    function initialize(
        string memory name,
        string memory symbol,
        uint8 decimals_
    ) public initializer {
        __ERC20_init(name, symbol);
        __Ownable_init(msg.sender);
        _decimals = decimals_;
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function burn(address to, uint256 amount) public onlyOwner {
        _burn(to, amount);
    }

    function decimals() public view override returns (uint8) {
        return _decimals;
    }
}
