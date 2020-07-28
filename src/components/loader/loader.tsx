import React from 'react';
import loaderStyle from './loader.module.scss';


export class Loader extends React.Component<any> {

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
                <div id={loaderStyle.floater}>
                    <div className={loaderStyle.loader}>
                        <h2>Transacting on Blockchain</h2>
                        {hash !== "" && <p >Hash is {hash}</p>}
                        <div className={loaderStyle.spinner}></div>
                    </div>
                </div>
            );
        }

        // When loading is completed and result is reached
        return (
            <div id={loaderStyle.floater}>
                <div className={loaderStyle.loader} >
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
                            <a href={link} className={loaderStyle.linkBtn} target="_blank" rel="noopener noreferrer">View on EtherScan</a>
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

                    <a href="!#" className={loaderStyle.exitLoad} onClick={() =>
                        this.props.close()}>Close</a>
                </div>
            </div >
        );
    }
}

export class Buffer extends React.Component {
    render() {
        return (
            <div id={loaderStyle.floater}>
                <div className={loaderStyle.loader}>
                    <h2>Setting Up Wallette...</h2>
                    <div className={loaderStyle.spinner}></div>
                </div>
            </div>
        );
    }
}
