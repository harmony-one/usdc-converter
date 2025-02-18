// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "forge-std/Test.sol";
import "@contracts/TokenConverter.sol";
import "@contracts/Token.sol";

contract TokenConverterTest is Test {
    Token public outputToken;
    Token public inputToken1;
    Token public inputToken2;
    TokenConverter public tokenConverter;

    address public user = address(0x123);

    function setUp() public {
        // Deploy tokens with different decimals
        outputToken = new Token();
        outputToken.initialize("Output Token", "OUT", 18);

        inputToken1 = new Token();
        inputToken1.initialize("Input Token 1", "IN1", 6);

        inputToken2 = new Token();
        inputToken2.initialize("Input Token 2", "IN2", 8);

        address[] memory t = new address[](2);

        t[0] = address(inputToken1);
        t[1] = address(inputToken2);

        // Deploy TokenConverter
        tokenConverter = new TokenConverter(t, address(outputToken));

        // Transfer minting rights of the output token to the TokenConverter contract
        outputToken.transferOwnership(address(tokenConverter));

        // Assign some tokens to the user and set approval
        inputToken1.mint(user, 1000 * 10**6);
        inputToken2.mint(user, 1000 * 10**8);
        vm.prank(user);
        inputToken1.approve(address(tokenConverter), type(uint256).max);
        vm.prank(user);
        inputToken2.approve(address(tokenConverter), type(uint256).max);
    }

    function testConvertInputToken1() public {
        uint256 amount = 100 * 10**6;

        assertEq(inputToken1.balanceOf(user), 1000 * 10**6);
        assertEq(outputToken.balanceOf(user), 0);

        vm.prank(user);
        tokenConverter.convert(address(inputToken1), amount);

        uint8 inputDecimals = inputToken1.decimals();
        uint8 outputDecimals = outputToken.decimals();
        uint256 expectedOutput = amount * 10 ** (outputDecimals - inputDecimals);

        assertEq(inputToken1.balanceOf(user), 900 * 10**6);
        assertEq(outputToken.balanceOf(user), expectedOutput);
    }

    function testConvertInputToken2() public {
        uint256 amount = 200 * 10**8;

        assertEq(inputToken2.balanceOf(user), 1000 * 10**8);
        assertEq(outputToken.balanceOf(user), 0);

        vm.prank(user);
        tokenConverter.convert(address(inputToken2), amount);

        uint8 inputDecimals = inputToken2.decimals();
        uint8 outputDecimals = outputToken.decimals();
        uint256 expectedOutput = amount * 10 ** (outputDecimals - inputDecimals);

        assertEq(inputToken2.balanceOf(user), 800 * 10**8);
        assertEq(outputToken.balanceOf(user), expectedOutput);
    }

    function testRevertWhenUnsupportedToken() public {
        Token unsupportedToken = new Token();
        unsupportedToken.initialize("Unsupported Token", "UNSUP", 6);
        unsupportedToken.mint(user, 1000 * 10**6);

        vm.prank(user);
        unsupportedToken.approve(address(tokenConverter), 100 * 10**6);

        // Verify that attempting to convert an unsupported token fails
        vm.prank(user);
        vm.expectRevert("Input token not supported");
        tokenConverter.convert(address(unsupportedToken), 100 * 10**6);
    }

    function testAddAndRemoveSupportedToken() public {
        Token newToken = new Token();
        newToken.initialize("New Token", "NEW", 4);
        newToken.mint(user, 1000 * 10**4);

        // Attempting to convert initially fails as the token is unsupported
        vm.prank(user);
        vm.expectRevert("Input token not supported");
        tokenConverter.convert(address(newToken), 100 * 10**4);

        // Add the token to the supported list
        tokenConverter.addSupportedToken(address(newToken));

        // Conversion should now succeed
        vm.prank(user);
        newToken.approve(address(tokenConverter), 100 * 10**4);
        vm.prank(user);
        tokenConverter.convert(address(newToken), 100 * 10**4);

        uint8 inputDecimals = newToken.decimals();
        uint8 outputDecimals = outputToken.decimals();
        uint256 expectedOutput = 100 * 10**4 * 10 ** (outputDecimals - inputDecimals);

        assertEq(newToken.balanceOf(user), 900 * 10**4);
        assertEq(outputToken.balanceOf(user), expectedOutput);

        // Remove the token from the supported list
        tokenConverter.removeSupportedToken(address(newToken));

        // Attempting to convert again fails
        vm.prank(user);
        vm.expectRevert("Input token not supported");
        tokenConverter.convert(address(newToken), 100 * 10**4);
    }
}