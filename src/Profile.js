import React, { useEffect } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useContractWrite, useNetwork, useContractRead, useAccount } from 'wagmi';
import QuestionAndAnswerABI from './constants/QuestionAndAnswer.json';
import ExampleERC20ABI from './constants/ExampleERC20.json';
import * as ethers from 'ethers';
import networkMapping from './constants/networkMapping.json';
import Tooltip from '@mui/material/Tooltip';

function convertExpiryDate(expiryString) {
  const splitExpiryString = expiryString.split(' ');
  const date = new Date();
  if (splitExpiryString.length == 1) {
    date.setFullYear(2037);
  } else if (splitExpiryString[1] == 'day') {
    date.setDate(date.getDate() + 1);
  } else if (splitExpiryString[1] == 'days') {
    if (splitExpiryString[0] == '7') date.setDate(date.getDate() + 7);
    else if (splitExpiryString[0] == '30') date.setDate(date.getDate() + 30);
  } else if (splitExpiryString[1] == 'year') {
    date.setFullYear(date.getFullYear() + 1);
  }

  return Math.floor(date.getTime() / 1000).toString();
}

export function Profile() {
  const provider = ethers.getDefaultProvider();
  const { address: myAddress, isDisconnected } = useAccount();
  const { address } = useParams();
  const [formattedAddress, setFormattedAddress] = useState('Loading...');
  const [question, setQuestion] = useState('');
  const [bounty, setBounty] = useState('5');
  const [recommendedBounty, setRecommendedBounty] = useState(5);
  const [interests, setInterests] = useState('');
  const [expiryDate, setExpiryDate] = useState('Never');
  const [approveAttempted, setApproveAttempted] = useState(false);
  const { chain } = useNetwork();
  const QuestionAndAnswerAddress = networkMapping[chain?.id || 80001]?.QuestionAndAnswer[0];
  const ExampleERC20Address = networkMapping[chain?.id || 80001]?.ExampleERC20[0];

  const { write } = useContractWrite({
    mode: 'recklesslyUnprepared',
    addressOrName: QuestionAndAnswerAddress,
    contractInterface: QuestionAndAnswerABI,
    functionName: 'askQuestion',
  });

  async function handleSubmit(event) {
    event.preventDefault();
    write?.({
      recklesslySetUnpreparedArgs: [
        question,
        address,
        ethers.utils.parseUnits(bounty).toString(),
        convertExpiryDate(expiryDate),
      ],
    });
  }

  useEffect(() => {
    async function formatAddress(address) {
      let result;
      if (myAddress && ethers.utils.getAddress(address) == ethers.utils.getAddress(myAddress)) {
        return 'You';
      }
      const ensName = await provider.lookupAddress(address);
      const formattedAddress = address.slice(0, 6) + '...' + address.slice(-4);
      result = ensName ? ensName : formattedAddress;
      return result;
    }

    formatAddress(address).then((result) => {
      setFormattedAddress(result);
    });
  }, [address]);

  const { data: newData } = useContractRead({
    addressOrName: QuestionAndAnswerAddress,
    contractInterface: QuestionAndAnswerABI,
    functionName: 'answererToSettings',
    args: [address],
  });

  useEffect(() => {
    if (newData) {
      const formatted = Number(ethers.utils.formatEther(newData.priceMinimum.toString()));
      setRecommendedBounty(formatted);
      setBounty(formatted.toString());
      setInterests(newData.interests);
    }
  }, [newData]);

  const { write: approveFunds } = useContractWrite({
    mode: 'recklesslyUnprepared',
    addressOrName: ExampleERC20Address,
    contractInterface: ExampleERC20ABI,
    functionName: 'increaseAllowance',
    onSuccess() {
      setApproveAttempted(true);
    },
  });

  function handleApprovePrice() {
    approveFunds?.({
      recklesslySetUnpreparedArgs: [
        QuestionAndAnswerAddress,
        ethers.utils.parseUnits(bounty).toString(),
      ],
    });
  }

  return (
    <div className='mx-auto max-w-7xl px-4 pt-4'>
      {isDisconnected ? (
        <div className='py-4 px-4 text-center'>Please connect your wallet to see this page!</div>
      ) : myAddress &&
        address &&
        ethers.utils.getAddress(myAddress) == ethers.utils.getAddress(address) ? (
        <div className='py-4 px-4 text-center'>You cannot ask yourself a question!</div>
      ) : (
        <div className='md:grid md:grid-cols-3 md:gap-6 bg-slate-50 py-4 px-4 rounded-lg'>
          <div className='md:col-span-1 px-4'>
            <div className='px-4 sm:px-0'>
              <h3 className='text-lg font-medium leading-6 text-gray-900'>
                Ask{' '}
                <span className='underline underline-offset-4 decoration-blue-800 font-bold'>
                  {formattedAddress || 'Loading...'}
                </span>{' '}
                a question:
              </h3>
              <p className='mt-1 text-sm text-gray-600'>
                Here are some guidelines {formattedAddress || 'Loading...'} has set, follow them to
                get your question answered!
              </p>
              <div className='mt-5 text-lg font-semibold'>
                <p className=''>
                  <span className='underline underline-offset-4 decoration-blue-800'>
                    Minimum Price:
                  </span>{' '}
                  {recommendedBounty === 0 ? (
                    <span className='font-normal'>
                      {formattedAddress || 'Loading...'} has not set a minimum price! We'd recommend
                      at least $5.
                    </span>
                  ) : (
                    <span className='font-bold text-green-600'>${recommendedBounty}</span>
                  )}
                </p>

                <p className='underline underline-offset-4 decoration-blue-800'>Interests: </p>
                {interests === '' ? (
                  <p className='text-md font-normal'>
                    {formattedAddress || 'Loading...'} hasn't set any interests, ask them anything!
                  </p>
                ) : (
                  <p className='text-md font-normal'>{interests}</p>
                )}
              </div>
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

              <div className='flex flex-row'>
                <div className='w-1/2'>
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
                    />
                  </div>
                  <p className='mt-2 text-sm text-gray-500'>
                    Set a price you're willing to pay to have the question answered.
                  </p>
                </div>
                <div className='w-1/2'>
                  <label htmlFor='expiryDate' className='block text-sm font-medium text-gray-700'>
                    Expiry Date
                  </label>
                  <select
                    id='expiryDate'
                    name='expiryDate'
                    className='mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                  >
                    <option>1 day</option>
                    <option>7 days</option>
                    <option>30 days</option>
                    <option>1 year</option>
                    <option>Never</option>
                  </select>
                  <p className='mt-2 text-sm text-gray-500'>
                    Set a time limit! Modify when the question expires.
                  </p>
                </div>
              </div>

              <div className='pt-5'>
                <div className='flex justify-end'>
                  <Tooltip
                    title={
                      'Step 1: Approves the application to take $' + bounty + ' from your wallet.'
                    }
                  >
                    <button
                      type='button'
                      onClick={handleApprovePrice}
                      className='ml-3 inline-flex justify-center rounded-md border border-transparent bg-rose-400 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                    >
                      Approve Price
                    </button>
                  </Tooltip>
                  <Tooltip title={'Step 2: Post your question onto the blockchain!'}>
                    <button
                      type='submit'
                      className={`ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                        approveAttempted ? '' : 'bg-gray-300 hover:bg-gray-300 '
                      }`}
                      disabled={!approveAttempted}
                    >
                      Ask Question
                    </button>
                  </Tooltip>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
