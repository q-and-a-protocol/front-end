import { WagmiConfig, createClient } from 'wagmi';
import { getDefaultProvider } from 'ethers';

import { Home } from './Home';

import './App.css';

const client = createClient({
  autoConnect: true,
  provider: getDefaultProvider(),
});

function App() {
  return (
    <WagmiConfig client={client}>
      <div>
        <h1>Question and Answer</h1>
        <Home />
      </div>
    </WagmiConfig>
  );
}

export default App;
