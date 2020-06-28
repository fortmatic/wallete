import React from 'react';
import './loader.scss';


export class Loader extends React.Component {

    render() {


        if (this.props.errorMsg === "" && this.props.successType === "") {
            return (
                <div id="floater">
                    <div className="loader">
                        <h2>Transacting on Blockchain</h2>
                        {this.props.hash !== "" && <p >Hash is {this.props.hash}</p>}
                        <div className="spinner"></div>
                    </div>
                </div>
            );
        }

        return (
            <div id="floater">
                <div className="loader" >
                    {this.props.errorMsg !== "" &&
                        <>
                            <h2>{this.props.title}</h2>
                            {this.props.addedAddress && <p>{this.props.addedAddress}</p>}
                            <p>{this.props.errorMsg}</p>
                            <a href="!#" className="exit-Load" onClick={() =>
                                this.props.close()}>Close</a>
                        </>
                    }

                    {this.props.successType === "start" &&
                        <>
                            <h2>Successfully Started Transaction</h2>
                            <p>To: {this.props.toAddress}</p>
                            <p>Amount: {this.props.amount} Eth</p>
                            <a href={this.props.link} className="link-btn" target="_blank" rel="noopener noreferrer">View on EtherScan</a>
                            <a href="!#" className="exit-Load" onClick={() =>
                                this.props.close()}>Close</a>
                        </>
                    }

                    {this.props.successType === "sign" &&
                        <>
                            <h2>Successfully Signed Transaction</h2>
                            <p>For Hash {this.props.hash}</p>
                            <p>{this.props.msg}</p>
                            <a href="!#" className="exit-Load" onClick={() =>
                                this.props.close()}>Close</a>
                        </>
                    }

                    {this.props.successType === "add" &&
                        <>
                            <h2>Successfully added</h2>
                            <p>{this.props.addedAddress}</p>
                            <a href="!#" className="exit-Load" onClick={() =>
                                this.props.close()}>Close</a>
                        </>
                    }

                </div>
            </div >
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
