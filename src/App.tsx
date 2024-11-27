import { useState } from "react";
import { connect } from "starknetkit";

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
      Address: {address}
      <button onClick={async () => connectWallet()}>Connect Wallet</button>
    </>
  );
}

export default App;
