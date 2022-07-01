import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';

import store from './data/store';
import Editor from './Editor';

export const EditorPage = ({
  courseId,
  blockType,
  blockId,
  lmsEndpointUrl,
  studioEndpointUrl,
  onClose,
  mockRaw,
}) => (
  <Provider store={store}>
    <Editor
      {...{
        onClose,
        learningContextId: courseId,
        blockType,
        blockId,
        lmsEndpointUrl,
        studioEndpointUrl,
        mockRaw,
      }}
    />
  </Provider>
);
EditorPage.defaultProps = {
  blockId: null,
  courseId: null,
  lmsEndpointUrl: null,
  mockRaw: false,
  onClose: null,
  studioEndpointUrl: null,
};

EditorPage.propTypes = {
  blockId: PropTypes.string,
  blockType: PropTypes.string.isRequired,
  courseId: PropTypes.string,
  lmsEndpointUrl: PropTypes.string,
  mockRaw: PropTypes.bool,
  onClose: PropTypes.func,
  studioEndpointUrl: PropTypes.string,
};

export default EditorPage;
