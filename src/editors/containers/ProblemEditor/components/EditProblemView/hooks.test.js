import { ProblemTypeKeys } from '../../../../data/constants/problem';
import * as hooks from './hooks';

const mockRawOLX = 'rawOLX';
const mockBuiltOLX = 'builtOLX';

jest.mock('../../data/ReactStateOLXParser', () => (
  jest.fn().mockImplementation(() => ({
    buildOLX: () => mockBuiltOLX,
  }))
));
jest.mock('../../data/ReactStateSettingsParser');

describe('EditProblemView hooks parseState', () => {
  describe('fetchEditorContent', () => {
    const getContent = () => '<p>testString</p>';
    test('returns answers', () => {
      window.tinymce.editors = { 'answer-A': { getContent } };
      const editorObject = hooks.fetchEditorContent({ format: '' });
      expect(editorObject).toEqual({ answers: { A: '<p>testString</p>' }, hints: [] });
    });
    test('returns hints', () => {
      window.tinymce.editors = { 'hint-0': { getContent } };
      const editorObject = hooks.fetchEditorContent({ format: '' });
      expect(editorObject).toEqual({ hints: ['<p>testString</p>'] });
    });
    test('returns question', () => {
      window.tinymce.editors = { question: { getContent } };
      const editorObject = hooks.fetchEditorContent({ format: '' });
      expect(editorObject).toEqual({ question: '<p>testString</p>', hints: [] });
    });
    test('returns selectedFeedback', () => {
      window.tinymce.editors = { 'selectedFeedback-A': { getContent } };
      const editorObject = hooks.fetchEditorContent({ format: '' });
      expect(editorObject).toEqual({ selectedFeedback: { A: '<p>testString</p>' }, hints: [] });
    });
    test('returns unselectedFeedback', () => {
      window.tinymce.editors = { 'unselectedFeedback-A': { getContent } };
      const editorObject = hooks.fetchEditorContent({ format: '' });
      expect(editorObject).toEqual({ unselectedFeedback: { A: '<p>testString</p>' }, hints: [] });
    });
    test('returns groupFeedback', () => {
      window.tinymce.editors = { 'groupFeedback-0': { getContent } };
      const editorObject = hooks.fetchEditorContent({ format: '' });
      expect(editorObject).toEqual({ groupFeedback: { 0: '<p>testString</p>' }, hints: [] });
    });
    test('returns groupFeedback', () => {
      window.tinymce.editors = {};
      const editorObject = hooks.fetchEditorContent({ format: '' });
      expect(editorObject).toEqual({ hints: [] });
    });
  });
  describe('parseState', () => {
    const toStringMock = () => mockRawOLX;
    const refMock = { current: { state: { doc: { toString: toStringMock } } } };

    test('default problem', () => {
      const res = hooks.parseState({
        problem: 'problem',
        isAdvanced: false,
        ref: refMock,
        assets: {},
      })();
      expect(res.olx).toBe(mockBuiltOLX);
    });
    test('advanced problem', () => {
      const res = hooks.parseState({
        problem: 'problem',
        isAdvanced: true,
        ref: refMock,
        assets: {},
      })();
      expect(res.olx).toBe(mockRawOLX);
    });
  });
  describe('checkNoAnswers', () => {
    const openNoAnswerModal = jest.fn();
    describe('hasNoTitle', () => {
      const problem = {
        problemType: ProblemTypeKeys.NUMERIC,
      };
      beforeEach(() => {
        jest.clearAllMocks();
      });
      it('returns true for numerical problem with empty title', () => {
        const expected = hooks.checkForNoAnswers({
          openNoAnswerModal,
          problem: {
            ...problem,
            answers: [{ id: 'A', title: '', correct: true }],
          },
        });
        expect(openNoAnswerModal).toHaveBeenCalled();
        expect(expected).toEqual(true);
      });
      it('returns false for numerical problem with title', () => {
        const expected = hooks.checkForNoAnswers({
          openNoAnswerModal,
          problem: {
            ...problem,
            answers: [{ id: 'A', title: 'sOmevALUe', correct: true }],
          },
        });
        expect(openNoAnswerModal).not.toHaveBeenCalled();
        expect(expected).toEqual(false);
      });
    });
    describe('hasNoCorrectAnswer', () => {
      const problem = {
        problemType: ProblemTypeKeys.SINGLESELECT,
      };
      beforeEach(() => {
        jest.clearAllMocks();
      });
      it('returns true for single select problem with empty title', () => {
        window.tinymce.editors = { 'answer-A': { getContent: () => '' } };
        const expected = hooks.checkForNoAnswers({
          openNoAnswerModal,
          problem: {
            ...problem,
            answers: [{ id: 'A', title: '', correct: true }],
          },
        });
        expect(openNoAnswerModal).toHaveBeenCalled();
        expect(expected).toEqual(true);
      });
      it('returns true for single select with title but no correct answer', () => {
        window.tinymce.editors = { 'answer-A': { getContent: () => 'sOmevALUe' } };
        const expected = hooks.checkForNoAnswers({
          openNoAnswerModal,
          problem: {
            ...problem,
            answers: [{ id: 'A', title: 'sOmevALUe', correct: false }],
          },
        });
        expect(openNoAnswerModal).toHaveBeenCalled();
        expect(expected).toEqual(true);
      });
      it('returns true for single select with title and correct answer', () => {
        window.tinymce.editors = { 'answer-A': { getContent: () => 'sOmevALUe' } };
        const expected = hooks.checkForNoAnswers({
          openNoAnswerModal,
          problem: {
            ...problem,
            answers: [{ id: 'A', title: 'sOmevALUe', correct: true }],
          },
        });
        expect(openNoAnswerModal).not.toHaveBeenCalled();
        expect(expected).toEqual(false);
      });
    });
  });
});
