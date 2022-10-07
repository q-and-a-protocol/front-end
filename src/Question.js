import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAccount, useContractWrite, useContractRead, useEnsName, useNetwork } from 'wagmi';
import QuestionAndAnswerABI from './constants/QuestionAndAnswer.json';
import * as ethers from 'ethers';
import networkMapping from './constants/networkMapping.json';

export function Question() {
  const provider = ethers.getDefaultProvider();
  const { address: myAddress, isDisconnected } = useAccount();
  const { questioner, answerer, index } = useParams();
  const [formattedQuestioner, setFormattedQuestioner] = useState('Loading...');
  const [formattedAnswerer, setFormattedAnswerer] = useState('Loading...');
  const { data: ensName } = useEnsName();
  const [questionData, setQuestionData] = useState();
  const [answer, setAnswer] = useState();
  const { chain } = useNetwork();
  const QuestionAndAnswerAddress = networkMapping[chain?.id || 80001]?.QuestionAndAnswer[0];

  useEffect(() => {
    async function formatAddress(address) {
      let result;
      if (myAddress && ethers.utils.getAddress(address) == ethers.utils.getAddress(myAddress)) {
        return 'You';
      }
      const ensName = await provider.lookupAddress(address);
      const formattedAddress = address.slice(0, 4) + '...' + address.slice(-4);
      result = ensName ? ensName : formattedAddress;
      return result;
    }

    formatAddress(questioner).then((result) => {
      setFormattedQuestioner(result);
    });
  }, [questioner]);

  useEffect(() => {
    async function formatAddress(address) {
      let result;
      if (myAddress && ethers.utils.getAddress(address) == ethers.utils.getAddress(myAddress)) {
        return 'You';
      }
      const ensName = await provider.lookupAddress(address);
      const formattedAddress = address.slice(0, 4) + '...' + address.slice(-4);
      result = ensName ? ensName : formattedAddress;
      return result;
    }

    formatAddress(answerer).then((result) => {
      setFormattedAnswerer(result);
    });
  }, [answerer]);

  const { data: newData } = useContractRead({
    addressOrName: QuestionAndAnswerAddress,
    contractInterface: QuestionAndAnswerABI,
    functionName: 'getQuestionerToAnswererToQAs',
    args: [questioner, answerer, index],
  });

  useEffect(() => {
    if (newData) {
      setQuestionData({
        question: newData[0],
        answer: newData[1],
        answered: newData[2],
        bounty: newData[3],
        id: newData[4],
        expiryDate: newData[5],
        expired: parseInt(newData[5]) < Date.now() / 1000,
      });
    }
  }, [newData]);

  const { write: answerQuestion } = useContractWrite({
    mode: 'recklesslyUnprepared',
    addressOrName: QuestionAndAnswerAddress,
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

  const { write: cancelQuestion } = useContractWrite({
    mode: 'recklesslyUnprepared',
    addressOrName: QuestionAndAnswerAddress,
    contractInterface: QuestionAndAnswerABI,
    functionName: 'cancelQuestion',
    args: [answerer, index],
  });

  function handleCancel(event) {
    event.preventDefault();
    cancelQuestion?.({
      recklesslySetUnpreparedArgs: [answerer, index],
    });
  }

  return (
    <div>
      {isDisconnected ? (
        <div className='py-4 px-4 text-center'>Please connect your wallet to see this page!</div>
      ) : (
        <form
          className='space-y-8 divide-y divide-gray-200 px-4 py-5 sm:p-6 mx-auto w-5/6'
          onSubmit={handleSubmit}
        >
          <>
            <div className='space-y-8 divide-y divide-gray-200'>
              <div className='divide-y divide-gray-200'>
                <div>
                  <h3 className='text-lg font-medium leading-6 text-gray-900'>Question Details</h3>
                  <p className='mt-3 text-md font-medium text-gray-700'>
                    Asked by: <span className='text-indigo-600'>{formattedQuestioner}</span>
                  </p>
                  <p className='mt-3 text-md font-medium text-gray-700'>
                    Asked to: <span className='text-indigo-600'>{formattedAnswerer}</span>
                  </p>
                  <p className='mt-3 text-md font-medium text-gray-700'>
                    Bounty:{' '}
                    <span className='text-green-600'>
                      $
                      {questionData
                        ? Number(ethers.utils.formatEther(questionData.bounty.toString()))
                        : 'Loading...'}
                    </span>
                  </p>
                </div>

                <div className='mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6'>
                  <div className='sm:col-span-4 mt-4'>
                    <label htmlFor='username' className='block text-md font-medium text-gray-700'>
                      Question
                    </label>
                    <p>{questionData ? questionData.question : 'Loading...'}</p>
                  </div>

                  {myAddress &&
                  answerer &&
                  ethers.utils.getAddress(myAddress) == ethers.utils.getAddress(answerer) ? (
                    <div className='sm:col-span-6'>
                      <label htmlFor='answer' className='block text-md font-medium text-gray-700'>
                        Answer
                      </label>
                      <div className='mt-1'>
                        {questionData?.answered ? (
                          <p>{questionData.answer}</p>
                        ) : (
                          <textarea
                            id='answer'
                            name='answer'
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            rows={3}
                            className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                          />
                        )}
                      </div>
                      {questionData?.answered ? null : (
                        <p className='mt-2 text-sm text-gray-500'>
                          Write a few sentences with your answer and then submit below.
                        </p>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className='pt-5'>
              <div className='flex justify-end'>
                {(myAddress &&
                  answerer &&
                  ethers.utils.getAddress(myAddress) != ethers.utils.getAddress(answerer)) ||
                questionData?.answered ? null : (
                  <button
                    type='submit'
                    className='ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                  >
                    Answer Question
                  </button>
                )}
              </div>
              <div className='flex justify-end'>
                {myAddress &&
                questioner &&
                ethers.utils.getAddress(myAddress) == ethers.utils.getAddress(questioner) &&
                questionData?.answered === false &&
                questionData?.expired === false ? (
                  <button
                    type='button'
                    className='ml-3 inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                    onClick={handleCancel}
                  >
                    Cancel Question
                  </button>
                ) : null}
              </div>
            </div>
          </>
        </form>
      )}
    </div>
  );
}
