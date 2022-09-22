import React, { useEffect } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useContractWrite, usePrepareContractWrite, useEnsName, useContractRead } from 'wagmi';
import { abi } from './contractInformation/QuestionAndAnswer-abi';

export function Profile() {
  // QuestionAndAnswer: 0x81E67Da7c1E74318f4070380F6323adF3cE54931
  // ExampleERC20: 0xd77cffca19aec21aca9f0e38743740efd548b2a4

  const { address } = useParams();
  const { data: ensName } = useEnsName();
  const [question, setQuestion] = useState('');
  const [bounty, setBounty] = useState(25);

  const { data, write } = useContractWrite({
    mode: 'recklesslyUnprepared',
    addressOrName: '0x81E67Da7c1E74318f4070380F6323adF3cE54931',
    contractInterface: abi,
    functionName: 'askQuestion',
    args: [question, address, bounty],
  });

  async function handleSubmit(event) {
    event.preventDefault();
    write?.();
  }

  function formatAddress(address) {
    const formattedAddress = address.slice(0, 6) + '...' + address.slice(-4);
    return ensName ? ensName : formattedAddress;
  }

  const { data: newData } = useContractRead({
    addressOrName: '0x81E67Da7c1E74318f4070380F6323adF3cE54931',
    contractInterface: abi,
    functionName: 'answererToSettings',
    args: [address],
  });

  useEffect(() => {
    console.log(newData);
  }, [newData]);

  return (
    <div className='mx-auto max-w-7xl px-4 pt-4'>
      <div className='md:grid md:grid-cols-3 md:gap-6 bg-slate-50 py-4 px-4 rounded-lg'>
        <div className='md:col-span-1 px-4'>
          <div className='px-4 sm:px-0'>
            <h3 className='text-lg font-medium leading-6 text-gray-900'>
              Ask{' '}
              <span className='underline underline-offset-4 decoration-blue-800 font-bold'>
                {formatAddress(address)}
              </span>{' '}
              a question:
            </h3>
            <p className='mt-1 text-sm text-gray-600'>
              Here are some guidelines {formatAddress(address)} has set, follow them to get your
              question answered!
            </p>
          </div>
        </div>
        <div className='mt-5 md:col-span-2 md:mt-0'>
          <form className='space-y-8 mx-auto max-w-4xl px-4 sm:px-6' onSubmit={handleSubmit}>
            <div className='space-y-8'>
              <div>
                <div className='mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6'>
                  <div className='sm:col-span-6'>
                    <label htmlFor='question' className='block text-sm font-medium text-gray-700'>
                      Question
                    </label>
                    <div className='mt-1'>
                      <textarea
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        id='question'
                        name='question'
                        rows={3}
                        className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-md'
                      />
                    </div>
                    <p className='mt-2 text-sm text-gray-500'>
                      Write a 1-2 sentence question. It can be anything you'd like!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className='grid grid-cols-3 gap-6'>
              <div className='col-span-1'>
                <label
                  htmlFor='company-website'
                  className='block text-sm font-medium text-gray-700'
                >
                  Price
                </label>
                <div className='mt-1 flex rounded-md shadow-sm'>
                  <span className='inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500'>
                    $
                  </span>
                  <input
                    type='number'
                    name='company-website'
                    id='company-website'
                    className='block flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-md'
                    placeholder='25'
                  />
                </div>
                <p className='mt-2 text-sm text-gray-500'>
                  Set a price you're willing to pay to have the question answered.
                </p>
              </div>
            </div>

            <div className='pt-5'>
              <div className='flex justify-end'>
                <button
                  type='submit'
                  className='ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                >
                  Ask Question
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
