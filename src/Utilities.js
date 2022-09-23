import { Link as RouterLink } from 'react-router-dom';
import { useState } from 'react';
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

const questionAndAnswerAddress = process.env.REACT_APP_QUESTION_AND_ANSWER_ADDRESS;
const exampleERC20Address = process.env.REACT_APP_EXAMPLE_ERC20_ADDRESS;

export function Utilities() {
  const [spenderAddress, setSpenderAddress] = useState('');
  const [amount, setAmount] = useState(0);

  const { config } = usePrepareContractWrite({
    addressOrName: exampleERC20Address,
    contractInterface: abi,
    functionName: 'myMint',
  });
  const { write } = useContractWrite(config);

  return (
    <div className='bg-white sm:rounded-lg '>
      <div className='px-4 py-5 sm:p-6 '>
        <form className='mt-5 sm:flex justify-center flex-col divide-y divide-solid'>
          <div className='w-full sm:flex justify-center mb-4'>
            <label htmlFor='mint' className='sr-only'>
              Mint
            </label>
            <button
              type='submit'
              onClick={() => write?.()}
              className='mt-3 inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
            >
              Mint USDC
            </button>
          </div>
          <div className='w-full sm:flex justify-center py-5'>
            <div className='sm:flex justify-center flex-col w-2/3'>
              <label htmlFor='approve' className='sr-only'>
                Approve
              </label>
              <input
                value={spenderAddress}
                onChange={(e) => setSpenderAddress(e.target.value)}
                type='text'
                name='spenderAddress'
                id='spenderAddress'
                className='rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm my-2'
                placeholder='Spender Address'
              />
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type='number'
                name='amount'
                id='amount'
                className='rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                placeholder='Amount'
              />
            </div>
            <button
              type='submit'
              className='mt-3 inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
            >
              Approve
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
