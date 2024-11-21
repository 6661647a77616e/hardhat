//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

contract Token{
    string public name = "My Hardhat Token";
    string public symbol = "MHT";

    uint256 public totalSupply = 1000000;

    address public owner; //store eth accounts

    mapping(address => uint256) balances; //store each account's balance.

    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    constructor(){
        balances[msg.sender] = totalSupply; //assign totalSupply to transaction sender
        owner = msg.sender;
    }

    function transfer(address to, uint256 amount) external {
        require(balances[msg.sender] >= amount, "Not enough tokens, the transaction will be revert");

        balances[msg.sender] -= amount;
        balances[to] += amount;

        //notify off-chain applications of the transfer
        emit Transfer(msg.sender, to, amount);
    }

    function balanceOf(address account) external view returns(uint256){
        return balances[account];
    }
}
