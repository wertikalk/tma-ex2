import { useEffect, useState } from "react";
import { ArgentTMA, SessionAccountInterface } from "@argent/tma-wallet";
import { Account } from "starknet";

const argentTMA = ArgentTMA.init({
  environment: "mainnet", // "sepolia" | "mainnet" (not supperted yet)
  appName: "Bik Temp.", // Your Telegram app name
  appTelegramUrl: "https://wertikalk.github.io/tma-ex2", // Your Telegram app URL
  sessionParams: {
    allowedMethods: [],
    validityDays: 90, // session validity (in days) - default: 90
  },
});

function App() {
  const [account, setAccount] = useState<SessionAccountInterface | undefined>();
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    // Call connect() as soon as the app is loaded
    argentTMA
      .connect()
      .then((res) => {
        if (!res) {
          // Not connected
          setIsConnected(false);
          return;
        }

        if (res.account.getSessionStatus() !== "VALID") {
          // Session has expired or scope (allowed methods) has changed
          // A new connection request should be triggered

          // The account object is still available to get access to user's address
          // but transactions can't be executed
          const { account } = res;

          setAccount(account);
          setIsConnected(false);
          return;
        }

        // Connected
        const { account, callbackData } = res;
        // The session account is returned and can be used to submit transactions
        setAccount(account);
        setIsConnected(true);
        // Custom data passed to the requestConnection() method is available here
        console.log("callback data:", callbackData);
      })
      .catch((err) => {
        console.error("Failed to connect", err);
      });
  }, []);

  const handleConnectButton = async () => {
    // If not connected, trigger a connection request
    // It will open the wallet and ask the user to approve the connection
    // The wallet will redirect back to the app and the account will be available
    // from the connect() method -- see above
    await argentTMA.requestConnection("custom_callback_data");
  };

  // useful for debugging
  const handleClearSessionButton = async () => {
    await argentTMA.clearSession();
    setAccount(undefined);
  };

  return (
    <>
      <div>
        {!isConnected && <button onClick={handleConnectButton}>Connect</button>}

        {isConnected && (
          <>
            <p>
              Account address: <code>{account?.address}</code>
            </p>
            <button onClick={handleClearSessionButton}>Clear Session</button>
          </>
        )}
      </div>
    </>
  );
}

export default App;
