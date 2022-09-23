import { useAccount, useConnect, useDisconnect, useEnsName } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { Link as RouterLink } from 'react-router-dom';
import { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useEffect } from 'react';
import * as ethers from 'ethers';
import {
  CheckIcon,
  HandThumbUpIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/20/solid';

const GET_ALL_QUESTIONS = gql`
  {
    newsfeedEvents(first: 20) {
      id
      questioner
      answerer
      questionId
      bounty
    }
  }
`;

// const timeline = [
//   {
//     id: 1,
//     content: 'Applied to',
//     target: 'Front End Developer',
//     href: '#',
//     date: 'Sep 20',
//     datetime: '2020-09-20',
//     icon: UserIcon,
//     iconBackground: 'bg-gray-400',
//   },
//   {
//     id: 2,
//     content: 'Advanced to phone screening by',
//     target: 'Bethany Blake',
//     href: '#',
//     date: 'Sep 22',
//     datetime: '2020-09-22',
//     icon: HandThumbUpIcon,
//     iconBackground: 'bg-blue-500',
//   },
//   {
//     id: 3,
//     content: 'Completed phone screening with',
//     target: 'Martha Gardner',
//     href: '#',
//     date: 'Sep 28',
//     datetime: '2020-09-28',
//     icon: CheckIcon,
//     iconBackground: 'bg-green-500',
//   },
//   {
//     id: 4,
//     content: 'Advanced to interview by',
//     target: 'Bethany Blake',
//     href: '#',
//     date: 'Sep 30',
//     datetime: '2020-09-30',
//     icon: HandThumbUpIcon,
//     iconBackground: 'bg-blue-500',
//   },
//   {
//     id: 5,
//     content: 'Completed interview with',
//     target: 'Katherine Snyder',
//     href: '#',
//     date: 'Oct 4',
//     datetime: '2020-10-04',
//     icon: CheckIcon,
//     iconBackground: 'bg-green-500',
//   },
// ];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function Home() {
  const { address, isConnected } = useAccount();
  const [inputAddress, setInputAddress] = useState('');
  const { loading, error, data } = useQuery(GET_ALL_QUESTIONS);
  const { data: ensName } = useEnsName();

  const [timeline, setTimeline] = useState([]);

  function formatAddress(address) {
    const formattedAddress = address.slice(0, 6) + '...' + address.slice(-4);
    return ensName ? ensName : formattedAddress;
  }

  useEffect(() => {
    if (!data) setTimeline([]);
    else if (!data.newsfeedEvents) setTimeline([]);
    else {
      console.log(data.newsfeedEvents);
      setTimeline(
        data?.newsfeedEvents?.map((e) => {
          return {
            id: e.id,
            source: e.questioner,
            content: `asked a question to`,
            target: e.answerer,
            to: '/profile/',
            date: 'Sep 20',
            datetime: '2020-09-20',
            icon: ChatBubbleLeftRightIcon,
            iconBackground: 'bg-indigo-600',
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
        <div className='flow-root mt-10 w-5/6 mx-auto'>
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
                        <time dateTime={event.datetime}>{event.date}</time>
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
