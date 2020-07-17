import React, {Component} from "react";
import './error.css'

class Error extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="container" style={{color: 'white'}}>
                    <div className={"text"}>
                        There is some Error.
                        Please try again later.
                        Maybe incorrect ticker.
                        Maybe API calls exceeded
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default Error