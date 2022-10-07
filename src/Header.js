import { useAccount, useConnect, useDisconnect, useNetwork } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

import { Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { BrowserRouter as Router, Link as RouterLink, useMatch } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function NavLink(props) {
  const match = useMatch(props.to);
  // TODO: IF match give different colour to the below element!
  return <RouterLink {...props} />;
}

export function Header() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();
  const connectBGColor = isConnected ? 'bg-rose-400' : 'bg-indigo-600';
  const { chain, chains } = useNetwork();

  function toggleWallet() {
    if (isConnected) {
      disconnect();
    } else {
      connect();
    }
  }

  return (
    <Popover className='relative bg-white'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6'>
        <div className='flex items-center justify-between border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10'>
          <div className='flex justify-start lg:w-0 lg:flex-1'>
            <RouterLink to='/'>
              <span className='sr-only'>Your Company</span>
              {/* <img
                className='h-8 w-auto sm:h-10'
                src='https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600'
                alt=''
              /> */}
              {/* <XMarkIcon className='h-6 w-6' aria-hidden='true' /> */}
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='currentColor'
                className='w-10 h-10 text-indigo-800'
              >
                <path
                  fillRule='evenodd'
                  d='M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z'
                  clipRule='evenodd'
                />
              </svg>
            </RouterLink>
          </div>
          <Popover.Group as='nav' className='hidden space-x-10 md:flex'>
            <NavLink to='/' className='text-base font-medium text-gray-600 hover:text-gray-900'>
              Home
            </NavLink>
            {isConnected ? (
              <NavLink
                to='/myprofile'
                className='text-base font-medium text-gray-600 hover:text-gray-900'
              >
                Profile
              </NavLink>
            ) : null}
            <NavLink
              to='/myquestions'
              className='text-base font-medium text-gray-600 hover:text-gray-900'
            >
              My Questions
            </NavLink>
            <NavLink
              to='/myanswers'
              className='text-base font-medium text-gray-600 hover:text-gray-900'
            >
              My Answers
            </NavLink>
            <NavLink to='/help' className='text-base font-medium text-gray-600 hover:text-gray-900'>
              Help!
            </NavLink>
          </Popover.Group>
          <div className='hidden items-center justify-end md:flex md:flex-1 lg:w-0'>
            <ConnectButton accountStatus={'address'} />
          </div>
        </div>
      </div>
    </Popover>
  );
}
