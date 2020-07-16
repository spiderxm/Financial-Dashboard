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

    }
    ontickerchangeHandler = (event) => {
        this.setState({ticker: event.target.value.toString().toUpperCase()})
    }

    financialDashboard = (event) => {
        event.preventDefault();
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
                    width: '100%',
                };
                var DATA = [
                    {
                        x: date,
                        y: open,
                        type: 'scatter',
                    }
                ];

                Plotly.newPlot('daily-open', DATA, layout);
                let ma1 = sma(volume, 7)
                console.log(ma1)
                var DATA = [
                    {
                        x: date,
                        y: ma1,
                        type: 'scatter',
                    }
                ];

                Plotly.newPlot('daily-volumeMa', DATA);

                var DATA = [
                    {
                        x: date,
                        y: volume,
                        type: 'scatter',
                    }
                ];

                Plotly.newPlot('daily-volume', DATA);
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

                var DATA = [
                    {
                        x: date,
                        y: open,
                        type: 'scatter',
                    }
                ];
                Plotly.newPlot('weekly-open', DATA);
                var DATA = [
                    {
                        x: date,
                        y: close,
                        type: 'scatter',
                    }
                ];
                Plotly.newPlot('weekly-close', DATA);
                var DATA = [
                    {
                        x: date,
                        y: low,
                        type: 'scatter',
                    }
                ];
                Plotly.newPlot('weekly-low', DATA);
                var DATA = [
                    {
                        x: date,
                        y: high,
                        type: 'scatter',
                    }
                ];
                Plotly.newPlot('weekly-high', DATA);
                var DATA = [
                    {
                        x: date,
                        y: volume,
                        type: 'scatter',
                    }
                ];
                Plotly.newPlot('weekly-volume', DATA);
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
                    decreasing: {line: {color: '#ffcccb'}},
                    high: high.reverse(),
                    increasing: {line: {color: '#90EE90'}},
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
        let cont = this.state.content;
        let hidden = true;
        if (!this.state.hidden1 && !this.state.hidden2 && !this.state.hidden3) {
            hidden = false;
        }
        return (
            <React.Fragment>
                <div>Finance Dashboard</div>
                <form onSubmit={this.financialDashboard}>
                    <input onChange={this.ontickerchangeHandler} value={this.state.ticker} required={true}/>
                    <button type={"submit"}> Get financial data</button>
                </form>
                <h1 hidden={hidden}>Daily plots</h1>
                <div id='myDiv1' hidden={hidden}></div>
                <h2>Candle</h2>
                <div id='myDiv'></div>
                <h2>Daily open</h2>
                <div id='daily-open'></div>
                <h2>Daily Volume MA</h2>
                <div id='daily-volumeMa'></div>
                <h2>Daily Volume</h2>
                <div id='daily-volume'></div>
                <h2>Weekly high</h2>
                <div id='weekly-high'></div>
                <h2>Weekly low</h2>
                <div id='weekly-low'></div>
                <h2>Weekly close</h2>
                <div id='weekly-close'></div>
                <h2>Weekly open</h2>
                <div id='weekly-open'></div>
                <h2>Weekly volume traded</h2>
                <div id='weekly-volume'></div>


            </React.Fragment>
        )
    }
}

export default App;
