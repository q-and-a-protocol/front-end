import {
  usePrepareContractWrite,
  useContractWrite,
  useAccount,
  useConnect,
  useDisconnect,
} from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

export function Utilities() {
  // QuestionAndAnswer: 0xbe4f9a902c8da1731a9e984c519b46ad1cbd9d15
  // ExampleERC20: 0xd77cffca19aec21aca9f0e38743740efd548b2a4
  const { config } = usePrepareContractWrite({
    addressOrName: '0xd77cffca19aec21aca9f0e38743740efd548b2a4',
    contractInterface: ['function myMint()'],
    functionName: 'myMint',
  });
  const { write } = useContractWrite(config);

  return (
    <div>
      <h2>This is the Utilities page!</h2>
      <button onClick={() => write?.()}>MyMint</button>
    </div>
  );
}
