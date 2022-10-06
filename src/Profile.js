import React, { useEffect } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useContractWrite, useNetwork, useContractRead, useAccount } from 'wagmi';
import { useQuery, gql } from '@apollo/client';
import QuestionAndAnswerABI from './constants/QuestionAndAnswer.json';
import ExampleERC20ABI from './constants/ExampleERC20.json';
import * as ethers from 'ethers';
import networkMapping from './constants/networkMapping.json';
import Tooltip from '@mui/material/Tooltip';
import { Link as RouterLink } from 'react-router-dom';
import { Fragment } from 'react';
import { Menu, Popover, Transition } from '@headlessui/react';
import {
  ArrowLongLeftIcon,
  CheckIcon,
  HandThumbUpIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  PaperClipIcon,
  QuestionMarkCircleIcon,
  UserIcon,
} from '@heroicons/react/20/solid';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';

const GET_ALL_QUESTIONS = gql`
  {
    newsfeedEvents {
      id
      questioner
      answerer
      questionId
      bounty
      date
      answered
      expiryDate
      expired
    }
  }
`;

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
  const { data: allQuestions } = useQuery(GET_ALL_QUESTIONS);
  const { chain } = useNetwork();
  const QuestionAndAnswerAddress = networkMapping[chain?.id || 80001]?.QuestionAndAnswer[0];
  const ExampleERC20Address = networkMapping[chain?.id || 80001]?.ExampleERC20[0];
  const [count, setCount] = useState({});

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

  useEffect(() => {
    if (!allQuestions || !allQuestions.newsfeedEvents) return;
    else {
      allQuestions.newsfeedEvents.forEach((e) => {
        setCount((prevState) => {
          if (!prevState[e.questioner]) {
            return {
              ...prevState,
              [e.questioner]: {
                questionCount: 1,
                answerCount: 0,
              },
            };
          } else {
            return {
              ...prevState,
              [e.questioner]: {
                ...prevState[e.questioner],
                questionCount: prevState[e.questioner].questionCount + 1,
              },
            };
          }
        });
        setCount((prevState) => {
          if (!prevState[e.answerer]) {
            return {
              ...prevState,
              [e.answerer]: {
                questionCount: 0,
                answerCount: e.answered ? 1 : 0,
              },
            };
          } else {
            return {
              ...prevState,
              [e.answerer]: {
                ...prevState[e.answerer],
                answerCount: prevState[e.answerer].answerCount + (e.answered ? 1 : 0),
              },
            };
          }
        });
      });
    }
  }, [allQuestions]);

  return (
    <div className='mx-auto max-w-7xl px-8 pt-2'>
      {isDisconnected ? (
        <div className='py-4 px-4 text-center'>Please connect your wallet to see this page!</div>
      ) : myAddress &&
        address &&
        ethers.utils.getAddress(myAddress) == ethers.utils.getAddress(address) ? (
        <div className='py-4 px-4 text-center'>You cannot ask yourself a question!</div>
      ) : (
        <>
          <div className='min-h-full'>
            <main className='py-10'>
              {/* Page header */}
              <div className='mx-auto max-w-3xl px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8'>
                <div className='flex items-center space-x-5'>
                  <div className='flex-shrink-0'>
                    <div className='relative'>
                      <span className='inline-block h-16 w-16 overflow-hidden rounded-full bg-gray-100'>
                        <svg
                          className='h-full w-full text-gray-300'
                          fill='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path d='M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z' />
                        </svg>
                      </span>
                    </div>
                  </div>
                  <div>
                    <h1 className='text-2xl font-bold text-gray-900'>
                      {formattedAddress || 'Loading...'}
                    </h1>
                    {/* <p className='text-sm font-medium text-gray-500'>
                      Applied for{' '}
                      <a href='#' className='text-gray-900'>
                        Front End Developer
                      </a>{' '}
                      on <time dateTime='2020-08-25'>August 25, 2020</time>
                    </p> */}
                  </div>
                </div>
                <div className='justify-stretch mt-6 flex flex-col-reverse space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-y-0 sm:space-x-3 sm:space-x-reverse md:mt-0 md:flex-row md:space-x-3'>
                  <a href='#ask_a_question'>
                    <button
                      type='button'
                      href
                      className='inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100'
                    >
                      Ask a question
                    </button>
                  </a>
                </div>
              </div>

              <div className='mx-auto mt-8 max-w-3xl sm:px-6 lg:max-w-7xl'>
                <div className='space-y-6'>
                  {/* Description list*/}
                  <section aria-labelledby='applicant-information-title'>
                    <div className='bg-white shadow sm:rounded-lg'>
                      <div className='px-4 py-5 sm:px-6 bg-gray-100 rounded-lg'>
                        <h2
                          id='applicant-information-title'
                          className='text-lg font-medium leading-6 text-gray-900'
                        >
                          Information
                        </h2>
                        <p className='mt-1 max-w-2xl text-sm text-gray-500'>
                          Personal details this user has decided to share, some rules they've set,
                          and some statistics on their activity.
                        </p>
                      </div>
                      <div className='border-t border-gray-200 px-4 py-5 sm:px-6'>
                        <dl className='grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2'>
                          <div className='sm:col-span-1'>
                            <dt className='text-sm font-medium text-gray-500'>Minimum Price</dt>
                            <dd className='mt-1 text-sm text-gray-900'>
                              {recommendedBounty === 0 ? (
                                <span>
                                  {formattedAddress || 'Loading...'} has not set a minimum price!
                                  We'd recommend at least $5.
                                </span>
                              ) : (
                                <span>${recommendedBounty}</span>
                              )}
                            </dd>
                          </div>
                          {/* <div className='sm:col-span-1'>
                            <dt className='text-sm font-medium text-gray-500'>
                              Salary expectation
                            </dt>
                            <dd className='mt-1 text-sm text-gray-900'>$120,000</dd>
                          </div> */}
                          <div className='sm:col-span-1'>
                            <dt className='text-sm font-medium text-gray-500'>Full Address</dt>
                            <dd className='mt-1 text-sm text-gray-900'>{address}</dd>
                          </div>
                          <div className='sm:col-span-2'>
                            <dt className='text-sm font-medium text-gray-500'>Interests</dt>
                            <dd className='mt-1 text-sm text-gray-900'>
                              {interests === '' ? (
                                <span>
                                  {formattedAddress || 'Loading...'} hasn't set any interests, ask
                                  them anything!
                                </span>
                              ) : (
                                <span>{interests}</span>
                              )}
                            </dd>
                          </div>
                          <div className='sm:col-span-1'>
                            <dt className='text-sm font-medium text-gray-500'>Questions Asked</dt>
                            <dd className='mt-1 text-sm text-gray-900'>
                              {count[address]?.questionCount}
                            </dd>
                          </div>
                          <div className='sm:col-span-1'>
                            <dt className='text-sm font-medium text-gray-500'>
                              Questions Answered
                            </dt>
                            <dd className='mt-1 text-sm text-gray-900'>
                              {count[address]?.answerCount}
                            </dd>
                          </div>
                        </dl>
                      </div>
                      <div></div>
                    </div>
                  </section>
                </div>
              </div>

              <div id='ask_a_question' className='mx-auto my-8 max-w-3xl sm:px-6 lg:max-w-7xl'>
                <div className='space-y-6'>
                  {/* Description list*/}
                  <section aria-labelledby='applicant-information-title'>
                    <div className='bg-white shadow sm:rounded-lg'>
                      <div className='px-4 py-5 sm:px-6 bg-gray-100 rounded-lg'>
                        <h2
                          id='applicant-information-title'
                          className='text-lg font-medium leading-6 text-gray-900'
                        >
                          Ask a question
                        </h2>
                        <p className='mt-1 max-w-2xl text-sm text-gray-500'>
                          Fill out your question, set a price you're willing to pay, maybe an expiry
                          date, and then send your question!
                        </p>
                      </div>
                      <div className='border-t border-gray-200 w-2/3 py-5 mx-auto'>
                        <form
                          className='space-y-8 mx-auto max-w-4xl px-4 sm:px-6'
                          onSubmit={handleSubmit}
                        >
                          <div className='space-y-8'>
                            <div>
                              <div className='mt-6'>
                                <div>
                                  <label
                                    htmlFor='question'
                                    className='block text-sm font-medium text-gray-700'
                                  >
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
                              <label
                                htmlFor='bounty'
                                className='block text-sm font-medium text-gray-700'
                              >
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
                              <label
                                htmlFor='expiryDate'
                                className='block text-sm font-medium text-gray-700'
                              >
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
                                  'Step 1: Approves the application to take $' +
                                  bounty +
                                  ' from your wallet.'
                                }
                              >
                                <button
                                  type='button'
                                  onClick={handleApprovePrice}
                                  className='ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
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
                      <div></div>
                    </div>
                  </section>
                </div>
              </div>
            </main>
          </div>
        </>
      )}
    </div>
  );
}
