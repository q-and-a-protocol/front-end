import { useContract, useProvider } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { abi } from './contractInformation/QuestionAndAnswer-abi';

export function MyQuestions() {
  // QuestionAndAnswer: 0x654eF26a03A51800D951ef8d51362ba2c329946D
  // ExampleERC20: 0xd77cffca19aec21aca9f0e38743740efd548b2a4

  const provider = useProvider();

  const contract = useContract({
    addressOrName: '0x654eF26a03A51800D951ef8d51362ba2c329946D',
    contractInterface: abi,
    signerOrProvider: provider,
  });

  async function version() {
    const result = await contract.version();
    console.log(result);
  }

  return (
    <div>
      <h2>This is the MyQuestions page!</h2>
      <button onClick={() => version()}>Version</button>
    </div>
  );
}
