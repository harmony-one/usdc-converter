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
        // Deploy tokens
        outputToken = new Token();
        outputToken.initialize("Output Token", "OUT");

        inputToken1 = new Token();
        inputToken1.initialize("Input Token 1", "IN1");

        inputToken2 = new Token();
        inputToken2.initialize("Input Token 2", "IN2");

        address[] memory t = new address[](2);

        t[0] = address(inputToken1);
        t[1] = address(inputToken2);

        // Deploy TokenConverter
        tokenConverter = new TokenConverter(t, address(outputToken));

        // Transfer minting rights of the output token to the TokenConverter contract
        outputToken.transferOwnership(address(tokenConverter));

        // Assign some tokens to the user and set approval
        inputToken1.mint(user, 1000 ether);
        inputToken2.mint(user, 1000 ether);
        vm.prank(user);
        inputToken1.approve(address(tokenConverter), type(uint256).max);
        vm.prank(user);
        inputToken2.approve(address(tokenConverter), type(uint256).max);
    }

    function testConvertInputToken1() public {
        uint256 amount = 100 ether;

        assertEq(inputToken1.balanceOf(user), 1000 ether);
        assertEq(outputToken.balanceOf(user), 0);

        vm.prank(user);
        tokenConverter.convert(address(inputToken1), amount);

        assertEq(inputToken1.balanceOf(user), 900 ether);
        assertEq(outputToken.balanceOf(user), amount);
    }

    function testConvertInputToken2() public {
        uint256 amount = 200 ether;

        assertEq(inputToken2.balanceOf(user), 1000 ether);
        assertEq(outputToken.balanceOf(user), 0);

        vm.prank(user);
        tokenConverter.convert(address(inputToken2), amount);

        assertEq(inputToken2.balanceOf(user), 800 ether);
        assertEq(outputToken.balanceOf(user), amount);
    }

    function testRevertWhenUnsupportedToken() public {
        Token unsupportedToken = new Token();
        unsupportedToken.initialize("Unsupported Token", "UNSUP");
        unsupportedToken.mint(user, 1000 ether);

        vm.prank(user);
        unsupportedToken.approve(address(tokenConverter), 100 ether);

        // Verify that attempting to convert an unsupported token fails
        vm.prank(user);
        vm.expectRevert("Input token not supported");
        tokenConverter.convert(address(unsupportedToken), 100 ether);
    }

    function testAddAndRemoveSupportedToken() public {
        Token newToken = new Token();
        newToken.initialize("New Token", "NEW");
        newToken.mint(user, 1000 ether);

        // Attempting to convert initially fails as the token is unsupported
        vm.prank(user);
        vm.expectRevert("Input token not supported");
        tokenConverter.convert(address(newToken), 100 ether);

        // Add the token to the supported list
        tokenConverter.addSupportedToken(address(newToken));

        // Conversion should now succeed
        vm.prank(user);
        newToken.approve(address(tokenConverter), 100 ether);
        vm.prank(user);
        tokenConverter.convert(address(newToken), 100 ether);

        assertEq(newToken.balanceOf(user), 900 ether);
        assertEq(outputToken.balanceOf(user), 100 ether);

        // Remove the token from the supported list
        tokenConverter.removeSupportedToken(address(newToken));

        // Attempting to convert again fails
        vm.prank(user);
        vm.expectRevert("Input token not supported");
        tokenConverter.convert(address(newToken), 100 ether);
    }
}
