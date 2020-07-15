import React, {Component} from "react";
import axios from 'axios'
import Plot from 'react-plotly.js';
import Plotly from 'plotly.js-dist'

class Daily extends Component {
    componentDidMount() {
        console.log(this.props)
        axios.get("https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" + this.props.ticker + "&outputsize=full&apikey=9O8KE4AAY96A5AKK")
            .then(res => console.log(res.data['Time Series (Daily)']))
            .catch(err => console.log(err))
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        axios.get("https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" + this.props.ticker + "&outputsize=full&apikey=9O8KE4AAY96A5AKK")
            .then(res => console.log(res.data['Time Series (Daily)']))
            .catch(err => console.log(err))
    }

    render() {
        return (
            <React.Fragment>
                <div><strong>Daily Stock Data</strong></div>
            </React.Fragment>
        );
        ;
    }
}

export default Daily;