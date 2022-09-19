import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

export function Home() {
  const { address, isConnected } = useAccount();
  return (
    <div>
      {!isConnected ? (
        <h2>Please connect your wallet to access the application!</h2>
      ) : (
        <div>This will eventually be a newsfeed you can see!</div>
      )}
    </div>
  );
}
