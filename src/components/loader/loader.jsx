import React from 'react';
import './loader.scss';


export class Loader extends React.Component {

    render() {
        const { errorMsg,
            successType,
            title,
            addedAddress,
            amount,
            toAddress,
            link,
            msg,
            hash } = this.props;

        // When loading is occuring
        if (errorMsg === "" && successType === "") {
            return (
                <div id="floater">
                    <div className="loader">
                        <h2>Transacting on Blockchain</h2>
                        {hash !== "" && <p >Hash is {hash}</p>}
                        <div className="spinner"></div>
                    </div>
                </div>
            );
        }

        // When loading is completed and result is reached
        return (
            <div id="floater">
                <div className="loader" >
                    {errorMsg !== "" &&
                        <>
                            <h2>{title}</h2>
                            {addedAddress && <p>{addedAddress}</p>}
                            <p>{errorMsg}</p>
                        </>
                    }

                    {successType === "start" &&
                        <>
                            <h2>Successfully Started Transaction</h2>
                            <p>To: {toAddress}</p>
                            <p>Amount: {amount} Eth</p>
                            <a href={link} className="link-btn" target="_blank" rel="noopener noreferrer">View on EtherScan</a>
                        </>
                    }

                    {successType === "sign" &&
                        <>
                            <h2>Successfully Signed Transaction</h2>
                            <p>For Hash {hash}</p>
                            <p>{msg}</p>
                        </>
                    }

                    {successType === "add" &&
                        <>
                            <h2>Successfully added</h2>
                            <p>{addedAddress}</p>
                        </>
                    }

                    <a href="!#" className="exit-Load" onClick={() =>
                        this.props.close()}>Close</a>
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
