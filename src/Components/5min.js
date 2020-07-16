import React, {Component} from "react";
import axios from 'axios'
import Plot from 'react-plotly.js';
import Plotly from 'plotly.js-dist'


class fivemin extends Component {
    componentDidMount() {
        axios.get("https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=" + this.props.ticker + "&interval=5min&apikey=9O8KE4AAY96A5AKK")
            .then(res => console.log(res.data['Time Series (5min)']))
            .catch(err => console.log(err))
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        axios.get("https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=" + this.props.ticker + "&interval=5min&apikey=9O8KE4AAY96A5AKK")
            .then(res => console.log(res.data['Time Series (5min)']))
            .catch(err => console.log(err))
    }

    render() {
        return (
            <React.Fragment>
                <div><strong>5 min Stock Data</strong></div>
            </React.Fragment>
        );
    }
}

export default fivemin;