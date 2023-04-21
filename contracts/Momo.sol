//SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract Momo is ERC20 {
    constructor(string memory name, string memory symbol, uint256 initial) ERC20(name, symbol) {
        _mint(msg.sender, initial);
    }
}
