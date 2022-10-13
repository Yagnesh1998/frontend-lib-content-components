import { StrictDict } from '../../utils';

export const ProblemTypeKeys = StrictDict({
  TEXTINPUT: 'stringresponse',
  NUMERIC: 'numericalresponse',
  DROPDOWN: 'optionresponse',
  MULTISELECT: 'choiceresponse',
  SINGLESELECT: 'multiplechoiceresponse',
});

export const ProblemTypes = StrictDict({
  [ProblemTypeKeys.SINGLESELECT]: {
    title: 'Single Select Problem',
    preview: ('<div />'),
    description: 'Specify one correct answer from a list of possible options',
    helpLink: 'something.com',
  },
  [ProblemTypeKeys.MULTISELECT]: {
    title: 'Multi Select Problem',
    preview: ('<div />'),
    description: 'Specify one or more correct answers from a list of possible options.',
    helpLink: 'something.com',
  },
  [ProblemTypeKeys.DROPDOWN]: {
    title: 'Dropdown Problem',
    preview: ('<div />'),
    description: 'Specify one correct answer from a list of possible options, selected in a dropdown menu.',
    helpLink: 'something.com',
  },
  [ProblemTypeKeys.NUMERIC]: {
    title: 'Numeric Response Problem',
    preview: ('<div />'),
    description: 'Specify one or more correct numeric answers, submitted in a response field.',
    helpLink: 'something.com',
  },
  [ProblemTypeKeys.TEXTINPUT]: {
    title: 'Text Input Problem',
    preview: ('<div />'),
    description: 'Specify one or more correct text answers, including numbers and special characters, submitted in a response field.',
    helpLink: 'something.com',
  },
});