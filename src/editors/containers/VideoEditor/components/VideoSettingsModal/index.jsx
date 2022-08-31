import React from 'react';
import PropTypes from 'prop-types';

import { thunkActions } from '../../../../data/redux';
// import VideoPreview from './components/VideoPreview';
import ErrorSummary from './components/ErrorSummary';
import DurationWidget from './components/DurationWidget';
import HandoutWidget from './components/HandoutWidget';
import LicenseWidget from './components/LicenseWidget';
import ThumbnailWidget from './components/ThumbnailWidget';
import TranscriptsWidget from './components/TranscriptsWidget';
import VideoSourceWidget from './components/VideoSourceWidget';
import './index.scss';

export const hooks = {
  onInputChange: (handleValue) => (e) => handleValue(e.target.value),
  onCheckboxChange: (handleValue) => (e) => handleValue(e.target.checked),
  onSave: (dispatch) => () => {
    dispatch(thunkActions.video.saveVideoData());
  },
};

export const VideoSettingsModal = ({
  error,
}) => (
  <div className="video-settings-modal row">
    <div className="video-preview col col-4">
      Video Preview goes here
      {/* <VideoPreview /> */}
    </div>
    <div className="video-controls col col-8">
      <ErrorSummary {...{error}} />
      <h3>Settings</h3>
      <VideoSourceWidget error={error.videoSource} />
      <ThumbnailWidget error={error.thumbnail} />
      <TranscriptsWidget error={error.transcripts} />
      <DurationWidget error={error.duration} />
      <HandoutWidget error={error.handout} />
      <LicenseWidget error={error.license} />
    </div>
  </div>
);

VideoSettingsModal.defaultPropts = {
  error: {
    duration: null,
    handout: null,
    license: null,
    thumbnail: null,
    transcripts: null,
    videoSource: null,
  },
};
VideoSettingsModal.propTypes = {
  error: PropTypes.object,
};

export default VideoSettingsModal;
