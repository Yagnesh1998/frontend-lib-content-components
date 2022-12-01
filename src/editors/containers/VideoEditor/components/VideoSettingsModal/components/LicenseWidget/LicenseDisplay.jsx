import React from 'react';
import PropTypes from 'prop-types';

import {
  FormattedMessage,
  injectIntl,
} from '@edx/frontend-platform/i18n';
import {
  Card,
  Stack,
  Hyperlink,
} from '@edx/paragon';

import { LicenseLevel, LicenseTypes } from '../../../../../../data/constants/licenses';

import LicenseBlurb from './LicenseBlurb';
import { messages } from './messages';

export const LicenseDisplay = ({
  license,
  details,
  licenseDescription,
  level,
}) => {
  if (license !== LicenseTypes.select) {
    return (
      <Stack gap={3}>
        <div className="x-small"><FormattedMessage {...messages.displaySubsectionTitle} /></div>
        <div className="small border border-gray-300 rounded pt-2 px-3 pb-3">
          <LicenseBlurb license={license} details={details} />
          <div className="x-small">{licenseDescription}</div>
        </div>
        {level !== LicenseLevel.course ? (
          <Hyperlink
            className="text-primary-500 x-small"
            destination="https://creativecommons.org/about"
            target="_blank"
          >
            <FormattedMessage {...messages.viewLicenseDetailsLabel} />
          </Hyperlink>
        ) : null }
      </Stack>
    );
  }
  return null;
};

LicenseDisplay.propTypes = {
  license: PropTypes.string.isRequired,
  details: PropTypes.shape({
    attribution: PropTypes.bool.isRequired,
    noncommercial: PropTypes.bool.isRequired,
    noDerivatives: PropTypes.bool.isRequired,
    shareAlike: PropTypes.bool.isRequired,
  }).isRequired,
  level: PropTypes.string.isRequired,
  licenseDescription: PropTypes.func.isRequired,
};

export default injectIntl(LicenseDisplay);
