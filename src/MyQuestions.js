import { useEffect, useState } from 'react';
import { useAccount, useEnsName } from 'wagmi';
import { useQuery, gql } from '@apollo/client';
import { Link as RouterLink } from 'react-router-dom';
import * as ethers from 'ethers';
import {
  CheckIcon,
  ChatBubbleLeftRightIcon,
  CheckBadgeIcon,
  XMarkIcon,
} from '@heroicons/react/20/solid';
import Tooltip from '@mui/material/Tooltip';

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

const GET_MY_QUESTIONS_WHEN_ANSWERER = gql`
  query GetMyQuestionsWhenAnswerer($address: Bytes!) {
    newsfeedEvents(first: 20, where: { answerer: $address }) {
      id
      questioner
      answerer
      questionId
      bounty
      date
      answered
      question
      answer
      expiryDate
      expired
    }
  }
`;

const GET_MY_QUESTIONS_WHEN_QUESTIONER = gql`
  query GetMyQuestionsWhenQuestioner($address: Bytes!) {
    newsfeedEvents(first: 20, where: { questioner: $address }) {
      id
      questioner
      answerer
      questionId
      bounty
      date
      answered
      question
      answer
      expiryDate
      expired
    }
  }
`;

const GET_ALL_USERS = gql`
  {
    users {
      id
      address
      hasAsked
      hasAnswered
      lastActivityDate
    }
  }
`;

export function MyQuestions() {
  const { address: myAddress } = useAccount();
  const { data: ensName } = useEnsName();
  const [userMapping, setUserMapping] = useState({});

  function formatAddress(address) {
    let result;
    if (myAddress && ethers.utils.getAddress(address) == ethers.utils.getAddress(myAddress)) {
      return 'You';
    }
    const formattedAddress = address.slice(0, 6) + '...' + address.slice(-4);
    result = ensName ? ensName : formattedAddress;
    return result;
  }

  const { data: myQuestionsWhenAnswerer } = useQuery(GET_MY_QUESTIONS_WHEN_ANSWERER, {
    variables: { address: myAddress },
  });

  const { data: myQuestionsWhenQuestioner } = useQuery(GET_MY_QUESTIONS_WHEN_QUESTIONER, {
    variables: { address: myAddress },
  });

  const { data: allUsers } = useQuery(GET_ALL_USERS);

  const [questionsFeedWhenQuestioner, setQuestionsFeedWhenQuestioner] = useState([]);
  const [questionsFeedWhenAnswerer, setQuestionsFeedWhenAnswerer] = useState([]);

  useEffect(() => {
    if (!myQuestionsWhenAnswerer) setQuestionsFeedWhenAnswerer([]);
    else if (!myQuestionsWhenAnswerer.newsfeedEvents) setQuestionsFeedWhenAnswerer([]);
    else {
      setQuestionsFeedWhenAnswerer(
        myQuestionsWhenAnswerer?.newsfeedEvents
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
              target: e.answerer,
              index: e.questionId,
              contentPre: 'asked',
              contentPost: 'a question:',
              question: e.question,
              to: '/question/',
              toProfile: '/profile/',
              date: e.expired ? 'Canceled / Expired' : !isToday(date) ? getExtraDate + time : time,
              expired: e.expired,
              icon: e.expired ? XMarkIcon : e.answered ? CheckIcon : ChatBubbleLeftRightIcon,
              iconBackground: e.expired
                ? 'bg-red-600'
                : e.answered
                ? 'bg-green-600'
                : 'bg-indigo-600',
              bounty: e.bounty,
              sourceHasAskedAnswered:
                userMapping[e.questioner]?.hasAsked || userMapping[e.questioner]?.hasAnswered,
              targetHasAskedAnswered:
                userMapping[e.answerer]?.hasAsked || userMapping[e.answerer]?.hasAnswered,
            };
          })
      );
    }
  }, [myQuestionsWhenAnswerer, userMapping]);

  useEffect(() => {
    if (!myQuestionsWhenQuestioner) setQuestionsFeedWhenQuestioner([]);
    else if (!myQuestionsWhenQuestioner.newsfeedEvents) setQuestionsFeedWhenQuestioner([]);
    else {
      setQuestionsFeedWhenQuestioner(
        myQuestionsWhenQuestioner?.newsfeedEvents
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
              target: e.answerer,
              index: e.questionId,
              contentPre: 'asked',
              contentPost: 'a question:',
              question: e.question,
              to: '/question/',
              toProfile: '/profile/',
              date: e.expired ? 'Canceled / Expired' : !isToday(date) ? getExtraDate + time : time,
              expired: e.expired,
              icon: e.expired ? XMarkIcon : e.answered ? CheckIcon : ChatBubbleLeftRightIcon,
              iconBackground: e.expired
                ? 'bg-red-600'
                : e.answered
                ? 'bg-green-600'
                : 'bg-indigo-600',
              bounty: e.bounty,
              sourceHasAskedAnswered:
                userMapping[e.questioner]?.hasAsked || userMapping[e.questioner]?.hasAnswered,
              targetHasAskedAnswered:
                userMapping[e.answerer]?.hasAsked || userMapping[e.answerer]?.hasAnswered,
            };
          })
      );
    }
  }, [myQuestionsWhenQuestioner, userMapping]);

  useEffect(() => {
    if (!allUsers) setUserMapping({});
    else if (!allUsers.users) setUserMapping({});
    else {
      const mapping = {};
      allUsers.users.forEach((e) => {
        mapping[e.address] = e;
      });
      setUserMapping(mapping);
    }
  }, [allUsers]);

  return (
    <div className='bg-white sm:rounded-lg '>
      <div className='px-4 py-5 sm:p-6 '>
        <section className='w-4/6 mx-auto'>
          <dl className='mt-2 divide-y divide-slate-100'>
            <details className='group py-4 marker:content-[""]' open>
              <summary className='flex w-full cursor-pointer select-none justify-between text-left text-base font-bold text-xl leading-7 text-slate-900 group-open:text-indigo-600 [&::-webkit-details-marker]:hidden'>
                Questions you have been asked:
                <svg
                  className='mt-0.5 ml-4 h-6 w-6 flex-none stroke-slate-700 group-open:stroke-indigo-500'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M18 12H6'></path>
                  <path className='group-open:hidden' d='M12 6v12'></path>
                </svg>
              </summary>
              <div className='pt-6 pb-6'>
                <div className='prose prose-slate max-w-none prose-a:font-semibold prose-a:text-indigo-600 hover:prose-a:text-indigo-500'>
                  <div className='flow-root mt-10 w-11/12 mx-auto'>
                    {questionsFeedWhenAnswerer.length === 0 ? (
                      <div>You haven't been asked a question yet!</div>
                    ) : (
                      <ul role='list' className='-mb-8'>
                        {questionsFeedWhenAnswerer.map((event, eventIdx) => (
                          <RouterLink
                            to={event.to + event.source + '/' + event.target + '/' + event.index}
                            key={event.id}
                          >
                            <li>
                              <div className='relative pb-8'>
                                {eventIdx !== questionsFeedWhenAnswerer.length - 1 ? (
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
                                      <event.icon
                                        className='h-5 w-5 text-white'
                                        aria-hidden='true'
                                      />
                                    </span>
                                  </div>
                                  <div className='flex min-w-0 flex-1 justify-between space-x-4 pt-1.5'>
                                    <div>
                                      <p className='text-sm text-gray-500 flex flex-row'>
                                        <RouterLink
                                          to={event.toProfile + event.source}
                                          className='font-medium text-gray-900 pr-2 flex flex-row items-center'
                                        >
                                          {formatAddress(event.source)}
                                          {event.sourceHasAskedAnswered ? (
                                            <Tooltip title='Verified! This user has asked or answered a question recently.'>
                                              <CheckBadgeIcon
                                                className='inline h-4 w-4 text-green-600 ml-1'
                                                aria-hidden='true'
                                              />
                                            </Tooltip>
                                          ) : null}
                                        </RouterLink>
                                        {event.contentPre}
                                        <RouterLink
                                          to={event.toProfile + event.target}
                                          className='font-medium text-gray-900 mx-2 flex flex-row items-center'
                                        >
                                          {formatAddress(event.target)}
                                          {event.targetHasAskedAnswered ? (
                                            <Tooltip title='Verified! This user has asked or answered a question recently.'>
                                              <CheckBadgeIcon
                                                className='inline h-4 w-4 text-green-600 ml-1'
                                                aria-hidden='true'
                                              />
                                            </Tooltip>
                                          ) : null}
                                        </RouterLink>
                                        {event.contentPost}
                                      </p>
                                      <p className='text-md text-gray-800 my-3'>{event.question}</p>
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
                          </RouterLink>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </details>
            <details className='group py-4 marker:content-[""]'>
              <summary className='flex w-full cursor-pointer select-none justify-between text-left text-base font-bold text-xl leading-7 text-slate-900 group-open:text-indigo-600 [&::-webkit-details-marker]:hidden'>
                Questions you have asked others:
                <svg
                  className='mt-0.5 ml-4 h-6 w-6 flex-none stroke-slate-700 group-open:stroke-indigo-500'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M18 12H6'></path>
                  <path className='group-open:hidden' d='M12 6v12'></path>
                </svg>
              </summary>
              <div className='pt-6 pb-6'>
                <div className='prose prose-slate max-w-none prose-a:font-semibold prose-a:text-indigo-600 hover:prose-a:text-indigo-500'>
                  <div className='flow-root mt-10 w-11/12 mx-auto'>
                    {questionsFeedWhenQuestioner.length === 0 ? (
                      <div>You haven't asked a question yet!</div>
                    ) : (
                      <ul role='list' className='-mb-8'>
                        {questionsFeedWhenQuestioner.map((event, eventIdx) => (
                          <RouterLink
                            to={event.to + event.source + '/' + event.target + '/' + event.index}
                            key={event.id}
                          >
                            <li>
                              <div className='relative pb-8'>
                                {eventIdx !== questionsFeedWhenQuestioner.length - 1 ? (
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
                                      <event.icon
                                        className='h-5 w-5 text-white'
                                        aria-hidden='true'
                                      />
                                    </span>
                                  </div>
                                  <div className='flex min-w-0 flex-1 justify-between space-x-4 pt-1.5'>
                                    <div>
                                      <p className='text-sm text-gray-500 flex flex-row'>
                                        <RouterLink
                                          to={event.toProfile + event.source}
                                          className='font-medium text-gray-900 pr-2 flex flex-row items-center'
                                        >
                                          {formatAddress(event.source)}
                                          {event.sourceHasAskedAnswered ? (
                                            <Tooltip title='Verified! This user has asked or answered a question recently.'>
                                              <CheckBadgeIcon
                                                className='inline h-4 w-4 text-green-600 ml-1'
                                                aria-hidden='true'
                                              />
                                            </Tooltip>
                                          ) : null}
                                        </RouterLink>
                                        {event.contentPre}
                                        <RouterLink
                                          to={event.toProfile + event.target}
                                          className='font-medium text-gray-900 mx-2 flex flex-row items-center'
                                        >
                                          {formatAddress(event.target)}
                                          {event.targetHasAskedAnswered ? (
                                            <Tooltip title='Verified! This user has asked or answered a question recently.'>
                                              <CheckBadgeIcon
                                                className='inline h-4 w-4 text-green-600 ml-1'
                                                aria-hidden='true'
                                              />
                                            </Tooltip>
                                          ) : null}
                                        </RouterLink>
                                        {event.contentPost}
                                      </p>
                                      <p className='text-md text-gray-800 my-3'>{event.question}</p>
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
                          </RouterLink>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </details>
          </dl>
        </section>
      </div>
    </div>
  );
}
