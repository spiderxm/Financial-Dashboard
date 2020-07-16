import React, {Component} from "react";
import axios from 'axios'
import Plot from 'react-plotly.js';
import Plotly from 'plotly.js-dist'

class Daily extends Component {
    state = {
        low: null,
        high: null,
        date: null,
        close: null,
        open: null,
        volume: null
    }

    componentDidMount() {
        let url = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" + this.props.ticker + "&outputsize=full&apikey=9O8KE4AAY96A5AKK";
        console.log(url)
        axios.get(url)
            .then(res => {
                console.log(url)
                let data = res.data['Time Series (Daily)']
                let keys = Object.keys(data);
                this.setState({date: keys})
                let low = [], high = [], close = [], open = [], volume = [];
                for (let i = 0; i < this.state.date.length; i++) {
                    open[i] = data[this.state.date[i]]['1. open'];
                    high[i] = data[this.state.date[i]]['2. high'];
                    low[i] = data[this.state.date[i]]['3. low'];
                    close[i] = data[this.state.date[i]]['4. close'];
                    volume[i] = data[this.state.date[i]]['5. volume'];
                }
                console.log(low, high, open, close, volume)
                this.setState({
                    low: low,
                    high: high,
                    volume: volume,
                    open: open,
                    close: close
                })
                var DATA = [
                    {
                        x: this.state.date,
                        y: open,
                        type: 'scatter',
                        title: 'Opening price'
                    }
                ];

                Plotly.newPlot('myDiv1', DATA);
            })
            .catch(err => console.log(err))
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        axios.get("https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" + this.props.ticker + "&outputsize=full&apikey=9O8KE4AAY96A5AKK")
            .then(res => {
                let data = res.data['Time Series (Daily)']
                this.setState({date: Object.keys(data)});
                let low = [], high = [], close = [], open = [], volume = [];
                for (let i = 0; i < this.state.date.length; i++) {
                    open[i] = data[this.state.date[i]]['1. open'];
                    high[i] = data[this.state.date[i]]['2. high'];
                    low[i] = data[this.state.date[i]]['3. low'];
                    close[i] = data[this.state.date[i]]['4. close'];
                    volume[i] = data[this.state.date[i]]['5. volume'];
                }
                console.log(low, high, open, close, volume)
                this.setState({
                    low: low,
                    high: high,
                    volume: volume,
                    open: open,
                    close: close
                })
                var DATA = [
                    {
                        x: this.state.date,
                        y: open,
                        type: 'scatter',
                        title: 'Opening price'
                    }
                ];

                Plotly.newPlot('myDiv1', DATA);


            })
            .catch(err => console.log(err))
    }

    render() {
        return (
            <React.Fragment>
                <div><strong>Daily Stock Data</strong></div>
                <div id='myDiv1'></div>
            </React.Fragment>
        );
        ;
    }
}

export default Daily;