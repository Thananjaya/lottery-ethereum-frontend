import React, { Component } from "react";
import "./App.css";
import web3 from "./web3";
import lottery from "./lottery";

class App extends Component {
  state = {
    accounts: [],
    manager: null,
    players: [],
    balance: "",
    amount: "",
    message: ""
  };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getAllPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    const accounts = await web3.eth.getAccounts();
    this.setState({ manager, players, balance, accounts });
  }

  onEnter = async () => {
    this.setState({
      message: "Waiting for the transaction to be success!!..."
    });
    await lottery.methods.enterLottery().send({
      from: this.state.accounts[0],
      value: web3.utils.toWei(this.state.amount, "ether")
    });
    const players = await lottery.methods.getAllPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({
      balance,
      players,
      amount: "",
      message: "Transaction is success and you have entered the lottery!!..."
    });
  };

  pickWinner = async () => {
    await lottery.methods.pickWinner().send({
      from: this.state.accounts[0]
    });
  };

  pickWinnerDetails = () => {
    return (
      <div>
        <hr />
        <h3>Pick a winner !!</h3>
        <button onClick={() => this.pickWinner()}>Pick a winner!!</button>
      </div>
    );
  };

  render() {
    return (
      <div className="App">
        <h2>Lottery App using Ethereum</h2>
        <p>
          This Lottery application is managed by {this.state.manager}.<br />
          There are currently {this.state.players.length} players competing for{" "}
          {web3.utils.fromWei(this.state.balance, "ether")} ethers!!
        </p>
        <hr />
        <h3>Want to try ??</h3>
        <p>
          {" "}
          Please provide the amount of Ether ( note: minimum contribution should
          be greater than .01 ether ){" "}
        </p>
        <input
          onChange={event => this.setState({ amount: event.target.value })}
        />
        <button onClick={() => this.onEnter()}> Enter </button>
        <p>{this.state.message}</p>
        {this.state.manager === this.state.accounts[0]
          ? this.pickWinnerDetails()
          : null}
      </div>
    );
  }
}

export default App;
