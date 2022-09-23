import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAccount, useContractWrite, useContractRead, useEnsName } from 'wagmi';
import { abi as QuestionAndAnswerABI } from './contractInformation/QuestionAndAnswer-abi';
import * as ethers from 'ethers';

const questionAndAnswerAddress = process.env.REACT_APP_QUESTION_AND_ANSWER_ADDRESS;
const exampleERC20Address = process.env.REACT_APP_EXAMPLE_ERC20_ADDRESS;

export function Question() {
  const { address } = useAccount();
  const { questioner, answerer, index } = useParams();
  const { data: ensName } = useEnsName();
  const [questionData, setQuestionData] = useState();
  const [answer, setAnswer] = useState();

  function formatAddress(address) {
    const formattedAddress = address.slice(0, 6) + '...' + address.slice(-4);
    return ensName ? ensName : formattedAddress;
  }

  const { data: newData } = useContractRead({
    addressOrName: questionAndAnswerAddress,
    contractInterface: QuestionAndAnswerABI,
    functionName: 'getQuestionerToAnswererToQAs',
    args: [questioner, answerer, index],
  });

  useEffect(() => {
    if (newData) {
      setQuestionData(newData);
    }
  }, [newData]);

  const { write: answerQuestion } = useContractWrite({
    mode: 'recklesslyUnprepared',
    addressOrName: questionAndAnswerAddress,
    contractInterface: QuestionAndAnswerABI,
    functionName: 'answerQuestion',
    args: [questioner, index, answer],
  });

  function handleSubmit(event) {
    event.preventDefault();
    answerQuestion?.({
      recklesslySetUnpreparedArgs: [questioner, index, answer],
    });
  }

  return (
    <form
      className='space-y-8 divide-y divide-gray-200 px-4 py-5 sm:p-6 mx-auto w-5/6'
      onSubmit={handleSubmit}
    >
      {ethers.utils.getAddress(address) != ethers.utils.getAddress(answerer) ? (
        'You cannot answer this question!'
      ) : (
        <>
          <div className='space-y-8 divide-y divide-gray-200'>
            <div className='divide-y divide-gray-200'>
              <div>
                <h3 className='text-lg font-medium leading-6 text-gray-900'>Question Details</h3>
                {/* <p className='mt-1 text-sm text-gray-500'>
              This information will be displayed publicly so be careful what you share.
            </p> */}
                <p className='mt-3 text-md font-medium text-gray-700'>
                  Asked by: <span className='text-indigo-600'>{formatAddress(questioner)}</span>
                </p>
                <p className='mt-3 text-md font-medium text-gray-700'>
                  You will receive:{' '}
                  <span className='text-green-600'>
                    $
                    {questionData
                      ? Number(ethers.utils.formatEther(questionData[3].toString()))
                      : 'Loading...'}
                  </span>
                </p>
              </div>

              <div className='mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6'>
                <div className='sm:col-span-4 mt-4'>
                  <label htmlFor='username' className='block text-md font-medium text-gray-700'>
                    Question
                  </label>
                  <p>{questionData ? questionData[0] : 'Loading...'}</p>
                </div>

                <div className='sm:col-span-6'>
                  <label htmlFor='answer' className='block text-md font-medium text-gray-700'>
                    Answer
                  </label>
                  <div className='mt-1'>
                    <textarea
                      id='answer'
                      name='answer'
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      rows={3}
                      className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                    />
                  </div>
                  <p className='mt-2 text-sm text-gray-500'>
                    Write a few sentences with your answer and then submit below.
                  </p>
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
                Answer Question
              </button>
            </div>
          </div>
        </>
      )}
    </form>
  );
}
