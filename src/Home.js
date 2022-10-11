import { Link as RouterLink } from 'react-router-dom';
import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { useEffect } from 'react';
import * as React from 'react';
import * as ethers from 'ethers';
import { DisplayName } from './components/DisplayName';
import { USDC_DECIMALS } from './constants/misc';
import { GET_ALL_USERS, GET_ALL_QUESTIONS } from './api/api';
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
  const [inputAddress, setInputAddress] = useState('');
  const { data: allQuestions, startPolling: startPollingGAQ } = useQuery(GET_ALL_QUESTIONS);
  const { data: allUsers, startPolling: startPollingGAU } = useQuery(GET_ALL_USERS);

  const [timeline, setTimeline] = useState([]);
  const [userMapping, setUserMapping] = useState({});

  const recommendedUser1 = '0x27f940eb8fa6740e38a20214592cece329bde8df';
  const recommendedUser2 = '0x8c79ccb572d5dcd96af6734ba1e5019d98fcafc4';

  useEffect(() => {
    startPollingGAQ(1000);
  }, [startPollingGAQ]);

  useEffect(() => {
    startPollingGAU(1000);
  }, [startPollingGAU]);

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
        <div className='mt-10 w-9/12 mx-auto flex flex-col border border-slate-100 py-4 px-4 rounded-lg'>
          <h2 className='w-full font-bold text-lg'>Recommended Users</h2>
          <p className='w-full font-normal text-base text-gray-400'>
            Ask these recommended users a question!
          </p>
          <div className='flex flex-row items-center mt-3'>
            <div className='inline-block w-1/3 flex justify-center items-center'>
              <HtmlTooltip
                title={
                  <React.Fragment>
                    <Typography color='inherit'>Power User: Yes</Typography>
                    <Typography color='inherit'>
                      Asked: {userMapping[recommendedUser1]?.numberOfQuestionsAsked} Questions
                    </Typography>
                    <Typography color='inherit'>
                      Answered: {userMapping[recommendedUser1]?.numberOfQuestionsAnswered} Questions
                    </Typography>
                    <br />
                    What does all of this mean? Click their display name for an explanation and to
                    get even more details on this user!
                  </React.Fragment>
                }
              >
                <RouterLink
                  to={`/profile/${recommendedUser1}`}
                  className='font-medium text-gray-900 pr-2 flex flex-row items-center'
                >
                  <DisplayName className='font-medium text-gray-900' address={recommendedUser1} />
                  <CheckBadgeIcon
                    className='inline h-4 w-4 text-indigo-600 ml-1'
                    aria-hidden='true'
                  />
                </RouterLink>
              </HtmlTooltip>
            </div>
            <div className='inline-block w-1/3 flex justify-center items-center'>
              <HtmlTooltip
                title={
                  <React.Fragment>
                    <Typography color='inherit'>Power User: Yes</Typography>
                    <Typography color='inherit'>
                      Asked: {userMapping[recommendedUser2]?.numberOfQuestionsAsked} Questions
                    </Typography>
                    <Typography color='inherit'>
                      Answered: {userMapping[recommendedUser2]?.numberOfQuestionsAnswered} Questions
                    </Typography>
                    <br />
                    What does all of this mean? Click their display name for an explanation and to
                    get even more details on this user!
                  </React.Fragment>
                }
              >
                <RouterLink
                  to={`/profile/${recommendedUser2}`}
                  className='font-medium text-gray-900 pr-2 flex flex-row items-center'
                >
                  <DisplayName className='font-medium text-gray-900' address={recommendedUser2} />
                  <CheckBadgeIcon
                    className='inline h-4 w-4 text-indigo-600 ml-1'
                    aria-hidden='true'
                  />
                </RouterLink>
              </HtmlTooltip>
            </div>
          </div>
        </div>
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
                                  Power User: {event.sourceHasAskedAnswered ? 'Yes' : 'No'}
                                </Typography>
                                <Typography color='inherit'>
                                  Asked: {userMapping[event.source]?.numberOfQuestionsAsked}{' '}
                                  Questions
                                </Typography>
                                <Typography color='inherit'>
                                  Answered: {userMapping[event.source]?.numberOfQuestionsAnswered}{' '}
                                  Questions
                                </Typography>
                                <br />
                                What does all of this mean? Click their display name for an
                                explanation and to get even more details on this user!
                              </React.Fragment>
                            }
                          >
                            <RouterLink
                              to={event.to + event.source}
                              className='font-medium text-gray-900 pr-2 flex flex-row items-center'
                            >
                              <DisplayName address={event.source} />
                              {event.sourceHasAskedAnswered ? (
                                <CheckBadgeIcon
                                  className='inline h-4 w-4 text-indigo-600 ml-1'
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
                                  Power User: {event.targetHasAskedAnswered ? 'Yes' : 'No'}
                                </Typography>
                                <Typography color='inherit'>
                                  Asked: {userMapping[event.target]?.numberOfQuestionsAsked}{' '}
                                  Questions
                                </Typography>
                                <Typography color='inherit'>
                                  Answered: {userMapping[event.target]?.numberOfQuestionsAnswered}{' '}
                                  Questions
                                </Typography>
                                <br />
                                What does all of this mean? Click their display name for an
                                explanation and to get even more details on this user!
                              </React.Fragment>
                            }
                          >
                            <RouterLink
                              to={event.to + event.target}
                              className='font-medium text-gray-900 ml-2 flex flex-row items-center'
                            >
                              <DisplayName address={event.target} />
                              {event.targetHasAskedAnswered ? (
                                <Tooltip title='Power User! This user has asked or answered a question recently.'>
                                  <CheckBadgeIcon
                                    className='inline h-4 w-4 text-indigo-600 ml-1'
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
                          $
                          {Number(
                            ethers.utils.formatUnits(event.bounty, USDC_DECIMALS).toString()
                          ).toFixed(2)}
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
