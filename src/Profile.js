import React, { useEffect } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useContractWrite, usePrepareContractWrite, useEnsName, useContractRead } from 'wagmi';
import { abi as QuestionAndAnswerABI } from './contractInformation/QuestionAndAnswer-abi';
import { abi as ExampleERC20ABI } from './contractInformation/ExampleERC20-abi';
import * as ethers from 'ethers';

export function Profile() {
  const questionAndAnswerAddress = process.env.REACT_APP_QUESTION_AND_ANSWER_ADDRESS;
  const exampleERC20Address = process.env.REACT_APP_EXAMPLE_ERC20_ADDRESS;

  const { address } = useParams();
  const { data: ensName } = useEnsName();
  const [question, setQuestion] = useState('');
  const [bounty, setBounty] = useState(5);
  const [recommendedBounty, setRecommendedBounty] = useState(5);

  const { write } = useContractWrite({
    mode: 'recklesslyUnprepared',
    addressOrName: questionAndAnswerAddress,
    contractInterface: QuestionAndAnswerABI,
    functionName: 'askQuestion',
    args: [question, address, bounty],
  });

  async function handleSubmit(event) {
    event.preventDefault();
    write?.({
      recklesslySetUnpreparedArgs: [question, address, ethers.utils.parseUnits(bounty).toString()],
    });
  }

  function formatAddress(address) {
    const formattedAddress = address.slice(0, 6) + '...' + address.slice(-4);
    return ensName ? ensName : formattedAddress;
  }

  const { data: newData } = useContractRead({
    addressOrName: questionAndAnswerAddress,
    contractInterface: QuestionAndAnswerABI,
    functionName: 'answererToSettings',
    args: [address],
  });

  useEffect(() => {
    if (newData) {
      const formatted = Number(ethers.utils.formatEther(newData.priceMinimum.toString()));
      setRecommendedBounty(formatted);
      setBounty(formatted);
    }
  }, [newData]);

  const { write: approveFunds } = useContractWrite({
    mode: 'recklesslyUnprepared',
    addressOrName: exampleERC20Address,
    contractInterface: ExampleERC20ABI,
    functionName: 'increaseAllowance',
    args: [questionAndAnswerAddress, bounty],
  });

  async function handleSubmit(event) {
    event.preventDefault();
    write?.({
      recklesslySetUnpreparedArgs: [question, address, ethers.utils.parseUnits(bounty).toString()],
    });
  }

  function handleApprovePrice() {
    approveFunds?.({
      recklesslySetUnpreparedArgs: [
        questionAndAnswerAddress,
        ethers.utils.parseUnits(bounty).toString(),
      ],
    });
  }

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
            <p className='mt-5 text-md text-rose-500'>
              {recommendedBounty === 0
                ? `${formatAddress(
                    address
                  )} has not set a minimum price! We'd recommend at least $5 to be safe.`
                : `Minimum Price: $${recommendedBounty}`}
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

            <div className='grid gap-6'>
              <div className='col-span-1'>
                <label htmlFor='bounty' className='block text-sm font-medium text-gray-700'>
                  Price
                </label>
                <div className='mt-1 w-1/3 flex rounded-md shadow-sm'>
                  <span className='inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500'>
                    $
                  </span>
                  <input
                    type='number'
                    name='bounty'
                    id='bounty'
                    value={bounty}
                    onChange={(e) => setBounty(e.target.value)}
                    className='block flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-md'
                    placeholder='5'
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
                  type='button'
                  onClick={handleApprovePrice}
                  className='ml-3 inline-flex justify-center rounded-md border border-transparent bg-rose-400 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                >
                  Approve Price
                </button>
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
