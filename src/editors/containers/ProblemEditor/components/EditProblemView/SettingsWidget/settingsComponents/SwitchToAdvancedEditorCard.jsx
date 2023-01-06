import React from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from '@edx/frontend-platform/i18n';
import { Button, Card } from '@edx/paragon';
import PropTypes from 'prop-types';
import messages from '../messages';
import { thunkActions } from '../../../../../../data/redux';

export const SwitchToAdvancedEditorCard = ({
  switchToAdvancedEditor,
  // inject
  intl,
}) => (
  <Card>
    <Button
      className="my-3 ml-2"
      variant="link"
      size="inline"
      onClick={switchToAdvancedEditor}
    >
      <FormattedMessage {...messages.SwitchButtonLabel} />
    </Button>
  </Card>
);

SwitchToAdvancedEditorCard.propTypes = {
  switchToAdvancedEditor: PropTypes.func.isRequired,
};

export const mapStateToProps = () => ({
});
export const mapDispatchToProps = {
  switchToAdvancedEditor: thunkActions.problem.switchToAdvancedEditor,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(SwitchToAdvancedEditorCard));
