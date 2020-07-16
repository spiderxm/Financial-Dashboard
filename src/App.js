import React, {Component} from 'react';
import './App.css';
import axios from "axios";
import Plotly from "plotly.js-dist";
import {std, mean} from 'mathjs'
import sma from 'sma'


class App extends Component {

    state = {
        ticker: null,
        hidden1: true,
        hidden2: true,
        hidden3: true,
        visible: true

    }
    ontickerchangeHandler = (event) => {
        this.setState({ticker: event.target.value.toString().toUpperCase()})
    }

    financialDashboard = (event) => {
        event.preventDefault();
        this.setState({visible: false});
        this.setState({hidden1: true, hidden2: true, hidden3: true})
        let low = [], high = [], close = [], open = [], volume = [], date;
        axios.get("https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" + this.state.ticker + "&outputsize=full&apikey=9O8KE4AAY96A5AKK")
            .then(res => {
                let data = res.data['Time Series (Daily)']
                date = Object.keys(data);
                for (let i = 0; i < date.length; i++) {
                    open[i] = data[date[i]]['1. open'];
                    high[i] = data[date[i]]['2. high'];
                    low[i] = data[date[i]]['3. low'];
                    close[i] = data[date[i]]['4. close'];
                    volume[i] = data[date[i]]['5. volume'];
                }
                console.log(std(high))
                var layout = {
                    width: 1440,
                };
                var DATA = [
                    {
                        x: date,
                        y: open,
                        type: 'scatter',
                    }
                ];

                Plotly.newPlot('daily-open', DATA, layout);
                var DATA = [
                    {
                        x: date,
                        y: sma(open, 7),
                        type: 'scatter',
                    }
                ];
                Plotly.newPlot('daily-openMa', DATA, layout);
                let ma1 = sma(volume, 7)
                console.log(ma1)
                var DATA = [
                    {
                        x: date,
                        y: ma1,
                        type: 'scatter',
                    }
                ];

                Plotly.newPlot('daily-volumeMa', DATA, layout);

                var DATA = [
                    {
                        x: date,
                        y: volume,
                        type: 'scatter',
                    }
                ];

                Plotly.newPlot('daily-volume', DATA, layout);
                var trace = {
                    x: date.reverse(),
                    close: close.reverse(),
                    decreasing: {line: {color: '#7F7F7F'}},
                    high: high.reverse(),
                    increasing: {line: {color: '#17BECF'}},
                    line: {color: 'rgba(31,119,180,1)'},
                    low: low.reverse(),
                    open: open.reverse(),
                    type: 'candlestick',
                    xaxis: 'x',
                    yaxis: 'y'
                };
                var layout = {
                    dragmode: 'zoom',
                    width: 1440,
                    margin: {
                        r: 10,
                        t: 25,
                        b: 40,
                        l: 60
                    },
                    showlegend: false,
                    xaxis: {
                        autorange: true,
                        domain: [0, 1],
                        range: [date[0], date[date.length - 1]],
                        rangeslider: {range: [date[0], date[date.length - 1]]},
                        title: 'Date',
                        type: 'date'
                    },
                    yaxis: {
                        autorange: true,
                        domain: [0, 1],
                        type: 'linear'
                    }
                };
                var data1 = [trace];
                Plotly.newPlot('myDiv', data1, layout);
                this.setState({hidden1: false})
            });
        axios.get("https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=" + this.state.ticker + "&apikey=9O8KE4AAY96A5AKK")
            .then(res => {
                let low = [], high = [], close = [], open = [], volume = [];
                let data = res.data['Weekly Time Series']
                date = Object.keys(data);
                for (let i = 0; i < date.length; i++) {
                    open[i] = data[date[i]]['1. open'];
                    high[i] = data[date[i]]['2. high'];
                    low[i] = data[date[i]]['3. low'];
                    close[i] = data[date[i]]['4. close'];
                    volume[i] = data[date[i]]['5. volume'];
                }
                var layout = {
                    width: 1440,
                };
                var DATA = [
                    {
                        x: date,
                        y: open,
                        type: 'scatter',
                    }
                ];
                Plotly.newPlot('weekly-open', DATA, layout);
                var DATA = [
                    {
                        x: date,
                        y: close,
                        type: 'scatter',
                    }
                ];
                Plotly.newPlot('weekly-close', DATA, layout);
                var DATA = [
                    {
                        x: date,
                        y: low,
                        type: 'scatter',
                    }
                ];
                Plotly.newPlot('weekly-low', DATA, layout);
                var DATA = [
                    {
                        x: date,
                        y: high,
                        type: 'scatter',
                    }
                ];
                Plotly.newPlot('weekly-high', DATA, layout);
                var DATA = [
                    {
                        x: date,
                        y: volume,
                        type: 'scatter',
                    }
                ];
                Plotly.newPlot('weekly-volume', DATA, layout);
                this.setState({hidden2: false})

            })
            .catch(err => console.log(err))
        axios.get("https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=" + this.state.ticker + "&interval=5min&apikey=9O8KE4AAY96A5AKK")
            .then(res => {

                let low = [], high = [], close = [], open = [], volume = [];
                console.log("https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=" + this.state.ticker + "&interval=5min&apikey=9O8KE4AAY96A5AKK")
                let data = res.data['Time Series (5min)']
                date = Object.keys(data);
                console.log(date.reverse())
                for (let i = 0; i < date.length; i++) {
                    open[i] = parseFloat(data[date[i]]['1. open']).toFixed(2);
                    high[i] = parseFloat(data[date[i]]['2. high']).toFixed(2);
                    low[i] = parseFloat(data[date[i]]['3. low']).toFixed(2);
                    close[i] = parseFloat(data[date[i]]['4. close']).toFixed(2);
                    volume[i] = parseFloat(data[date[i]]['5. volume']).toFixed(0);
                }
                console.log(open)
                var trace = {
                    x: date.reverse(),
                    close: close.reverse(),
                    decreasing: {line: {color: '#DC143C'}},
                    high: high.reverse(),
                    increasing: {line: {color: '#2E8B57'}},
                    line: {color: 'rgba(31,119,180,1)'},
                    low: low.reverse(),
                    open: open.reverse(),
                    type: 'candlestick',
                    xaxis: 'x',
                    yaxis: 'y'
                };
                var layout = {
                    dragmode: 'zoom',
                    width: 1440,
                    margin: {
                        r: 10,
                        t: 25,
                        b: 40,
                        l: 60
                    },
                    showlegend: false,
                    xaxis: {
                        autorange: true,
                        domain: [0, 1],
                        range: [date[0], date[date.length - 1]],
                        rangeslider: {range: [date[0], date[date.length - 1]]},
                        title: 'Date',
                        type: 'date'
                    },
                    yaxis: {
                        autorange: true,
                        domain: [0, 1],
                        type: 'linear'
                    }
                };
                var data1 = [trace];
                Plotly.newPlot('myDiv1', data1, layout);
                this.setState({hidden3: false})
            })
            .catch(err => console.log(err))
        console.log(this.state.ticker);
    }


    render() {
        const style = {
            border: "1px solid grey",
            borderRadius: "20px",
            padding: "1rem",
            textAlign: "center",
            margin: "auto",
            boxShadow: "0px 2px 11px 6px rgba(0,0,0,.3)",
            backgroundColor: "rgba(0,0,0,.85)",
            color: "white",
            marginBottom: "5rem",
            width: '450px'
        }
        let hidden = true;
        if (!this.state.hidden1 && !this.state.hidden2 && !this.state.hidden3) {
            hidden = false;
        }
        let visible = true;
        if (this.state.visible) {
            visible = true;
        } else {
            visible = !hidden
        }
        console.log(visible)
        return (
            <React.Fragment>
                <header>
                    <img
                        src="https://storage.cloud.google.com/applevggh/Financial-chart-economic-graph-analysis-512.png"
                        alt={"icon"}/>
                    <nav>
                        <li><a>Financial Dashboard</a></li>
                    </nav>
                </header>
                <div className="ui container left aligned" style={style}>
                    <form onSubmit={this.financialDashboard}>
                        <div className="field">
                            <h1>Enter Ticker</h1>
                            <div className="ui large icon input">
                                <input onChange={this.ontickerchangeHandler} placeholder={'AMZN'}
                                       value={this.state.ticker}
                                       required={true}/>
                                <i className="inverted circular search link icon" onClick={this.financialDashboard}></i>
                            </div>
                        </div>
                        <button hidden="hidden" style={{display: "none"}} className="ui button basic inverted"
                                type={"submit"}> Get financial data
                        </button>
                    </form>
                </div>
                <div className="ui segment" hidden={visible} style={{height: '400px'}}>
                    <div className="ui active inverted dimmer">
                        <div className="ui large text loader">Loading</div>
                    </div>
                </div>
                <div hidden={hidden}>
                    <h1>Daily plots</h1>
                    <div id='myDiv1' hidden={hidden}></div>
                    <div className="ui section divider"></div>
                    <div style={{textAlign: "center"}}>
                        <h2>Candle</h2>
                        <div id='myDiv'></div>
                        <div className="ui section divider"></div>
                    </div>
                    <div style={{textAlign: "center"}}>
                        <h2>Daily open</h2>
                        <div id='daily-open'></div>
                        <div className="ui section divider"></div>
                    </div>
                    <h2>Daily open MA</h2>
                    <div id='daily-openMa'></div>
                    <div className="ui section divider"></div>
                    <h2>Daily Volume MA</h2>
                    <div id='daily-volumeMa'></div>
                    <div className="ui section divider"></div>
                    <div style={{textAlign: "center"}}>
                        <h2>Daily Volume</h2>
                        <div id='daily-volume'></div>
                        <div className="ui section divider"></div>
                    </div>
                    <div style={{textAlign: "center"}}>
                        <h2>Weekly high</h2>
                        <div id='weekly-high'></div>
                        <div className="ui section divider"></div>
                    </div>
                    <div style={{textAlign: "center"}}>
                        <h2>Weekly low</h2>
                        <div id='weekly-low'></div>
                        <div className="ui section divider"></div>
                    </div>
                    <div style={{textAlign: "center"}}>
                        <h2>Weekly close</h2>
                        <div id='weekly-close'></div>
                        <div className="ui section divider"></div>
                    </div>
                    <div style={{textAlign: "center"}}>
                        <h2>Weekly open</h2>
                        <div id='weekly-open'></div>
                        <div className="ui section divider"></div>
                    </div>
                    <div style={{textAlign: "center"}}>
                        <h2>Weekly volume traded</h2>
                        <div id='weekly-volume'></div>
                    </div>
                </div>

            </React.Fragment>
        )
    }
}

export default App;
