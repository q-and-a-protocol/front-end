import { useEffect } from 'react';
import { useContract, useProvider, useContractRead } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { abi } from './contractInformation/QuestionAndAnswer-abi';

const questionAndAnswerAddress = process.env.REACT_APP_QUESTION_AND_ANSWER_ADDRESS;
const exampleERC20Address = process.env.REACT_APP_EXAMPLE_ERC20_ADDRESS;

export function MyQuestions() {
  const provider = useProvider();

  const contract = useContract({
    addressOrName: questionAndAnswerAddress,
    contractInterface: abi,
    signerOrProvider: provider,
  });

  async function callFunction() {
    const result = await contract.getQuestionerToAnswererToQAs(
      '0xc14ed9c1bb91Bf1482458a6c23a421942EEd6717',
      '0x129c68C123C15a36B4Fe0A032D0Da2e12fCA799b',
      0
    );
    console.log(result);
  }

  return (
    <div>
      <h2>This is the MyQuestions page!</h2>

      <button onClick={() => callFunction()}>callFunction</button>
    </div>
  );
}

// const { data } = useContractRead({
//   addressOrName: questionAndAnswerAddress,
//   contractInterface: abi,
//   functionName: 'version',
// });

// useEffect(() => {
//   console.log(data);
// }, [data]);

// async function version() {
//   const result = await contract.version();
//   console.log(result);
// }

/* <button onClick={() => version()}>Version</button> */
