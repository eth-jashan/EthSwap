pragma solidity ^0.5.0;

import "./Token.sol";

contract EthSwap {
    string public name = 'EthSwap Instant Exchange';
    Token public token;
    uint public rate = 100;

    event tokenPurchase(
        address account,
        address token,
        uint amount,
        uint rate
    );

    event tokenSold(
        address account,
        address token,
        uint amount,
        uint rate
    );
    

    constructor(Token _token)public{
        token = _token;
    }

    function buyTokens () public payable {
        //Calculate the number of tokens to buy
        uint tokenAmount = msg.value * rate;
        require(token.balanceOf(address(this)) >= tokenAmount,'Not enough tokens left');
        token.transfer(msg.sender, tokenAmount);
        emit tokenPurchase(msg.sender, address(token), tokenAmount, rate);
    }

    function sellTokens (uint _amount) public payable {
        //uset should have enough balance for transfer
        require(token.balanceOf(msg.sender) >= _amount,'Not enough tokens left in address');
        //Calculate the number of tokens to buy
        uint etherAmount = _amount / rate;
        require(address(this).balance >= etherAmount,'Not enough ether left');
        token.transferFrom(msg.sender, address(this), _amount);
        msg.sender.transfer(etherAmount);
        emit tokenSold(msg.sender, address(token), _amount, rate);
    }
}