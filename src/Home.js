import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { Link as RouterLink } from 'react-router-dom';
import { useState } from 'react';

export function Home() {
  const { address, isConnected } = useAccount();
  const [inputAddress, setInputAddress] = useState('');

  return (
    <div className='bg-white sm:rounded-lg '>
      <div className='px-4 py-5 sm:p-6 '>
        <form className='mt-5 sm:flex justify-center'>
          <div className='w-2/3'>
            <label htmlFor='email' className='sr-only'>
              Email
            </label>
            <input
              value={inputAddress}
              onChange={(e) => setInputAddress(e.target.value)}
              type='text'
              name='address'
              id='address'
              className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
              placeholder='0x27f940eb8fa6740e38a20214592cECE329BDe8Df'
            />
          </div>
          <RouterLink to={`/profile/${inputAddress}`}>
            <button
              type='submit'
              className='mt-3 inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
            >
              Go to Profile
            </button>
          </RouterLink>
        </form>
      </div>
    </div>
  );
}
