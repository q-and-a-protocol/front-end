import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { getDefaultWallets, lightTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiConfig, createClient, allChains, defaultChains, configureChains, chain } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { getDefaultProvider } from 'ethers';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  uri: process.env.REACT_APP_THE_GRAPH_HTTP,
});

const { chains, provider, webSocketProvider } = configureChains(
  [chain.polygon],
  // chain.polygonMumbai
  [alchemyProvider({ apiKey: process.env.REACT_APP_ALCHEMY_API_KEY }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'Question & Answer Protocol',
  chains,
});

const client = createClient({
  autoConnect: true,
  connectors,
  // connectors: [
  //   new MetaMaskConnector({ chains }),
  //   new CoinbaseWalletConnector({
  //     chains,
  //     options: {
  //       appName: 'wagmi',
  //     },
  //   }),
  //   new WalletConnectConnector({
  //     chains,
  //     options: {
  //       qrcode: true,
  //     },
  //   }),
  //   new InjectedConnector({
  //     chains,
  //     options: {
  //       name: 'Injected',
  //       shimDisconnect: true,
  //     },
  //   }),
  // ],
  provider,
  webSocketProvider,
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <WagmiConfig client={client}>
      <RainbowKitProvider
        chains={chains}
        showRecentTransactions={true}
        theme={lightTheme({
          accentColor: '#4f46e5',
        })}
      >
        <ApolloProvider client={apolloClient}>
          <App />
        </ApolloProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
