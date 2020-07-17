import React, {Component} from 'react';
import './App.css';
import axios from "axios";
import Plotly from "plotly.js-dist";
import {std, mean} from 'mathjs'
import sma from 'sma'
import logo from './Financial-chart-economic-graph-analysis-512.png'
import Error from './Components/error'

class App extends Component {

    state = {
        ticker: null,
        hidden1: true,
        hidden2: true,
        hidden3: true,
        visible: true,
        maxpriceopen: 0,
        minpriceopen: 0,
        maxpriceclose: 0,
        minpriceclose: 0,
        maxpricehigh: 0,
        minpricehigh: 0,
        maxpricelow: 0,
        minpricelow: 0,
        maxvolume: 0,
        minvolume: 0,
        error: false,
        totalvolumetraded: 0
    }
    ontickerchangeHandler = (event) => {
        this.setState({ticker: event.target.value.toString().toUpperCase()})
    }

    financialDashboard = (event) => {
        event.preventDefault();
        this.setState({error: false})
        this.setState({visible: false});
        this.setState({hidden1: true, hidden2: true, hidden3: true})
        let low = [], high = [], close = [], open = [], volume = [], date;
        axios.get("https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" + this.state.ticker + "&outputsize=full&apikey=9O8KE4AAY96A5AKK")
            .then(res => {
                let keys = Object.keys(res.data);
                if (keys[0] === "Error Message" || keys[0] === "Note") {
                    this.setState({error: true})
                } else {
                    this.setState({error: false})
                    let data = res.data['Time Series (Daily)']
                    date = Object.keys(data);
                    for (let i = 0; i < date.length; i++) {
                        open[i] = data[date[i]]['1. open'];
                        high[i] = data[date[i]]['2. high'];
                        low[i] = data[date[i]]['3. low'];
                        close[i] = data[date[i]]['4. close'];
                        volume[i] = data[date[i]]['5. volume'];
                    }
                    var DATA = [{
                        type: 'violin',
                        x: close,
                        points: 'none',
                        box: {
                            visible: true
                        },
                        boxpoints: false,
                        line: {
                            color: 'white'
                        },
                        fillcolor: 'pink',
                        opacity: .6,
                        meanline: {
                            visible: true
                        },
                        y0: "Total Bill"
                    }]

                    var layout = {
                        font: {
                            family: "Courier New, monospace",
                            size: 18,
                            color: "white"
                        },
                        width: 1440,
                        plot_bgcolor: '#000000',
                        paper_bgcolor: '#000000',
                        yaxis: {
                            gridcolor: "rgba(255,255,255,.2)",
                        },
                        xaxis: {
                            gridcolor: "rgba(255,255,255,.2)",
                            zeroline: false
                        }
                    }
                    Plotly.newPlot('violinplot', DATA, layout);
                    var DATA = [{
                        type: 'violin',
                        x: volume,
                        points: 'none',
                        box: {
                            visible: true
                        },
                        boxpoints: false,
                        line: {
                            color: 'white'
                        },
                        fillcolor: 'pink',
                        opacity: .6,
                        meanline: {
                            visible: true
                        },
                        y0: "Total Bill"
                    }]
                    Plotly.newPlot('violinplotvolume', DATA, layout);

                    this.setState({
                        maxpriceopen: Math.max(...open),
                        minpriceopen: Math.min(...open),
                        maxpriceclose: Math.max(...close),
                        minpriceclose: Math.min(...close),
                        maxpricehigh: Math.max(...high),
                        minpricehigh: Math.min(...high),
                        maxpricelow: Math.max(...low),
                        minpricelow: Math.min(...low),
                        maxvolume: Math.max(...volume),
                        minvolume: Math.min(...volume),
                        totalvolumetraded: eval(volume.join('+'))
                    })
                    Plotly.newPlot('daily-open', DATA, layout);
                    var layout = {
                        font: {
                            family: "Courier New, monospace",
                            size: 18,
                            color: "white"
                        },
                        width: 1440,
                        plot_bgcolor: '#000000',
                        paper_bgcolor: '#000000',
                        yaxis: {
                            gridcolor: "rgba(255,255,255,.2)",
                        },
                        xaxis: {
                            gridcolor: "rgba(255,255,255,.2)",
                        }
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
                    var DATA = [
                        {
                            x: date,
                            y: ma1,
                            type: 'scatter',
                        }
                    ];
                    Plotly.newPlot('daily-volumeMa', DATA, layout);
                    let returnfromstocksperday = [null];
                    let close1 = close.reverse()
                    for (let i = 1; i < close.length; i++) {
                        returnfromstocksperday[i] = ((close1[i] - close1[i - 1]) / close1[i - 1]).toFixed(5)
                    }
                    let cummulativedailyreturn = [1];
                    for (let i = 1; i < returnfromstocksperday.length; i++) {
                        cummulativedailyreturn[i] = ((1 + parseFloat(returnfromstocksperday[i])) * parseFloat(cummulativedailyreturn[i - 1])).toFixed(5);
                    }
                    var layout1 = {
                        font: {
                            family: "Courier New, monospace",
                            size: 18,
                            color: "white"
                        },
                        width: 1440,
                        plot_bgcolor: '#000000',
                        paper_bgcolor: '#000000',
                        yaxis: {
                            gridcolor: "rgba(255,255,255,.2)",
                        },
                        xaxis: {
                            gridcolor: "rgba(255,255,255,.2)",
                        }
                    };
                    var DATA1 = [
                        {
                            x: returnfromstocksperday,
                            type: 'histogram'
                        }
                    ];
                    Plotly.newPlot('pct-change', DATA1, layout1);
                    var DATA = [
                        {
                            x: date.reverse(),
                            y: cummulativedailyreturn,
                            type: 'scatter',
                        }
                    ];
                    Plotly.newPlot('dailycumulativereturn', DATA, layout);

                    var DATA = [
                        {
                            x: date,
                            y: volume,
                            type: 'scatter',
                        }
                    ];
                    Plotly.newPlot('daily-volume', DATA, layout);
                    var trace = {
                        x: date,
                        close: close1,
                        decreasing: {line: {color: '#ff4c4c'}},
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
                        font: {
                            family: "Courier New, monospace",
                            size: 18,
                            color: "white"
                        },
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
                            type: 'date',
                            gridcolor: "rgba(255,255,255,.2)",
                            zerolinecolor: "rgb(74, 134, 232)"
                        },
                        plot_bgcolor: '#000000',
                        paper_bgcolor: '#000000',

                        yaxis: {
                            autorange: true,
                            domain: [0, 1],
                            type: 'linear',
                            gridcolor: "rgba(255,255,255,.2)",
                            zerolinecolor: "rgb(74, 134, 232)"

                        }
                    };
                    var data1 = [trace];
                    Plotly.newPlot('myDiv', data1, layout);
                    this.setState({hidden1: false})
                }
            });
        axios.get("https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=" + this.state.ticker + "&apikey=9O8KE4AAY96A5AKK")
            .then(res => {
                let keys = Object.keys(res.data);
                if (keys[0] === "Error Message" || keys[0] == "Note") {
                    this.setState({error: true})
                } else {
                    this.setState({error: false})
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
                        plot_bgcolor: '#000000',
                        paper_bgcolor: '#000000',
                        width: 1440,
                        yaxis: {
                            gridcolor: "rgba(255,255,255,.2)",
                        },
                        xaxis: {
                            gridcolor: "rgba(255,255,255,.2)",
                        },
                        font: {
                            family: "Courier New, monospace",
                            size: 18,
                            color: "white"
                        }
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
                            y: sma(open, 7),
                            type: 'scatter',
                        }
                    ];
                    Plotly.newPlot('weekly-openMa', DATA, layout);
                    // var DATA = [
                    //     {
                    //         x: date,
                    //         y: close,
                    //         type: 'scatter',
                    //     }
                    // ];
                    // Plotly.newPlot('weekly-close', DATA, layout);
                    // var DATA = [
                    //     {
                    //         x: date,
                    //         y: low,
                    //         type: 'scatter',
                    //     }
                    // ];
                    // Plotly.newPlot('weekly-low', DATA, layout);
                    // var DATA = [
                    //     {
                    //         x: date,
                    //         y: high,
                    //         type: 'scatter',
                    //     }
                    // ];
                    // Plotly.newPlot('weekly-high', DATA, layout);
                    var DATA = [
                        {
                            x: date,
                            y: volume,
                            type: 'scatter',
                        }
                    ];
                    Plotly.newPlot('weekly-volume', DATA, layout);
                    var DATA = [
                        {
                            x: date,
                            y: sma(volume, 7),
                            type: 'scatter',
                        }
                    ];
                    Plotly.newPlot('weekly-volumeMa', DATA, layout);
                    let mid = [];
                    let upper = [];
                    let lower = [];
                    const ma = 7;
                    for (let i = 0; i < ma - 1; i++) {
                        mid[i] = null;
                        upper[i] = null;
                        lower[i] = null;
                    }
                    let open1 = open.reverse()
                    for (let i = ma - 1; i < open.length; i++) {
                        let arr = [];
                        for (let j = 0; j < ma; j++) {
                            arr[j] = open1[i - j];
                        }
                        mid[i] = parseFloat(mean(arr));
                        upper[i] = parseFloat(mid[i]) + parseFloat(2 * parseFloat(std(arr)));
                        lower[i] = parseFloat(mid[i]) - parseFloat(2 * parseFloat(std(arr)));
                    }
                    var Data = [
                        {
                            x: date.reverse(),
                            y: open1.reverse(),
                            type: 'scatter',
                            name: 'Open'
                        },
                        {
                            x: date.reverse(),
                            y: mid.reverse(),
                            type: 'scatter',
                            name: 'Open SMA'
                        },
                        {
                            x: date.reverse(),
                            y: upper.reverse(),
                            type: 'scatter',
                            name: 'Upper'
                        },
                        {
                            x: date.reverse(),
                            y: lower.reverse(),
                            type: 'scatter',
                            name: 'Lower'
                        }
                    ]
                    var layout1 = {
                        plot_bgcolor: '#000000',
                        paper_bgcolor: '#000000',
                        width: 1440,
                        showlegend: true,
                        yaxis: {
                            gridcolor: "rgba(255,255,255,.2)",
                        },
                        xaxis: {
                            gridcolor: "rgba(255,255,255,.2)",
                        },
                        font: {
                            family: "Courier New, monospace",
                            size: 18,
                            color: "white"
                        }
                    };
                    Plotly.newPlot('bollinger', Data, layout1);
                    this.setState({hidden2: false})
                }
            })
            .catch(err => console.log(err))
        axios.get("https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=" + this.state.ticker + "&interval=5min&apikey=9O8KE4AAY96A5AKK")
            .then(res => {
                let keys = Object.keys(res.data);
                if (keys[0] === "Error Message" || keys[0] === "Note") {
                    this.setState({error: true})
                } else {
                    this.setState({error: false})
                    let low = [], high = [], close = [], open = [], volume = [];
                    let data = res.data['Time Series (5min)']
                    date = Object.keys(data);
                    for (let i = 0; i < date.length; i++) {
                        open[i] = parseFloat(data[date[i]]['1. open']).toFixed(2);
                        high[i] = parseFloat(data[date[i]]['2. high']).toFixed(2);
                        low[i] = parseFloat(data[date[i]]['3. low']).toFixed(2);
                        close[i] = parseFloat(data[date[i]]['4. close']).toFixed(2);
                        volume[i] = parseFloat(data[date[i]]['5. volume']).toFixed(0);
                    }
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
                        plot_bgcolor: '#000000',
                        paper_bgcolor: '#000000',
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
                            type: 'date',
                            gridcolor: "rgba(255,255,255,.2)",
                        },
                        font: {
                            family: "Courier New, monospace",
                            size: 18,
                            color: "white"
                        },
                        yaxis: {
                            autorange: true,
                            domain: [0, 1],
                            type: 'linear',
                            gridcolor: "rgba(255,255,255,.2)",
                        }
                    };
                    var data1 = [trace];
                    Plotly.newPlot('myDiv1', data1, layout);
                    let mid = [];
                    let upper = [];
                    let lower = [];
                    const ma = 7;
                    for (let i = 0; i < ma - 1; i++) {
                        mid[i] = null;
                        upper[i] = null;
                        lower[i] = null;
                    }
                    let open1 = open.reverse()
                    for (let i = ma - 1; i < open.length; i++) {
                        let arr = [];
                        for (let j = 0; j < ma; j++) {
                            arr[j] = open1[i - j];
                        }
                        mid[i] = parseFloat(mean(arr));
                        upper[i] = parseFloat(mid[i]) + parseFloat(2 * parseFloat(std(arr)));
                        lower[i] = parseFloat(mid[i]) - parseFloat(2 * parseFloat(std(arr)));
                    }
                    var Data = [
                        {
                            x: date.reverse(),
                            y: open1.reverse(),
                            type: 'scatter',
                            name: 'Open'
                        },
                        {
                            x: date.reverse(),
                            y: mid.reverse(),
                            type: 'scatter',
                            name: 'Open SMA'
                        },
                        {
                            x: date.reverse(),
                            y: upper.reverse(),
                            type: 'scatter',
                            name: 'Upper'
                        },
                        {
                            x: date.reverse(),
                            y: lower.reverse(),
                            type: 'scatter',
                            name: 'Lower'
                        }
                    ]
                    var layout1 = {
                        plot_bgcolor: '#000000',
                        paper_bgcolor: '#000000',
                        width: 1440,
                        showlegend: true,
                        yaxis: {
                            gridcolor: "rgba(255,255,255,.2)",
                        },
                        xaxis: {
                            gridcolor: "rgba(255,255,255,.2)",
                        },
                        font: {
                            family: "Courier New, monospace",
                            size: 18,
                            color: "white"
                        }
                    };
                    Plotly.newPlot('bollinger5', Data, layout1);
                    this.setState({hidden3: false})
                }
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
            margin: "5rem auto",
            boxShadow: "0px 2px 11px 6px rgba(0,0,0,.3)",
            backgroundColor: "rgba(0,0,0,.85)",
            color: "white",
            marginBottom: "5rem",
            width: '450px'
        }
        let hidden = true;
        if (!this.state.hidden1 && !this.state.hidden2 && !this.state.hidden3) {
            if (this.state.error) {
                hidden = true
            } else {
                hidden = false;
            }
        }
        let visible = true;
        if (this.state.visible) {
            visible = true;
        } else {
            if (this.state.error) {
                visible = true
            } else {
                visible = !hidden
            }
        }
        const style2 = {
            border: '1px solid white',
            color: 'white',
            backgroundColor: 'black',
            borderRadius: '10px',
            padding: '1rem'
        }
        return (
            <React.Fragment>
                <header>
                    <img
                        src={logo}
                        alt={"icon"}/>
                    <nav>
                        <li><a style={{
                            color: 'white',
                            textDecoration: 'none',
                            fontSize: '2rem',
                            fontFamily: "monospace,'Courier New', Courier"
                        }}>Financial
                            Dashboard</a></li>
                        {/*<div className="topnav-right">*/}
                        {/*    <a href="https://github.com/spiderxm/Financial-Dashboard" style={{*/}
                        {/*    }}>*/}
                        {/*        <i className="github inverted icon huge"></i></a>*/}
                        {/*</div>*/}
                    </nav>
                </header>
                <div className="ui container left aligned" style={style}>
                    <form onSubmit={this.financialDashboard}>
                        <div className="field">
                            <h1>Enter Ticker</h1>
                            <div className="ui large icon input">
                                <input onChange={this.ontickerchangeHandler} placeholder={'AMZN'}
                                       value={this.state.ticker}
                                       required={true}
                                       style={{fontFamily: "monospace,'Courier New', Courier"}}
                                />
                                <i className="inverted circular search link icon" onClick={this.financialDashboard}></i>
                            </div>
                        </div>
                        <button hidden="hidden" style={{display: "none"}} className="ui button basic inverted"
                                type={"submit"}> Get financial data
                        </button>
                    </form>
                </div>
                <div className="ui segment" hidden={visible}
                     style={{height: '400px', backgroundColor: "rgba(0,0,0,.85)"}}>
                    <div className="ui active inverted dimmer" style={{backgroundColor: "rgba(0,0,0,.85)"}}>
                        <div className="ui large text loader">Loading</div>
                    </div>
                </div>
                <div hidden={!this.state.error}>
                    <Error/>
                </div>
                <div hidden={hidden}>
                    <div style={{textAlign: 'center'}}>
                        <h2>Basic Stock figures</h2>
                    </div>
                    <div className="ui two column doubling stackable grid container" style={{margin: "50px"}}>
                        <div className="column">
                            <div style={style2}>
                                <h2>Maximum opening price: {this.state.maxpriceopen.toFixed(2)}$</h2>
                            </div>
                        </div>
                        <div className="column">
                            <div style={style2}>
                                <h2>Maximum closing price: {this.state.maxpriceclose.toFixed(2)}$</h2>
                            </div>
                        </div>
                        <div className="column">
                            <div style={style2}>
                                <h2>Maximum high price: {this.state.maxpricehigh.toFixed(2)}$</h2>
                            </div>
                        </div>
                        <div className="column">
                            <div style={style2}>
                                <h2>Maximum low price: {this.state.maxpricelow.toFixed(2)}$</h2>
                            </div>
                        </div>
                        <div className="column">
                            <div style={style2}>
                                <h2>Minimum opening price: {this.state.minpriceopen.toFixed(2)}$</h2>
                            </div>
                        </div>
                        <div className="column">
                            <div style={style2}>
                                <h2>Minimum closing price: {this.state.minpriceclose.toFixed(2)}$</h2>
                            </div>
                        </div>
                        <div className="column">
                            <div style={style2}>
                                <h2>Minimum high price: {this.state.minpricehigh.toFixed(2)}$</h2>
                            </div>
                        </div>
                        <div className="column">
                            <div style={style2}>
                                <h2>Minimum low price: {this.state.minpricelow.toFixed(2)}$</h2>
                            </div>
                        </div>
                        <div className="column">
                            <div style={style2}>
                                <h2>Maximum volume traded: {this.state.maxvolume}</h2>
                            </div>
                        </div>
                        <div className="column">
                            <div style={style2}>
                                <h2>Minimum volume traded: {this.state.minvolume}</h2>
                            </div>
                        </div>
                        <div className="column">
                            <div style={style2}>
                                <h2>Total volume traded: {(this.state.totalvolumetraded / 1000000).toFixed(2)}M</h2>
                            </div>
                        </div>
                    </div>
                    <div className="ui section divider"></div>
                </div>
                <div hidden={hidden}>
                    <div style={{textAlign: "center"}}>
                        <h1>5 minute</h1>
                        <div id='myDiv1' style={{overflow: 'scroll'}}></div>
                        <div className="ui section divider"></div>
                    </div>
                    <div style={{textAlign: "center"}}>
                        <h2>Bollinger Band (5 minute)</h2>
                        <div id='bollinger5' style={{overflow: 'scroll'}}></div>
                        <div className="ui section divider"></div>
                    </div>
                    <div style={{textAlign: "center"}}>
                        <h2>Daily</h2>
                        <div id='myDiv' style={{overflow: 'scroll'}}></div>
                        <div className="ui section divider"></div>
                    </div>
                    <div style={{textAlign: "center"}}>
                        <h2>Daily Opening price</h2>
                        <div id='daily-open' style={{overflow: 'scroll'}}></div>
                        <div className="ui section divider"></div>
                    </div>
                    <div style={{textAlign: "center"}}>
                        <h2>Daily open price (Moving Average)</h2>
                        <div id='daily-openMa' style={{overflow: 'scroll'}}></div>
                        <div className="ui section divider"></div>
                    </div>
                    <div style={{textAlign: "center"}}>
                        <h2>Violin plot (Opening price of stock)</h2>
                        <div id='violinplot' style={{overflow: 'scroll'}}></div>
                        <div className="ui section divider"></div>
                    </div>
                    <div style={{textAlign: "center"}}>
                        <h2>Daily Percent Change (Histogram)</h2>
                        <div id='pct-change' style={{overflow: 'scroll'}}></div>
                        <div className="ui section divider"></div>
                    </div>
                    <div style={{textAlign: "center"}}>
                        <h2>Daily Cumulative return</h2>
                        <div id='dailycumulativereturn' style={{overflow: 'scroll'}}></div>
                        <div className="ui section divider"></div>
                    </div>
                    <div style={{textAlign: "center"}}>
                        <h2>Daily Volume Traded</h2>
                        <div id='daily-volume' style={{overflow: 'scroll'}}></div>
                        <div className="ui section divider"></div>
                    </div>
                    <div style={{textAlign: "center"}}>
                        <h2>Daily Volume Traded (Moving Average)</h2>
                        <div id='daily-volumeMa' style={{overflow: 'scroll'}}></div>
                        <div className="ui section divider"></div>
                    </div>
                    <div style={{textAlign: "center"}}>
                        <h2>Violin plot (Volume Traded)</h2>
                        <div id='violinplotvolume' style={{overflow: 'scroll'}}></div>
                        <div className="ui section divider"></div>
                    </div>
                    {/*<div style={{textAlign: "center"}}>*/}
                    {/*    <h2>Daily Cumulative return</h2>*/}
                    {/*    <div id='dailycumulativereturn' style={{overflow: 'scroll'}}></div>*/}
                    {/*    <div className="ui section divider"></div>*/}
                    {/*</div>*/}
                    {/*<div style={{textAlign: "center"}}>*/}
                    {/*    <h2>Weekly high</h2>*/}
                    {/*    <div id='weekly-high'></div>*/}
                    {/*    <div className="ui section divider"></div>*/}
                    {/*</div>*/}
                    {/*<div style={{textAlign: "center"}}>*/}
                    {/*    <h2>Weekly low</h2>*/}
                    {/*    <div id='weekly-low'></div>*/}
                    {/*    <div className="ui section divider"></div>*/}
                    {/*</div>*/}
                    {/*<div style={{textAlign: "center"}}>*/}
                    {/*    <h2>Weekly close</h2>*/}
                    {/*    <div id='weekly-close'></div>*/}
                    {/*    <div className="ui section divider"></div>*/}
                    {/*</div>*/}
                    <div style={{textAlign: "center"}}>
                        <h2>Weekly Opening Price</h2>
                        <div id='weekly-open' style={{overflow: 'scroll'}}></div>
                        <div className="ui section divider"></div>
                    </div>
                    <div style={{textAlign: "center"}}>
                        <h2>Weekly Opening Price (Moving Average)</h2>
                        <div id='weekly-openMa' style={{overflow: 'scroll'}}></div>
                        <div className="ui section divider"></div>
                    </div>
                    <div style={{textAlign: "center"}}>
                        <h2>Weekly Volume Traded</h2>
                        <div id='weekly-volume' style={{overflow: 'scroll'}}></div>
                        <div className="ui section divider"></div>
                    </div>
                    <div style={{textAlign: "center"}}>
                        <h2>Weekly Volume Traded (Moving Average)</h2>
                        <div id='weekly-volumeMa' style={{overflow: 'scroll'}}></div>
                        <div className="ui section divider"></div>
                    </div>
                    <div style={{textAlign: "center"}}>
                        <h2>Bollinger Bands</h2>
                        <div id='bollinger' style={{overflow: 'scroll'}}></div>
                        <div className="ui section divider"></div>
                    </div>
                </div>
                <div style={{
                    left: "0",
                    position: "absolute",
                    backgroundColor: "black",
                    marginTop: "10px",
                    width: "100%",
                    padding: "5px 0",
                    textAlign: "center"
                }}>
                </div>
            </React.Fragment>
        )
    }
}

export default App;
