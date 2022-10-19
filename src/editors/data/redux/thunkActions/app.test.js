import { actions } from '..';
import { camelizeKeys } from '../../../utils';
import * as thunkActions from './app';

jest.mock('./requests', () => ({
  fetchBlock: (args) => ({ fetchBlock: args }),
  fetchUnit: (args) => ({ fetchUnit: args }),
  saveBlock: (args) => ({ saveBlock: args }),
  fetchImages: (args) => ({ fetchImages: args }),
  uploadImage: (args) => ({ uploadImage: args }),
  fetchStudioView: (args) => ({ fetchStudioView: args }),
  fetchAssets: (args) => ({ fetchAssets: args }),
}));

jest.mock('../../../utils', () => ({
  camelizeKeys: (args) => ([{ camelizeKeys: args }]),
  ...jest.requireActual('../../../utils'),
}));

const testValue = { data: { assets: 'test VALUE' } };

describe('app thunkActions', () => {
  let dispatch;
  let dispatchedAction;
  beforeEach(() => {
    dispatch = jest.fn((action) => ({ dispatch: action }));
  });
  describe('fetchBlock', () => {
    beforeEach(() => {
      thunkActions.fetchBlock()(dispatch);
      [[dispatchedAction]] = dispatch.mock.calls;
    });
    it('dispatches fetchBlock action', () => {
      expect(dispatchedAction.fetchBlock).not.toEqual(undefined);
    });
    it('dispatches actions.app.setBlockValue on success', () => {
      dispatch.mockClear();
      dispatchedAction.fetchBlock.onSuccess(testValue);
      expect(dispatch).toHaveBeenCalledWith(actions.app.setBlockValue(testValue));
    });
  });

  describe('fetchStudioView', () => {
    beforeEach(() => {
      thunkActions.fetchStudioView()(dispatch);
      [[dispatchedAction]] = dispatch.mock.calls;
    });
    it('dispatches fetchStudioView action', () => {
      expect(dispatchedAction.fetchStudioView).not.toEqual(undefined);
    });
    it('dispatches actions.app.setStudioViewe on success', () => {
      dispatch.mockClear();
      dispatchedAction.fetchStudioView.onSuccess(testValue);
      expect(dispatch).toHaveBeenCalledWith(actions.app.setStudioView(testValue));
    });
    it('dispatches setStudioView on failure', () => {
      dispatch.mockClear();
      dispatchedAction.fetchStudioView.onFailure(testValue);
      expect(dispatch).toHaveBeenCalledWith(actions.app.setStudioView(testValue));
    });
  });

  describe('fetchUnit', () => {
    beforeEach(() => {
      thunkActions.fetchUnit()(dispatch);
      [[dispatchedAction]] = dispatch.mock.calls;
    });
    it('dispatches fetchUnit action', () => {
      expect(dispatchedAction.fetchUnit).not.toEqual(undefined);
    });
    it('dispatches actions.app.setUnitUrl on success', () => {
      dispatch.mockClear();
      dispatchedAction.fetchUnit.onSuccess(testValue);
      expect(dispatch).toHaveBeenCalledWith(actions.app.setUnitUrl(testValue));
    });
    it('dispatches actions.app.setUnitUrl on failure', () => {
      dispatch.mockClear();
      dispatchedAction.fetchUnit.onFailure(testValue);
      expect(dispatch).toHaveBeenCalledWith(actions.app.setUnitUrl(testValue));
    });
  });
  describe('initialize', () => {
    it('dispatches actions.app.initialize, and then fetches both block and unit', () => {
      const {
        fetchBlock,
        fetchUnit,
        fetchStudioView,
        fetchImages,
        fetchAssets,
      } = thunkActions;
      thunkActions.fetchBlock = () => 'fetchBlock';
      thunkActions.fetchUnit = () => 'fetchUnit';
      thunkActions.fetchStudioView = () => 'fetchStudioView';
      thunkActions.fetchImages = () => 'fetchImages';
      thunkActions.fetchAssets = () => 'fetchAssets';
      thunkActions.initialize(testValue)(dispatch);
      expect(dispatch.mock.calls).toEqual([
        [actions.app.initialize(testValue)],
        [thunkActions.fetchBlock()],
        [thunkActions.fetchUnit()],
        [thunkActions.fetchStudioView()],
        [thunkActions.fetchImages()],
        [thunkActions.fetchAssets()],
      ]);
      thunkActions.fetchBlock = fetchBlock;
      thunkActions.fetchUnit = fetchUnit;
      thunkActions.fetchStudioView = fetchStudioView;
      thunkActions.fetchImages = fetchImages;
      thunkActions.fetchAssets = fetchAssets;
    });
  });
  describe('saveBlock', () => {
    let returnToUnit;
    let calls;
    beforeEach(() => {
      returnToUnit = jest.fn();
      thunkActions.saveBlock({ content: testValue, returnToUnit })(dispatch);
      calls = dispatch.mock.calls;
    });
    it('dispatches actions.app.setBlockContent with content, before dispatching saveBlock', () => {
      expect(calls[0]).toEqual([actions.app.setBlockContent(testValue)]);
      const saveCall = calls[1][0];
      expect(saveCall.saveBlock).not.toEqual(undefined);
    });
    it('dispatches saveBlock with passed content', () => {
      expect(calls[1][0].saveBlock.content).toEqual(testValue);
    });
    it('dispatches actions.app.setSaveResponse with response and then calls returnToUnit', () => {
      dispatch.mockClear();
      const response = 'testRESPONSE';
      calls[1][0].saveBlock.onSuccess(response);
      expect(dispatch).toHaveBeenCalledWith(actions.app.setSaveResponse(response));
      expect(returnToUnit).toHaveBeenCalled();
    });
  });
  describe('fetchImages', () => {
    it('dispatches fetchImages action with setImages for onSuccess param', () => {
      const response = 'testRESPONSE';
      thunkActions.fetchImages()(dispatch);
      const [[dispatchCall]] = dispatch.mock.calls;
      dispatchCall.fetchImages.onSuccess(response);
      expect(dispatch).toHaveBeenCalledWith(actions.app.setImages(response));
    });
  });
  describe('fetchAssets', () => {
    it('dispatches fetchAssets action with setAssets for onSuccess param', () => {
      const response = { data: { assets: 'testRESPONSE' } };
      thunkActions.fetchAssets()(dispatch);
      const [[dispatchCall]] = dispatch.mock.calls;
      dispatchCall.fetchAssets.onSuccess(response);
      expect(dispatch).toHaveBeenCalledWith(actions.app.setAssets(response.data.assets));
    });
  });
  describe('uploadImage', () => {
    const setSelection = jest.fn();
    beforeEach(() => {
      thunkActions.uploadImage({ file: testValue, setSelection })(dispatch);
      [[dispatchedAction]] = dispatch.mock.calls;
    });
    it('dispatches uploadImage action', () => {
      expect(dispatchedAction.uploadImage).not.toBe(undefined);
    });
    test('passes file as image prop', () => {
      expect(dispatchedAction.uploadImage.image).toEqual(testValue);
    });
    test('onSuccess: calls setSelection with camelized response.data.asset', () => {
      dispatchedAction.uploadImage.onSuccess({ data: { asset: testValue } });
      expect(setSelection).toHaveBeenCalledWith(camelizeKeys(testValue));
    });
  });
});
