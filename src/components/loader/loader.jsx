import React from 'react';
import './loader.scss';


export class Loader extends React.Component {
    
    render() {
        // On failure
        if (this.props.errorMsg !== "") {
            return (
                <div id="floater">
                    <div className="loader" >
                        <h2>{this.props.title}</h2>
                        {this.props.addedAddress && <p>{this.props.addedAddress}</p>}
                        <p>{this.props.errorMsg}</p>
                        <a href="!#" className="exit-Load" onClick={() =>
                            this.props.close()}>Close</a>
                    </div>
                </div>
            );
        }

        // On start Tx success
        if (this.props.successType === "start") {
            return (
                <div id="floater">
                    <div className="loader">
                        <h2>Successfully Started Transaction</h2>
                        <p>To: {this.props.toAddress}</p>
                        <p>Amount: {this.props.amount} Eth</p>
                        <a href={this.props.link} className = "link-btn" target = "_blank" rel="noopener noreferrer">View on EtherScan</a>
                        <a href="!#" className="exit-Load" onClick={() =>
                            this.props.close()}>Close</a>
                    </div>
                </div>
            );
        }

        // On sign Tx success
        if (this.props.successType === "sign") {
            return (
                <div id="floater">
                    <div className="loader">
                        <h2>Successfully Signed Transaction</h2>
                        <p>For Hash {this.props.hash}</p>
                        <p>{this.props.msg}</p>
                        <a href="!#" className="exit-Load" onClick={() =>
                            this.props.close()}>Close</a>
                    </div>
                </div>
            );
        }

        // On add whitelist success
        if (this.props.successType === "add") {
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

        // Once received Hash
        if (this.props.hash !== "") {
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

export class Buffer extends React.Component {
    render() {
        return (
            <div id="floater">
                <div className="loader">
                    <h2>Setting Up Wallette...</h2>
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }
}