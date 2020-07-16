import React, {Component} from "react";
import axios from 'axios'
import Plot from 'react-plotly.js';
import Plotly from 'plotly.js-dist'


class Weekly extends Component {
    state = {
        low: null,
        high: null,
        date: null,
        close: null,
        open: null,
        volume: null
    }

    componentDidMount() {
        axios.get("https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=" + this.props.ticker + "&apikey=9O8KE4AAY96A5AKK")
            .then(res => console.log(res.data['Weekly Time Series']))
            .catch(err => console.log(err))
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        axios.get("https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=" + this.props.ticker + "&apikey=9O8KE4AAY96A5AKK")
            .then(res => console.log(res.data['Weekly Time Series']))
            .catch(err => console.log(err))
    }

    render() {
        return (
            <React.Fragment>
                <div><strong>Weekly Stock Data</strong></div>
            </React.Fragment>
        );
    }
}

export default Weekly;