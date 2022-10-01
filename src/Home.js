import { useAccount, useDisconnect, useEnsName, useNetwork } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { Link as RouterLink } from 'react-router-dom';
import { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useEffect } from 'react';
import * as ethers from 'ethers';
import { CheckIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/20/solid';

const GET_ALL_QUESTIONS = gql`
  {
    newsfeedEvents(first: 20) {
      id
      questioner
      answerer
      questionId
      bounty
      date
      answered
    }
  }
`;

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const isToday = (someDate) => {
  const today = new Date();
  return (
    someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
  );
};

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function Home() {
  const { address: myAddress, isConnected } = useAccount();
  const [inputAddress, setInputAddress] = useState('');
  const { loading, error, data } = useQuery(GET_ALL_QUESTIONS);
  const { data: ensName } = useEnsName();

  const [timeline, setTimeline] = useState([]);

  function formatAddress(address) {
    let result;
    if (myAddress && ethers.utils.getAddress(address) == ethers.utils.getAddress(myAddress)) {
      return 'You';
    }
    const formattedAddress = address.slice(0, 6) + '...' + address.slice(-4);
    result = ensName ? ensName : formattedAddress;
    return result;
  }

  useEffect(() => {
    if (!data) setTimeline([]);
    else if (!data.newsfeedEvents) setTimeline([]);
    else {
      setTimeline(
        data?.newsfeedEvents
          ?.slice()
          .sort((a, b) => b.date - a.date)
          .map((e) => {
            const date = new Date(e.date * 1000);
            const time = date.toLocaleString('en-US', {
              hour: 'numeric',
              hour12: true,
              minute: 'numeric',
            });
            const getExtraDate = months[date.getMonth()] + ' ' + date.getDate() + ' ';
            return {
              id: e.id,
              source: e.questioner,
              content: `asked a question to`,
              target: e.answerer,
              to: '/profile/',
              date: !isToday(date) ? getExtraDate + time : time,
              icon: e.answered ? CheckIcon : ChatBubbleLeftRightIcon,
              iconBackground: e.answered ? 'bg-green-600' : 'bg-indigo-600',
              bounty: e.bounty,
            };
          })
      );
    }
  }, [data]);

  return (
    <div className='bg-white sm:rounded-lg '>
      <div className='px-4 py-5 sm:p-6 '>
        <form className='mt-5 sm:flex justify-center'>
          <div className='w-2/3'>
            <label htmlFor='address' className='sr-only'>
              Address
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
        <div className='flow-root mt-10 w-4/6 mx-auto'>
          <ul role='list' className='-mb-8'>
            {timeline.map((event, eventIdx) => (
              <li key={event.id}>
                <div className='relative pb-8'>
                  {eventIdx !== timeline.length - 1 ? (
                    <span
                      className='absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200'
                      aria-hidden='true'
                    />
                  ) : null}
                  <div className='relative flex space-x-3'>
                    <div>
                      <span
                        className={classNames(
                          event.iconBackground,
                          'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white'
                        )}
                      >
                        <event.icon className='h-5 w-5 text-white' aria-hidden='true' />
                      </span>
                    </div>
                    <div className='flex min-w-0 flex-1 justify-between space-x-4 pt-1.5'>
                      <div>
                        <p className='text-sm text-gray-500'>
                          <RouterLink
                            to={event.to + event.source}
                            className='font-medium text-gray-900 pr-2'
                          >
                            {formatAddress(event.source)}
                          </RouterLink>
                          {event.content}{' '}
                          <RouterLink
                            to={event.to + event.target}
                            className='font-medium text-gray-900'
                          >
                            {formatAddress(event.target)}
                          </RouterLink>
                        </p>
                      </div>
                      <div className='whitespace-nowrap text-right text-sm text-gray-500'>
                        <div className='text-green-600'>
                          ${Number(ethers.utils.formatUnits(event.bounty).toString())}
                        </div>
                        <time>{event.date}</time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
