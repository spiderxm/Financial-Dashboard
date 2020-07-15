import React, {Component} from 'react';
import './App.css';
import Daily from "./Components/Daily";
import Weekly from "./Components/Weekly";
import Fivemin from "./Components/5min";

class App extends Component {
    state = {
        ticker: null,
        content: null
    }
    ontickerchangeHandler = (event) => {
        this.setState({ticker: event.target.value.toString().toUpperCase()})
    }
    financialDashboard = (event) => {
        event.preventDefault();
        console.log(this.state.ticker);
        let cont = (
            <React.Fragment>
                <Daily ticker={this.state.ticker}></Daily>
                <Weekly ticker={this.state.ticker}></Weekly>
                <Fivemin ticker={this.state.ticker}/>
            </React.Fragment>
        );
        this.setState({content: cont});

    }

    render() {
        let cont = this.state.content;

        return (
            <React.Fragment>
                <div>Finance Dashboard</div>
                <form onSubmit={this.financialDashboard}>
                    <input onChange={this.ontickerchangeHandler} value={this.state.ticker} required={true}/>
                    <button type={"submit"}> Get financial data</button>
                </form>
                <div id='myDiv'></div>
                {cont}
            </React.Fragment>
        )
    }
}

export default App;
