import React, { Component, useEffect, useState } from 'react';
import logo from '../logo.png';
import './App.css';
import Web3 from 'web3'
import Token from '../abis/Token.json'
import EthSwap from '../abis/EthSwap.json'

const App = () =>  {

  useEffect(async()=>{
   await loadWeb3()
  //  console.log(window.web3)
  await loadWeb3Data()
  })

  const loadWeb3 = async() => {
    if(window.ethereum){
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }else if(window.web3){
      window.web3 = new Web3(window.web3.currentProvider)
    }else{
      window.alert('Non-Ethereum browser detected. YOu should consider trying MetaMask')
    }
  }

  // const [balanceEth, setbalanceEth] = useState('0')
  // const [account, setAccount] = useState()
  let account 
  let balanceEth
  const loadWeb3Data = async() =>{
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    const balance = await web3.eth.getBalance(accounts[0])
    // setbalanceEth(balance.toString())
    // setAccount(accounts[0])
    account = accounts[0]
    balanceEth = balance.toString()
    console.log(accounts[0], balance.toString())
    const abi = Token.abi
    const networkId = await web3.eth.net.getId()
    const tokenData = Token.networks[networkId]
    if(tokenData){
      const token = new web3.eth.Contract(abi, tokenData.address)
      const tokenBalance = await token.methods.balanceOf(account).call()
      console.log('token balance', tokenBalance.toString())
    }else{
      window.alert('Token contract not deployed to detected network')
    }

    const ethSwapAbi = EthSwap.abi
    const ethSwapData = EthSwap.networks[networkId]
    if(ethSwapData){
      const ethSwap = new web3.eth.Contract(ethSwapAbi, ethSwapData.address)
      // const tokenBalance = await ethSwap.methods.balanceOf(account).call()
      // console.log('token balance', tokenBalance.toString())
    }else{
      window.alert('Token contract not deployed to detected network')
    }

  }

    return (
      <div style={{display:'flex', alignItems:'center', justifyContent:'center', height:'100vh'}}>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
            Swap Token
          </a>
        </nav>
        {account?<div
          style={{width:'50%', padding:12, background:'red', fontFamily:'monospace', borderRadius:20,textAlign:'center', color:'white'}}>
            CONNECT TO WALLET
        </div>:
        <div 
        style={{width:'50%', padding:12, background:'green', fontFamily:'monospace', borderRadius:20,textAlign:'center', color:'white'}}>
          {balanceEth}
      </div>
        }
      </div>
    );
  }


export default App;
