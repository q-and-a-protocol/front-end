import {
  usePrepareContractWrite,
  useContractWrite,
  useAccount,
  useConnect,
  useDisconnect,
  useWaitForTransaction,
} from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { abi } from './contractInformation/ExampleERC20-abi';

export function Utilities() {
  // QuestionAndAnswer: 0x654eF26a03A51800D951ef8d51362ba2c329946D
  // ExampleERC20: 0xd77cffca19aec21aca9f0e38743740efd548b2a4
  const { config } = usePrepareContractWrite({
    addressOrName: '0xd77cffca19aec21aca9f0e38743740efd548b2a4',
    // ['function myMint()']
    contractInterface: abi,
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
