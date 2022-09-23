import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

export function MyAnswers() {
  const questionAndAnswerAddress = process.env.REACT_APP_QUESTION_AND_ANSWER_ADDRESS;
  const exampleERC20Address = process.env.REACT_APP_EXAMPLE_ERC20_ADDRESS;

  return (
    <div>
      <h2>This is the MyAnswers page!</h2>
    </div>
  );
}
