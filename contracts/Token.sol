// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    // Initialize contract with 1 million tokens minted to the creator of the contract
    constructor() ERC20("Wrapped Electroneum", "WETH") {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }
}
