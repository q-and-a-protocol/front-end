import { useEffect } from 'react';
import { useContract, useProvider, useContractRead } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { abi } from './contractInformation/QuestionAndAnswer-abi';

export function MyQuestions() {
  // QuestionAndAnswer: 0x64d5c6907df12BD636c44771C446eD4e581D3824
  // ExampleERC20: 0xd77cffca19aec21aca9f0e38743740efd548b2a4

  const provider = useProvider();

  const contract = useContract({
    addressOrName: '0x64d5c6907df12BD636c44771C446eD4e581D3824',
    contractInterface: abi,
    signerOrProvider: provider,
  });

  // const { data } = useContractRead({
  //   addressOrName: '0x64d5c6907df12BD636c44771C446eD4e581D3824',
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
      {/* <button onClick={() => version()}>Version</button> */}
      <button onClick={() => callFunction()}>callFunction</button>
    </div>
  );
}
