import React from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Icon,
  IconButton,
} from '@edx/paragon';
import {
  Locked,
  Unlocked,
} from '@edx/paragon/icons';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import hooks from './hooks';
import messages from './messages';

/**
 * Wrapper for image dimension inputs and the lock checkbox.
 * @param {bool} isLocked - are dimensions locked
 * @param {func} lock - lock dimensions
 * @param {func} setHeight - updates dimensions based on new height
 * @param {func} setWidth - updates dimensions based on new width
 * @param {func} unlock - unlock dimensions
 * @param {func} updateDimensions - update dimensions callback
 * @param {obj} value - local dimension values { height, width }
 */
export const DimensionControls = ({
  isLocked,
  isPercentage,
  lock,
  setHeight,
  setIsPercentage,
  setWidth,
  unlock,
  updateDimensions,
  validation,
  value,
  // inject
  intl,
}) => ((value !== null) && (
  <Form.Group>
    <Form.Label as="h4">
      <FormattedMessage {...messages.imageDimensionsLabel} />
    </Form.Label>
    <Form.Checkbox
      checked={isPercentage}
      className="mt-4.5 decorative-control-label"
      onChange={hooks.onCheckboxChange(setIsPercentage)}
    >
      <Form.Label>
        <FormattedMessage {...messages.decorativeDimensionCheckboxLabel} />
      </Form.Label>
    </Form.Checkbox>
    <div className="mt-4.5">
      <Form.Control
        className="dimension-input"
        type="number"
        value={value.width}
        min={1}
        onChange={hooks.onInputChange(setWidth)}
        onBlur={updateDimensions}
        floatingLabel={intl.formatMessage(messages.widthFloatingLabel)}
      />
      <Form.Control
        className="dimension-input"
        type="number"
        value={value.height}
        min={1}
        onChange={hooks.onInputChange(setHeight)}
        onBlur={updateDimensions}
        floatingLabel={intl.formatMessage(messages.heightFloatingLabel)}
      />
      <IconButton
        className="d-inline-block"
        alt={
          isLocked
            ? intl.formatMessage(messages.unlockDimensionsLabel)
            : intl.formatMessage(messages.lockDimensionsLabel)
        }
        iconAs={Icon}
        src={isLocked ? Locked : Unlocked}
        onClick={isLocked ? unlock : lock}
      />
    </div>
    {validation.show
      && (
        <Form.Control.Feedback type="invalid">
          <FormattedMessage {...messages.dimensionLocalFeedback} />
        </Form.Control.Feedback>
      )}
  </Form.Group>
));
DimensionControls.defaultProps = {
  value: {
    height: 100,
    width: 100,
  },
};
DimensionControls.propTypes = ({
  value: PropTypes.shape({
    height: PropTypes.number,
    width: PropTypes.number,
  }),
  setHeight: PropTypes.func.isRequired,
  setWidth: PropTypes.func.isRequired,
  isLocked: PropTypes.bool.isRequired,
  lock: PropTypes.func.isRequired,
  unlock: PropTypes.func.isRequired,
  updateDimensions: PropTypes.func.isRequired,
  // inject
  intl: intlShape.isRequired,
});

export default injectIntl(DimensionControls);
