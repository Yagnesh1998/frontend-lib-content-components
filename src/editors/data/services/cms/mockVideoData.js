import PropTypes from 'prop-types';
import LicenseTypes from '../../constants/licenses';

export const videoDataProps = {
  videoSource: PropTypes.string,
  videoId: PropTypes.string,
  fallbackVideos: PropTypes.arrayOf(PropTypes.string),
  allowVideoDownloads: PropTypes.bool,
  thumbnail: PropTypes.string,
  transcripts: PropTypes.objectOf(PropTypes.string),
  allowTranscriptDownloads: PropTypes.bool,
  duration: PropTypes.shape({
    startTime: PropTypes.number,
    stopTime: PropTypes.number,
    total: PropTypes.number,
  }),
  showTranscriptByDefult: PropTypes.bool,
  handout: PropTypes.string,
  licenseType: PropTypes.string,
  licenseDetails: PropTypes.shape({
    attribution: PropTypes.bool,
    noncommercial: PropTypes.bool,
    noDerivatives: PropTypes.bool,
    shareAlike: PropTypes.bool,
  }),
};

export const singleVideoData = {
  videoSource: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  videoId: 'f36f06b5-92e5-47c7-bb26-bcf986799cb7',
  fallbackVideos: [
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  ],
  allowVideoDownloads: true,
  thumbnail: null, // filename
  transcripts: {
    en: { filename: 'my-transcript-url' },
  },
  allowTranscriptDownloads: false,
  duration: {
    startTime: 0,
    stopTime: 0,
    total: 0,
  },
  showTranscriptByDefault: false,
  handout: 'my-handout-url',
  licenseType: LicenseTypes.creativeCommons,
  licenseDetails: {
    attribution: false,
    noncommercial: false,
    noDerivatives: false,
    shareAlike: false,
  },
};
