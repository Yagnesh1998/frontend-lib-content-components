import React from 'react';
import { dispatch } from 'react-redux';
import { actions } from '../../../../../../data/redux';

import * as hooks from './hooks';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useRef: jest.fn(val => ({ current: val })),
  useEffect: jest.fn(),
  useCallback: (cb, prereqs) => ({ cb, prereqs }),
}));

jest.mock('react-redux', () => {
  const dispatchFn = jest.fn();
  return {
    ...jest.requireActual('react-redux'),
    dispatch: dispatchFn,
    useDispatch: jest.fn(() => dispatchFn),
  };
});

jest.mock('../../../../../../data/redux', () => ({
  actions: {
    video: {
      updateField: jest.fn(),
    },
  },
}));

let hook;
let setThumbnailSrc = jest.fn();
const testValue = 'testVALUEVALIDIMAGE';

describe('fileInput', () => {
  beforeEach(() => {
    hook = hooks.fileInput({ setThumbnailSrc });
  });
  it('returns a ref for the file input', () => {
    expect(hook.ref).toEqual({ current: undefined });
  });
  test('click calls current.click on the ref', () => {
    const click = jest.fn();
    React.useRef.mockReturnValueOnce({ current: { click } });
    hook = hooks.fileInput({ setThumbnailSrc });
    hook.click();
    expect(click).toHaveBeenCalled();
  });
  describe('addFile (uploadImage args)', () => {
    const eventSuccess = { target: { files: [new File([testValue], 'sOMEUrl.jpg')] } };
    it('dispatches updateField action with the first target file', () => {
      hook.addFile(eventSuccess);
      expect(dispatch).toHaveBeenCalledWith(actions.video.updateField({ thumbnail: testValue }));
    });
  });
});
