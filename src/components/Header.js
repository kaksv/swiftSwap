import React, { useState, useEffect,  } from 'react'
import { Input, Popover, Radio, Modal, message } from "antd";
import {
  ArrowDownOutlined,
  DownOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import tokenList from "../tokenList.json";
import axios from "axios";
import { ethers } from 'ethers';
import tokenAbi from '../contracts/erc20Abi.mjs';
import { Link } from 'react-router-dom';
import Logo from '../swiftswap.jpg'
import Etn from '../Etn.png'



function Header() {
   
    const [copyButtonState, setCopyButtonState] = useState('copy');
    const [copyButtonStateTx, setCopyButtonStateTx] = useState('copy');
    const [account, setAccount] = useState('');
    const [provider, setProvider] = useState(null);
    const [balance, setBalance] = useState('');
  

    const [amount, setAmount] = useState('');
    const [txStatus, setTxStatus] = useState('');
    const [etheBalanceChange, setEtheBalanceChange] = useState(false);

    const sepoliaUsdcAddress = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238';
    const baseSepoliaUsdcAddress = '0x036CbD53842c5426634e7929541eC2318f3dCF7e';

    const [slippage, setSlippage] = useState(2.5);
    const [tokenOneAmount, setTokenOneAmount] = useState(null);
    const [tokenTwoAmount, setTokenTwoAmount] = useState(null);
    const [tokenOne, setTokenOne] = useState(tokenList[0]);
    const [tokenTwo, setTokenTwo] = useState(tokenList[1]);
    const [isOpen, setIsOpen] = useState(false);
    const [changeToken, setChangeToken] = useState(1);
    const [prices, setPrices] = useState(null);

    function handleSlippageChange(e) {
      setSlippage(e.target.value);
    }

    function changeAmount(e) {
      setTokenOneAmount(e.target.value);
      if(e.target.value && prices) {
        setTokenTwoAmount((e.target.value * prices.ratio).toFixed(2))
      }else {
        setTokenTwoAmount(null);
      }
    }

    function switchTokens(){
      setPrices(null);
      setTokenOneAmount(null);
      setTokenTwoAmount(null);
      const one  = tokenOne;
      const two = tokenTwo;
      setTokenOne(two);
      setTokenTwo(one);
      // fetchPrices(two.address, one.address);
    }

    function openModal(asset) {
        setChangeToken(asset);
        setIsOpen(true);
    }

    function modifyToken(i) {
      setPrices(null);
      setTokenOneAmount(null);
      setTokenTwoAmount(null);
      if (changeToken === 1) {
        setTokenOne(tokenList[i]);
        // fetchPrices(tokenList[i].address, tokenTwo.address)
      }else {
        setTokenTwo(tokenList[i]);
        // fetchPrices(tokenOne.address, tokenList[i].address)
      }
      setIsOpen(false);
    }

    // async function fetchPrices(one, two) {
    // const res =   await axios.get(`http://localhost:3001/tokenPrice`, {
    //   params: {addressOne: one, addressTwo: two }
    // })

    // console.log(res.data);
    // setPrices(res.data);
    // }

    // useEffect(() => {

    //   // fetchPrices(tokenList[0].address, tokenList[1].address);
    // }, [])

    const settings = (
      <>
      <div>Slippage Tolerance</div>
      <div>
        <Radio.Group value={slippage} onChange={handleSlippageChange}>
            <Radio.Button value={0.5}>0.5%</Radio.Button>
            <Radio.Button value={1}>2.5%</Radio.Button>
            <Radio.Button value={2}>5.0%</Radio.Button>
        </Radio.Group>
      </div>
      </>
    )
 
    useEffect(() => {
        
            if(window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            setProvider(provider);
            }else {
                alert('Please install MetaMask or Electroneum Compatible Wallet');
                console.log('No wallet found');
            }
        
    }, []);

    const connectWallet = async () => {
        try {
        const accounts = await provider.send('eth_requestAccounts', []);
        
        setAccount(accounts[0]);
        updateBalance(accounts[0]);
        
    } catch (error) {
        console.error('Error connecting to wallet:', error);
    }
    };

    const updateBalance = async (account) => {
        const balance = await provider.getBalance(account); //get Eth Balance
        setBalance(ethers.utils.formatEther(balance));

        
    }

    // const copyToClipboard = () => {
    //     setCopyButtonState('copying');
    //     navigator.clipboard.writeText(account);
        
    //     setTimeout(() => {
    //         setCopyButtonState('copy');
    //     }, 2000);
    // };


  return ( 
    <>
      <header>
        <div className='leftH'> 
        <img src={Logo} alt="logo" className="logo" />
        <Link to="/" className="link">
          <div className="headerItem">Swap</div>
        </Link>

        {/* <Link to="/tokens" className="link">
          <div className="headerItem">Tokens</div>
        </Link>   */}
        </div>
        <div className='rightH'>
          <div className='headerItem'>
            <img src={Etn} alt="eth" className="eth" />
            ETN NETWORK
          </div> 
       {account ?  (     
        <div className='connectedButton'>
            <p>{account.slice(0, 3) + '...'+ account.slice(39, 42)}</p>
            {/* <p>{account}</p> */}
       </div>
         ) 
         : 
         (   
        <div className='connectButton' onClick={connectWallet } >Connect</div>   
          )}
        </div>
     </header>

     <Modal
     open={isOpen}
     footer={null}
     onCancel={() => setIsOpen(false)}
     title = "Select a token"
     >
        <div className='modalContent'>
          {tokenList?.map((e, i) => {
            return (
              <div
              className='tokenChoice'
              key={i}
              onClick={() => modifyToken(i)}
              >
                <img src={e.img} alt={e.ticker} className='tokenLogo' />
                <div className='tokenChoiceNames'>
                  <div className='tokenName'>{e.name}</div>
                  <div className='tokenTicker'>{e.ticker}</div>
                </div>
              </div>
            );
          })}
        </div>
     </Modal>


     <div className='mainWindow'>
     {/* {contextHolder} */}
      <Modal
        // open={isOpen}
        footer={null}
        // onCancel={() => setIsOpen(false)}
        title="Select a token"
      >
        <div className="modalContent">
          {tokenList?.map((e, i) => {
            return (
              <div
                className="tokenChoice"
                key={i}
                // onClick={() => modifyToken(i)}
              >
                <img src={e.img} alt={e.ticker} className="tokenLogo" />
                <div className="tokenChoiceNames">
                  <div className="tokenName">{e.name}</div>
                  <div className="tokenTicker">{e.ticker}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Modal>
     {/* The Swap widget */}
     <div className="tradeBox">
        <div className="tradeBoxHeader">
          <h4>Swap</h4>
          <Popover
            content={settings}
            title="Settings"
            trigger="click"
            placement="bottomRight"
          >
            <SettingOutlined className="cog" />
          </Popover>
        </div>
        <div className="inputs">
          <Input
            placeholder="0"
            value={tokenOneAmount}
            onChange={changeAmount}
            // disabled={!prices}
          />
          <Input 
          placeholder="0" 
          value={tokenTwoAmount} 
          // disabled={true} 
          />
          <div 
           className="switchButton"
           onClick={switchTokens}
           >
            <ArrowDownOutlined className="switchArrow" />
          </div>
          <div
           className="assetOne"
            onClick={() => openModal(1)}
            >
            <img 
            src={tokenOne.img} 
            alt="assetOneLogo" 
            className="assetLogo"
             />
            {tokenOne.ticker}
            <DownOutlined />
          </div>
          <div
           className="assetTwo"
            onClick={() => openModal(2)}
            >
            <img
             src={tokenTwo.img}
              alt="assetOneLogo"
               className="assetLogo"
                />
            {tokenTwo.ticker}
            <DownOutlined />
          </div>
        </div>
        <div 
        className="swapButton" 
        // disabled={!tokenOneAmount}
        //  onClick={fetchDexSwap}
         >
          Swap
          </div>
      </div>
      </div>
     </>

  );  
}

export default Header;

