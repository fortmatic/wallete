import React from 'react';
import './loader.css';


export default class Loader extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        // On failure
        if (this.props.errorMsg != "") {
            return (
                <div id="floater">
                    <div className="loader" >
                        <h2>Unable to Add Address</h2>
                        <p>{this.props.addedAddress}</p>
                        <p>{this.props.errorMsg}</p>
                        <a href="!#" className="exit-Load" onClick={() =>
                            this.props.close()}>Close</a>
                    </div>
                </div>
            );
        }

        // Once received Hash
        if (this.props.hash != "") {
            return (
                <div id="floater">
                    <div className="loader">
                        <h2>Transacting on Blockchain</h2>
                        <p >Hash is {this.props.hash}</p>
                        <div className="spinner"></div>
                    </div>
                </div>
            );
        }

        // On success
        if (this.props.addedAddress != "") {
            return (
                <div id="floater">
                    <div className="loader">
                        <h2>Successfully added</h2>
                        <p>{this.props.addedAddress}</p>
                        <a href="!#" className="exit-Load" onClick={() =>
                            this.props.close()}>Close</a>
                    </div>
                </div>
            );
        }

        // Basic Loading
        return (
            <div id="floater">
                <div className="loader">
                    <h2>Transacting on Blockchain</h2>
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }
}