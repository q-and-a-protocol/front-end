import { useState, useEffect } from 'react';
import { useAccount, useContractWrite, useContractRead } from 'wagmi';
import { abi } from './contractInformation/QuestionAndAnswer-abi';
import * as ethers from 'ethers';

const questionAndAnswerAddress = process.env.REACT_APP_QUESTION_AND_ANSWER_ADDRESS;
const exampleERC20Address = process.env.REACT_APP_EXAMPLE_ERC20_ADDRESS;

export function MyProfile() {
  const { address } = useAccount();
  const [bounty, setBounty] = useState(0);

  function updateBounty(e) {
    setBounty(e.target.value);
  }

  const { data, write } = useContractWrite({
    mode: 'recklesslyUnprepared',
    addressOrName: questionAndAnswerAddress,
    contractInterface: abi,
    functionName: 'setAnswererSettingsPriceMinimum',
  });

  async function handleSubmit(event) {
    event.preventDefault();
    write?.({
      recklesslySetUnpreparedArgs: ethers.utils.parseUnits(bounty).toString(),
    });
  }

  const { data: newData } = useContractRead({
    addressOrName: questionAndAnswerAddress,
    contractInterface: abi,
    functionName: 'answererToSettings',
    args: [address],
  });

  useEffect(() => {
    if (newData) {
      setBounty(ethers.utils.formatEther(newData.priceMinimum.toString()));
    }
  }, [newData]);

  return (
    <div className='mx-auto max-w-7xl px-4 pt-4'>
      <div>
        <div className='md:grid md:grid-cols-3 md:gap-6 bg-slate-50 py-4 px-4 rounded-lg'>
          <div className='md:col-span-1'>
            <div className='px-4 sm:px-0'>
              <h3 className='text-lg font-medium leading-6 text-gray-900'>Update Profile</h3>
              {/* <p className='mt-1 text-sm text-gray-600'></p> */}
            </div>
          </div>
          <div className='mt-5 md:col-span-2 md:mt-0'>
            <form onSubmit={handleSubmit}>
              <div className='shadow sm:overflow-hidden sm:rounded-md'>
                <div className='space-y-6 bg-white px-4 py-5 sm:p-6'>
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
                          value={bounty}
                          onChange={updateBounty}
                          type='number'
                          name='company-website'
                          id='company-website'
                          className='block flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-md'
                          placeholder='25'
                        />
                      </div>
                      <p className='mt-2 text-sm text-gray-500'>
                        Set a minimum price you'd like the questioner to pay.
                      </p>
                    </div>
                  </div>
                  {/* <div className='grid grid-cols-3 gap-6'>
                    <div className='col-span-3 sm:col-span-2'>
                      <label
                        htmlFor='company-website'
                        className='block text-sm font-medium text-gray-700'
                      >
                        Website
                      </label>
                      <div className='mt-1 flex rounded-md shadow-sm'>
                        <span className='inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500'>
                          http://
                        </span>
                        <input
                          type='text'
                          name='company-website'
                          id='company-website'
                          className='block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                          placeholder='www.example.com'
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor='about' className='block text-sm font-medium text-gray-700'>
                      About
                    </label>
                    <div className='mt-1'>
                      <textarea
                        id='about'
                        name='about'
                        rows={3}
                        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                        placeholder='you@example.com'
                        defaultValue={''}
                      />
                    </div>
                    <p className='mt-2 text-sm text-gray-500'>
                      Brief description for your profile. URLs are hyperlinked.
                    </p>
                  </div> */}
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
      </div>
    </div>
  );
}
