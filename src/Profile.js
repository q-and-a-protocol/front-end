import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import { abi } from './contractInformation/QuestionAndAnswer-abi';

export function Profile() {
  const { address } = useParams();
  const [question, setQuestion] = useState('');
  const [bounty, setBounty] = useState(25);

  const { data, write } = useContractWrite({
    mode: 'recklesslyUnprepared',
    addressOrName: '0x64d5c6907df12BD636c44771C446eD4e581D3824',
    contractInterface: abi,
    functionName: 'askQuestion',
    args: [question, address, bounty],
  });

  async function handleSubmit(event) {
    event.preventDefault();
    const result = write?.();
    console.log(result);
  }

  return (
    <form
      className='space-y-8 divide-y divide-gray-200 mx-auto max-w-7xl px-4 pt-4 sm:px-6'
      onSubmit={handleSubmit}
    >
      <div className='space-y-8 divide-y divide-gray-200'>
        <div>
          <div>
            <h3 className='text-lg font-medium leading-6 text-gray-900'>
              Ask {address} a Question
            </h3>
          </div>

          <div className='mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6'>
            <div className='sm:col-span-6'>
              <label htmlFor='question' className='block text-sm font-medium text-gray-700'>
                About
              </label>
              <div className='mt-1'>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  id='question'
                  name='question'
                  rows={3}
                  className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                />
              </div>
              <p className='mt-2 text-sm text-gray-500'>Write a 1-2 sentence question.</p>
            </div>
          </div>
        </div>
      </div>

      <div className='pt-5'>
        <div className='flex justify-end'>
          <button
            type='submit'
            className='ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  );
}
