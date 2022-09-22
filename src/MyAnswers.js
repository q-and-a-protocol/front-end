import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

export function MyAnswers() {
  // QuestionAndAnswer: 0x81E67Da7c1E74318f4070380F6323adF3cE54931
  // ExampleERC20: 0xd77cffca19aec21aca9f0e38743740efd548b2a4

  return (
    <div>
      <h2>This is the MyAnswers page!</h2>
    </div>
  );
}
