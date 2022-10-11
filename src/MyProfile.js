import { useState, useEffect } from 'react';
import { useAccount, useContractWrite, useContractRead, useNetwork } from 'wagmi';
import QuestionAndAnswerABI from './constants/QuestionAndAnswer.json';
import * as ethers from 'ethers';
import networkMapping from './constants/networkMapping.json';

export function MyProfile() {
  const { address, isDisconnected } = useAccount();
  const [bounty, setBounty] = useState(0);
  const [interests, setInterests] = useState('');
  const [withdrawableAmount, setWithdrawableAmount] = useState(0);
  const { chain } = useNetwork();
  const QuestionAndAnswerAddress = networkMapping[chain?.id || 137]?.QuestionAndAnswer[0];

  function updateBounty(e) {
    setBounty(e.target.value);
  }

  const { write } = useContractWrite({
    mode: 'recklesslyUnprepared',
    addressOrName: QuestionAndAnswerAddress,
    contractInterface: QuestionAndAnswerABI,
    functionName: 'setAnswererSettings',
  });

  async function handleSubmit(event) {
    event.preventDefault();
    write?.({
      recklesslySetUnpreparedArgs: [ethers.utils.parseUnits(bounty).toString(), interests],
    });
  }

  const { data: newData } = useContractRead({
    addressOrName: QuestionAndAnswerAddress,
    contractInterface: QuestionAndAnswerABI,
    functionName: 'answererToSettings',
    args: [address],
  });

  useEffect(() => {
    if (newData) {
      setBounty(ethers.utils.formatEther(newData.priceMinimum.toString()));
      setInterests(newData.interests);
      setWithdrawableAmount(ethers.utils.formatEther(newData.withdrawableAmount.toString()));
    }
  }, [newData]);

  const { write: answererWithdraw } = useContractWrite({
    mode: 'recklesslyUnprepared',
    addressOrName: QuestionAndAnswerAddress,
    contractInterface: QuestionAndAnswerABI,
    functionName: 'answererWithdraw',
  });

  async function handleWithdraw(event) {
    event.preventDefault();
    answererWithdraw?.();
  }

  return (
    <div className='mx-auto max-w-7xl px-4 pt-4'>
      {isDisconnected ? (
        <div className='py-4 px-4 text-center'>Please connect your wallet to see this page!</div>
      ) : (
        <div>
          <div className='md:grid md:grid-cols-3 md:gap-6 bg-slate-50 py-5 px-5 rounded-lg'>
            <div className='md:col-span-1'>
              <div className='px-4 sm:px-0'>
                <h3 className='text-lg font-medium leading-6 text-gray-900'>Update Profile</h3>
              </div>
            </div>
            <div className='mt-5 md:col-span-2 md:mt-0'>
              <form onSubmit={handleSubmit}>
                <div className='shadow sm:overflow-hidden sm:rounded-md'>
                  <div className='space-y-6 bg-white px-4 py-5 sm:p-6'>
                    <div className='grid grid-cols-3'>
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
                            value={Number(bounty)}
                            onChange={updateBounty}
                            type='number'
                            name='company-website'
                            id='company-website'
                            className='block flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-md'
                            placeholder='25'
                          />
                        </div>
                      </div>
                      <p className='mt-2 col-span-3 text-sm text-gray-500'>
                        Set a minimum price you'd like the questioner to pay.
                      </p>
                    </div>
                    <div>
                      <label
                        htmlFor='interests'
                        className='block text-sm font-medium text-gray-700'
                      >
                        Interests
                      </label>
                      <div className='mt-1'>
                        <textarea
                          id='interests'
                          name='interests'
                          value={interests}
                          onChange={(e) => setInterests(e.target.value)}
                          rows={3}
                          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                          placeholder='I actively invest in Crypto, love Pottery and Snowboard 5/week!'
                        />
                      </div>
                      <p className='mt-2 text-sm text-gray-500'>
                        Update your interests so people know what to ask you about!
                      </p>
                    </div>{' '}
                  </div>
                  <div className='bg-gray-50 px-4 py-3 text-right sm:px-6'>
                    <button
                      type='submit'
                      className='inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className='hidden sm:block' aria-hidden='true'>
            <div className='py-5'>
              <div className='border-t border-gray-200' />
            </div>
          </div>
          <div className='md:grid md:grid-cols-3 md:gap-6 bg-slate-50 py-5 px-5 rounded-lg'>
            <div className='md:col-span-1'>
              <div className='px-4 sm:px-0'>
                <h3 className='text-lg font-medium leading-6 text-gray-900'>Account Finances</h3>
              </div>
            </div>
            <div className='mt-5 md:col-span-2 md:mt-0'>
              <form onSubmit={handleWithdraw}>
                <div className='shadow sm:overflow-hidden sm:rounded-md'>
                  <div className='space-y-6 bg-white px-4 py-5 sm:p-6'>
                    <div className='grid grid-cols-3'>
                      <div className='col-span-1'>
                        <label
                          htmlFor='company-website'
                          className='block text-sm font-medium text-gray-700'
                        >
                          Account Balance
                        </label>
                      </div>
                      <p className='mt-2 col-span-3 text-md text-green-600'>
                        ${Number(withdrawableAmount)}
                      </p>
                      <p className='mt-2 col-span-3 text-sm text-gray-500'>
                        This is money that has been collected from answering questions. You can
                        withdraw this amount at any time.
                      </p>
                    </div>
                  </div>
                  <div className='bg-gray-50 px-4 py-3 text-right sm:px-6'>
                    <button
                      type='submit'
                      className='inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                    >
                      Withdraw
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
