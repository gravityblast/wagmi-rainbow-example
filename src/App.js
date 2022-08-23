import { useState, useEffect } from "react";
import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";
import "@rainbow-me/rainbowkit/styles.css";
import {
  useAccount, useConnect, useDisconnect,
  WagmiConfig,
  configureChains,
  createClient,
  defaultChains,
} from "wagmi";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { alchemyProvider } from "wagmi/providers/alchemy";

import logo from "./logo.svg";
import './App.css';
import { Buffer } from "buffer"

if (!window.Buffer) {
  window.Buffer = Buffer;
}

// RPC keys
const alchemyId = process.env.ALCHEMY_ID;
const infuraId = process.env.INFURA_ID;

const { chains, provider, webSocketProvider } = configureChains(defaultChains, [
  infuraProvider({ apiKey: infuraId, priority: 0 }),
  alchemyProvider({ apiKey: alchemyId, priority: 1 }),
  publicProvider({ priority: 2 }),
])

const { connectors } = getDefaultWallets({
  appName: "Grant Hub",
  chains,
});

const client = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function Foo() {
  const { connector, isConnected, address } = useAccount()
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect()
  const { disconnect } = useDisconnect()

  useEffect(() => {
    // dispatch(loadAccountData(address));
    console.log("----------------", isConnected, address);
  }, [isConnected]);

  return <div className="App">
    Connected? {isConnected.toString()}
    {isConnected && (
          <button onClick={() => disconnect()}>
            Disconnect from {connector?.name}
          </button>
        )}

    {!isConnected && <div className="mt-8">
      <ConnectButton />
    </div>}
  </div>;
}

function App() {
  return (
    <div className="App">
      <WagmiConfig client={client}>
        <RainbowKitProvider chains={chains}>
          <Foo />
        </RainbowKitProvider>
      </WagmiConfig>
    </div>
  );
}

export default App;
