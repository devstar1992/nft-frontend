import React, { Component } from "react";
import { HashRouter, Route } from "react-router-dom";
import "./App.css";
import Web3 from "web3";
import Freenet from "../abis/Freenet.json";

import FormAndPreview from "../components/FormAndPreview/FormAndPreview";
import AllFreenet from "./AllFreenet/AllFreenet";
import AccountDetails from "./AccountDetails/AccountDetails";
import ContractNotDeployed from "./ContractNotDeployed/ContractNotDeployed";
import ConnectToMetamask from "./ConnectMetamask/ConnectToMetamask";
import Loading from "./Loading/Loading";
import Navbar from "./Navbar/Navbar";

const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accountAddress: "",
      accountBalance: "",
      freenetContract: null,
      freenetCount: 0,
      freenet: [],
      loading: true,
      metamaskConnected: false,
      contractDetected: false,
      // totalTokensMinted: 0,
      // totalTokensOwnedByAccount: 0,
      lastMintTime: null,
    };
  }

  componentWillMount = async () => {
    await this.loadWeb3();
    await this.loadBlockchainData();
    await this.setMetaData();
    await this.setMintBtnTimer();
  };

  setMintBtnTimer = () => {
    const mintBtn = document.getElementById("mintBtn");
    if (mintBtn !== undefined && mintBtn !== null) {
      this.setState({
        lastMintTime: localStorage.getItem(this.state.accountAddress),
      });
      this.state.lastMintTime === undefined || this.state.lastMintTime === null
        ? (mintBtn.innerHTML = "Mint My Crypto Boy")
        : this.checkIfCanMint(parseInt(this.state.lastMintTime));
    }
  };

  checkIfCanMint = (lastMintTime) => {
    const mintBtn = document.getElementById("mintBtn");
    const timeGap = 300000; //5min in milliseconds
    const countDownTime = lastMintTime + timeGap;
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = countDownTime - now;
      if (diff < 0) {
        mintBtn.removeAttribute("disabled");
        mintBtn.innerHTML = "Mint My Crypto Boy";
        localStorage.removeItem(this.state.accountAddress);
        clearInterval(interval);
      } else {
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        mintBtn.setAttribute("disabled", true);
        mintBtn.innerHTML = `Next mint in ${minutes}m ${seconds}s`;
      }
    }, 1000);
  };

  loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };

  loadBlockchainData = async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    if (accounts.length === 0) {
      this.setState({ metamaskConnected: false });
    } else {
      this.setState({ metamaskConnected: true });
      this.setState({ loading: true });
      this.setState({ accountAddress: accounts[0] });
      let accountBalance = await web3.eth.getBalance(accounts[0]);
      accountBalance = web3.utils.fromWei(accountBalance, "Ether");
      this.setState({ accountBalance });
      this.setState({ loading: false });
      const networkId = await web3.eth.net.getId();
      const networkData = Freenet.networks[networkId];
      if (networkData) {
        this.setState({ loading: true });
        const freenetContract = web3.eth.Contract(
          Freenet.abi,
          networkData.address
        );
        this.setState({ freenetContract });
        this.setState({ contractDetected: true });
        const freenetCount = await freenetContract.methods
          .totalSupply()
          .call();

        this.setState({ freenetCount });
        for (var i = 0; i < freenetCount.toNumber(); i++) {

          const freenet = await freenetContract.methods
            .tokenURI(i)
            .call();
          console.log(freenet);
          this.setState({
            freenet: [...this.state.freenet, freenet],
          });
        }



        this.setState({ loading: false });
      } else {
        this.setState({ contractDetected: false });
      }
    }
  };

  connectToMetamask = async () => {
    await window.ethereum.enable();
    this.setState({ metamaskConnected: true });
    window.location.reload();
  };

  setMetaData = async () => {
    if (this.state.freenet.length !== 0) {
      // console.log(this.state.freenet);
      // this.state.freenet.map(async (cryptoboy) => {
      //   const result = await fetch(cryptoboy.tokenURI);
      //   const metaData = await result.json();
      //   this.setState({
      //     freenet: this.state.freenet.map((cryptoboy) =>
      //       cryptoboy.tokenId.toNumber() === Number(metaData.tokenId)
      //         ? {
      //             ...cryptoboy,
      //             metaData,
      //           }
      //         : cryptoboy
      //     ),
      //   });
      // });
    }
  };

  mintMyNFT = async (name, email, file) => {
    this.setState({ loading: true });
    if (name && email && file) {   
      let cid = await ipfs.add(file);
      const tokenObject = {
        fullname: name,
        email: email,
        image: cid.path  
      };
      cid = await ipfs.add(JSON.stringify(tokenObject));
      console.log(cid);
      this.state.freenetContract.methods
        .mintToken(this.state.accountAddress, cid.path)
        .send({ from: this.state.accountAddress })
        .on("confirmation", () => {
          console.log('mint');
          localStorage.setItem(this.state.accountAddress, new Date().getTime());
          this.setState({ loading: false });
        });
      this.setState({ loading: false });
    } else {
      this.setState({ loading: false });

    }
  };




  render() {
    return (
      <div className="container">
        {!this.state.metamaskConnected ? (
          <ConnectToMetamask connectToMetamask={this.connectToMetamask} />
        ) : !this.state.contractDetected ? (
          <ContractNotDeployed />
        ) : this.state.loading ? (
          <></>
        ) : (
          <>
            <HashRouter basename="/">
              <Navbar />
              <Route
                path="/"
                exact
                render={() => (
                  <AccountDetails
                    accountAddress={this.state.accountAddress}
                    accountBalance={this.state.accountBalance}
                  />
                )}
              />
              <Route
                path="/mint"
                render={() => (
                  <FormAndPreview
                    mintMyNFT={this.mintMyNFT}
                    setMintBtnTimer={this.setMintBtnTimer}
                  />
                )}
              />
              <Route
                path="/list"
                render={() => (
                  <AllFreenet
                    accountAddress={this.state.accountAddress}
                    freenet={this.state.freenet}
                    totalTokensMinted={this.state.totalTokensMinted}
                    changeTokenPrice={this.changeTokenPrice}
                    toggleForSale={this.toggleForSale}
                    buyCryptoBoy={this.buyCryptoBoy}
                  />
                )}
              />

            </HashRouter>
          </>
        )}
      </div>
    );
  }
}

export default App;
