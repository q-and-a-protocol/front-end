import { BrowserRouter as Router, Routes, Route, Link as RouterLink } from 'react-router-dom';
import { WagmiConfig, createClient, allChains, defaultChains, configureChains } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { getDefaultProvider } from 'ethers';

import { Header } from './Header';
import { Home } from './Home';
import { MyQuestions } from './MyQuestions';
import { MyAnswers } from './MyAnswers';
import { Profile } from './Profile';
import { MyProfile } from './MyProfile';
import { NotFoundScreen } from './NotFoundScreen';
import { Utilities } from './Utilities';

import './App.css';

const { chains, provider, webSocketProvider } = configureChains(allChains, [
  alchemyProvider({ apiKey: process.env.REACT_APP_ALCHEMY_API_KEY }),
  publicProvider(),
]);

const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'wagmi',
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true,
      },
    }),
  ],
  provider,
  webSocketProvider,
});

function AppRoutes() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/myquestions' element={<MyQuestions />} />
      <Route path='/myanswers' element={<MyAnswers />} />
      <Route path='/profile/:address' element={<Profile />} />
      <Route path='/myprofile' element={<MyProfile />} />
      <Route path='/utilities' element={<Utilities />} />
      <Route path='*' element={<NotFoundScreen />} />
    </Routes>
  );
}

function App() {
  return (
    <WagmiConfig client={client}>
      <Router>
        <Header />
        <AppRoutes />
      </Router>
    </WagmiConfig>
  );
}

export default App;
