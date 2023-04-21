//SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./NewMonkey.sol";
import "./Momo.sol";

contract Presale is Ownable {
    NewMonkey public newMonkey;
    Momo public momo;

    constructor(NewMonkey _newMonkey, Momo _momo) {
        newMonkey = _newMonkey;
        momo = _momo;
    }

    function buy(string memory name) public {
        newMonkey.mint(msg.sender, name);
        require(newMonkey.totalSupply() <= 5, "Presale is over");
        momo.transferFrom(msg.sender, owner(), 1 ether);
    }
}
