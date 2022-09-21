export const abi = [
  {
    inputs: [],
    name: 'QuestionAndAnswer__AllowanceTooLow',
    type: 'error',
  },
  {
    inputs: [],
    name: 'QuestionAndAnswer__BountyTooLow',
    type: 'error',
  },
  {
    inputs: [],
    name: 'QuestionAndAnswer__InvalidPriceMinimum',
    type: 'error',
  },
  {
    inputs: [],
    name: 'QuestionAndAnswer__QuestionDoesNotExist',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'questioner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'answerer',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'questionId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'bounty',
        type: 'uint256',
      },
    ],
    name: 'QuestionAnswered',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'questioner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'answerer',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'questionId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'bounty',
        type: 'uint256',
      },
    ],
    name: 'QuestionAsked',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'questioner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'answerer',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'questionId',
        type: 'uint256',
      },
    ],
    name: 'QuestionCanceled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'questioner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'answerer',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'questionId',
        type: 'uint256',
      },
    ],
    name: 'QuestionExpired',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'questioner',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'questionId',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'answer',
        type: 'string',
      },
    ],
    name: 'answerQuestion',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'answererToSettings',
    outputs: [
      {
        internalType: 'bool',
        name: 'populated',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: 'priceMinimum',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'question',
        type: 'string',
      },
      {
        internalType: 'address',
        name: 'answerer',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'bounty',
        type: 'uint256',
      },
    ],
    name: 'askQuestion',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'questioner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'answerer',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'getQuestionerToAnswererToQAs',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'priceMinimum',
        type: 'uint256',
      },
    ],
    name: 'setAnswererSettings',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'version',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
];
