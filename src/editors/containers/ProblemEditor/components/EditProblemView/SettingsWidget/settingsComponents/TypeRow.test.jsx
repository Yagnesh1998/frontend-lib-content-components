import React from 'react';
import { shallow } from 'enzyme';
import { TypeRow } from './TypeRow';
import { typeRowHooks } from '../hooks';

jest.mock('../hooks', () => ({
  typeRowHooks: jest.fn(),
}));

describe('TypeRow', () => {
  const typeKey = 'TEXTINPUT';
  const props = {
    answers: [],
    correctAnswerCount: 0,
    typeKey,
    label: 'Text Input Problem',
    selected: true,
    lastRow: false,
    updateField: jest.fn().mockName('args.updateField'),
    updateAnswer: jest.fn().mockName('args.updateAnswer'),
  };

  const typeRowHooksProps = {
    onClick: jest.fn().mockName('typeRowHooks.onClick'),
  };

  typeRowHooks.mockReturnValue(typeRowHooksProps);

  describe('behavior', () => {
    it(' calls typeRowHooks when initialized', () => {
      shallow(<TypeRow {...props} />);
      expect(typeRowHooks).toHaveBeenCalledWith({
        answers: props.answers,
        correctAnswerCount: props.correctAnswerCount,
        typeKey, 
        updateField: props.updateField,
        updateAnswer: props.updateAnswer,
      });
    });
  });

  describe('snapshot', () => {
    test('snapshot: renders type row setting card', () => {
      expect(shallow(<TypeRow {...props} />)).toMatchSnapshot();
    });
    test('snapshot: renders type row setting card not selected', () => {
      expect(shallow(<TypeRow {...props} selected={false} />)).toMatchSnapshot();
    });
    test('snapshot: renders type row setting card last row', () => {
      expect(shallow(<TypeRow {...props} lastRow />)).toMatchSnapshot();
    });
  });
});
