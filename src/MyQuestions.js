import { useEffect, useState } from 'react';
import { useContract, useProvider, useContractRead, useAccount, useEnsName } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { abi } from './contractInformation/QuestionAndAnswer-abi';
import { useQuery, gql } from '@apollo/client';
import { Link as RouterLink, Router } from 'react-router-dom';
import * as ethers from 'ethers';
import { CheckIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/20/solid';

const questionAndAnswerAddress = process.env.REACT_APP_QUESTION_AND_ANSWER_ADDRESS;
const exampleERC20Address = process.env.REACT_APP_EXAMPLE_ERC20_ADDRESS;

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function MyQuestions() {
  const { address, isConnected } = useAccount();
  const provider = useProvider();
  const { data: ensName } = useEnsName();

  function formatAddress(address) {
    const formattedAddress = address.slice(0, 6) + '...' + address.slice(-4);
    return ensName ? ensName : formattedAddress;
  }

  const GET_MY_QUESTIONS = gql`
    query GetMyQuestions($address: Bytes!) {
      questionAskeds(first: 20, where: { questioner: $address }) {
        id
        questioner
        answerer
        questionId
        bounty
        date
        question
      }
    }
  `;

  const { data: myQuestions } = useQuery(GET_MY_QUESTIONS, {
    variables: { address },
  });

  // useEffect(() => {
  //   console.log(address);
  //   console.log(myQuestions);
  //   if (myQuestions?.questionAskeds) {
  //     console.log(myQuestions.questionAskeds);
  //   }
  // }, [myQuestions, address]);

  const [questionsFeed, setQuestionsFeed] = useState([]);

  useEffect(() => {
    console.log(myQuestions);
    if (!myQuestions) setQuestionsFeed([]);
    else if (!myQuestions.questionAskeds) setQuestionsFeed([]);
    else {
      setQuestionsFeed(
        myQuestions?.questionAskeds
          ?.slice()
          .sort((a, b) => b.date - a.date)
          .map((e) => {
            console.log(e);
            const date = new Date(e.date * 1000);
            const hours = date.getHours() % 12;
            const minutes = date.getMinutes() + (date.getHours() > 12 ? 'pm' : 'am');
            return {
              id: e.id,
              source: e.questioner,
              target: e.answerer,
              index: e.questionId,
              content: `asked you a question:`,
              question: e.question,
              to: '/question/',
              date: `${hours}:${minutes}`,
              icon: ChatBubbleLeftRightIcon,
              iconBackground: 'bg-indigo-600',
              bounty: e.bounty,
            };
          })
      );
    }
  }, [myQuestions]);

  return (
    <div className='bg-white sm:rounded-lg '>
      <div className='px-4 py-5 sm:p-6 '>
        <div className='flow-root mt-10 w-5/6 mx-auto'>
          <ul role='list' className='-mb-8'>
            {questionsFeed.map((event, eventIdx) => (
              <RouterLink
                to={event.to + event.source + '/' + event.target + '/' + event.index}
                key={event.id}
              >
                <li>
                  <div className='relative pb-8'>
                    {eventIdx !== questionsFeed.length - 1 ? (
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
                            <span className='font-medium text-gray-900 pr-2'>
                              {formatAddress(event.source)}
                            </span>
                            {event.content}
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
        </div>
      </div>
    </div>
  );
}
