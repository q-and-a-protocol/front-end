import { useAccount, useEnsName } from 'wagmi';
import { Link as RouterLink } from 'react-router-dom';
import { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useEffect } from 'react';
import * as React from 'react';
import * as ethers from 'ethers';
import {
  CheckIcon,
  ChatBubbleLeftRightIcon,
  CheckBadgeIcon,
  XMarkIcon,
} from '@heroicons/react/20/solid';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { tooltipClasses } from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

const GET_ALL_QUESTIONS = gql`
  {
    newsfeedEvents {
      id
      questioner
      answerer
      questionId
      bounty
      date
      answered
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

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}));

export function Home() {
  const { address: myAddress } = useAccount();
  const [inputAddress, setInputAddress] = useState('');
  const { data: allQuestions } = useQuery(GET_ALL_QUESTIONS);
  const { data: allUsers } = useQuery(GET_ALL_USERS);
  const provider = ethers.getDefaultProvider();

  const [timeline, setTimeline] = useState([]);
  const [userMapping, setUserMapping] = useState({});
  const [formattedAddresses, setFormattedAddresses] = useState({});
  const [count, setCount] = useState({});

  useEffect(() => {
    if (!allQuestions) {
      setTimeline([]);
    } else if (!allQuestions.newsfeedEvents) {
      setTimeline([]);
    } else {
      setTimeline(
        allQuestions?.newsfeedEvents
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
  }, [allQuestions, userMapping]);

  useEffect(() => {
    if (!allQuestions || !allQuestions.newsfeedEvents) return;
    else {
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

      allQuestions.newsfeedEvents.forEach((e) => {
        formatAddress(e.answerer).then((result) => {
          setFormattedAddresses((prevState) => ({ ...prevState, [e.answerer]: result }));
        });
        formatAddress(e.questioner).then((result) => {
          setFormattedAddresses((prevState) => ({ ...prevState, [e.questioner]: result }));
        });
        setCount((prevState) => {
          if (!prevState[e.questioner]) {
            return {
              ...prevState,
              [e.questioner]: {
                questionCount: 1,
                answerCount: 0,
              },
            };
          } else {
            return {
              ...prevState,
              [e.questioner]: {
                ...prevState[e.questioner],
                questionCount: prevState[e.questioner].questionCount + 1,
              },
            };
          }
        });
        setCount((prevState) => {
          if (!prevState[e.answerer]) {
            return {
              ...prevState,
              [e.answerer]: {
                questionCount: 0,
                answerCount: e.answered ? 1 : 0,
              },
            };
          } else {
            return {
              ...prevState,
              [e.answerer]: {
                ...prevState[e.answerer],
                answerCount: prevState[e.answerer].answerCount + (e.answered ? 1 : 0),
              },
            };
          }
        });
      });
    }
  }, [allQuestions]);

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
                        <p className='text-sm text-gray-500 flex flex-row'>
                          <HtmlTooltip
                            title={
                              <React.Fragment>
                                <Typography color='inherit'>
                                  Asked: {count[event.source]?.questionCount} Questions
                                </Typography>
                                <Typography color='inherit'>
                                  Answered: {count[event.source]?.answerCount} Questions
                                </Typography>
                                <Typography color='inherit'>
                                  Verified: {event.sourceHasAskedAnswered ? 'Yes' : 'No'}
                                </Typography>
                                <br />
                                What does all of this mean? This user has <b>asked</b>{' '}
                                {count[event.source]?.questionCount} questions and <b>answered</b>{' '}
                                {count[event.source]?.answerCount} questions. They are{' '}
                                {event.sourceHasAskedAnswered ? '' : 'not'}verified because they
                                were active recently.
                              </React.Fragment>
                            }
                          >
                            <RouterLink
                              to={event.to + event.source}
                              className='font-medium text-gray-900 pr-2 flex flex-row items-center'
                            >
                              {formattedAddresses[event.source] || 'Loading...'}
                              {event.sourceHasAskedAnswered ? (
                                <CheckBadgeIcon
                                  className='inline h-4 w-4 text-green-600 ml-1'
                                  aria-hidden='true'
                                />
                              ) : null}
                            </RouterLink>
                          </HtmlTooltip>
                          {event.content}{' '}
                          <HtmlTooltip
                            title={
                              <React.Fragment>
                                <Typography color='inherit'>
                                  Asked: {count[event.target]?.questionCount} Questions
                                </Typography>
                                <Typography color='inherit'>
                                  Answered: {count[event.target]?.answerCount} Questions
                                </Typography>
                                <Typography color='inherit'>
                                  Verified: {event.targetHasAskedAnswered ? 'Yes' : 'No'}
                                </Typography>
                                <br />
                                What does all of this mean? This user has <b>asked</b>{' '}
                                {count[event.target]?.questionCount} questions and <b>answered</b>{' '}
                                {count[event.target]?.answerCount} questions. They are{' '}
                                {event.targetHasAskedAnswered ? '' : 'not '}verified because they
                                were {event.targetHasAskedAnswered ? '' : ' not '} active recently.
                              </React.Fragment>
                            }
                          >
                            <RouterLink
                              to={event.to + event.target}
                              className='font-medium text-gray-900 ml-2 flex flex-row items-center'
                            >
                              {formattedAddresses[event.target] || 'Loading...'}
                              {event.targetHasAskedAnswered ? (
                                <Tooltip title='Verified! This user has asked or answered a question recently.'>
                                  <CheckBadgeIcon
                                    className='inline h-4 w-4 text-green-600 ml-1'
                                    aria-hidden='true'
                                  />
                                </Tooltip>
                              ) : null}
                            </RouterLink>
                          </HtmlTooltip>
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
