import { useState } from "react";
import { connect } from "starknetkit";
import { WebWalletConnector } from "starknetkit/webwallet";
import { InjectedConnector } from "starknetkit/injected";

import "./App.css";

function App() {
  const [address, setAddress] = useState("");

  const connectWallet = async () => {
    const { wallet, connectorData } = await connect({ modalMode: "alwaysAsk" });

    if (wallet && connectorData) {
      setAddress(connectorData.account as string);
    }
  };
  return (
    <>
      <button onClick={async () => connectWallet()}>Connect Wallet</button>
    </>
  );
}

export default App;
