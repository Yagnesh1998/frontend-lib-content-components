import React from 'react';
import PropTypes from 'prop-types';

import { Form } from '@edx/paragon';
import EditConfirmationButtons from './EditConfirmationButtons';

export const EditableHeader = ({
  handleChange,
  updateTitle,
  handleKeyDown,
  inputRef,
  localTitle,
  cancelEdit,
}) => (
  <Form.Group>
    <Form.Control
      autoFocus
      trailingElement={<EditConfirmationButtons {...{ updateTitle, cancelEdit }} />}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder="Title"
      ref={inputRef}
      value={localTitle}
    />
  </Form.Group>
);
EditableHeader.defaultProps = {
  inputRef: null,
};
EditableHeader.propTypes = {
  inputRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any }),
  ]),
  handleChange: PropTypes.func.isRequired,
  updateTitle: PropTypes.func.isRequired,
  handleKeyDown: PropTypes.func.isRequired,
  localTitle: PropTypes.string.isRequired,
  cancelEdit: PropTypes.func.isRequired,
};

export default EditableHeader;
