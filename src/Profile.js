import { useState } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

export function Profile() {
  const { address } = useParams();
  const [question, setQuestion] = useState('');

  return (
    <form className='space-y-8 divide-y divide-gray-200 mx-auto max-w-7xl px-4 pt-4 sm:px-6'>
      <div className='space-y-8 divide-y divide-gray-200'>
        <div>
          <div>
            <h3 className='text-lg font-medium leading-6 text-gray-900'>
              Ask {address} a Question
            </h3>
          </div>

          <div className='mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6'>
            <div className='sm:col-span-6'>
              <label htmlFor='about' className='block text-sm font-medium text-gray-700'>
                About
              </label>
              <div className='mt-1'>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  id='about'
                  name='about'
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
